/*
 * Copyright (c) 2020, 2025, Oracle and/or its affiliates.
 */

#include <config.h>
#include <cups/cups.h>
#include <errno.h>
#include <stdio.h>
#include <stdarg.h>
#include <stdlib.h>
#include <strings.h>
#include <tsol/label.h>
#include <unistd.h>

#include <cupsfilters/ipp.h>
#include <cupsfilters/filter.h>
//#include <cupsfilters/libcups2-private.h>

/*
 * Global variables
 */

cf_logfunc_t logfunc;
void *logdata;


#define ME "cfFilterLabelToPS"

#define LOG(level, fmt, ...) \
	if (logfunc) logfunc(logdata, level, ME ": " fmt, ##__VA_ARGS__)
#define FAIL(fmt, ...) {\
	LOG(CF_LOGLEVEL_ERROR, fmt, ##__VA_ARGS__);\
	return 1;\
}
#define DEBUG(fmt, ...) \
	LOG(CF_LOGLEVEL_DEBUG, fmt, ##__VA_ARGS__);


struct info_t {
	char *Job_Printer;
	char *Job_Host;
	char *Job_User;
	char *Job_JobID;
	char *Job_Title;
	char *Job_DoPageLabels;
	char *Job_Date;
	char *Job_Hash;
	char *Job_Classification;
	char *Job_Protect;
	char *Job_Caveats;
	char *Job_Channels;
	char *Job_SL_Internal;
};

struct template_t {
	char *template;
	char *templateBanner;
	char *templateTrailer;
};


/*
 * Misc
 */

int process_file(cups_file_t *inputfp, int (*parse_line)(char *, int, va_list args), ...) {
	va_list args;

	char line[8192];
	size_t linenum = 0;
	va_start(args, parse_line);

	while (cupsFileGets(inputfp, line, sizeof(line)))
		if (parse_line(line, linenum++, args)) {
			va_end(args);
			return 1;
		}

	va_end(args);
	return 0;
}

/*
 * Banner file
 */

void free_template(struct template_t *template) {
	if (template->template) free(template->template);
	if (template->templateBanner) free(template->templateBanner);
	if (template->templateTrailer) free(template->templateTrailer);
}

#define BANNER_TYPE	"#LABELED-BANNER"
#define BANNER_TEMPLATE	"Template"
#define BANNER_HEADER	"TemplateBanner"
#define BANNER_TRAILER	"TemplateTrailer"
int parse_line_banner(char *line, int linenum, va_list args) {
	static struct template_t *template = NULL;

	// header check
	if (linenum == 0 && strcmp(line, BANNER_TYPE))
		FAIL("Files has wrong type.")
	// ignore comments
	else if (line[0] == '#')
		return 0;
	// parse known keyword(s)
	else {
		int err = 0;
		char *key = strsep(&line, " \t");
		char *value = strsep(&line, " \t");

		if (!template)
			template = va_arg(args, struct template_t *);

		if (!strcmp(key, BANNER_TEMPLATE)) {
			if (!(template->template = strdup(value)))
				err = 1;
		} else if (!strcmp(key, BANNER_HEADER)) {
			if (!(template->templateBanner = strdup(value)))
				err = 1;
		} else if (!strcmp(key, BANNER_TRAILER)) {
			if (!(template->templateTrailer = strdup(value)))
				err = 1;
		} else {
			free_template(template);
			FAIL("Invalid keyword '%s'.", key);
		}

		if (err) {
			free_template(template);
			FAIL("strdup failed: %s.", strerror(errno));
		}
	}

	return 0;
}

int copy_to_output(char *line, int lineno, va_list args) {
	cups_file_t *outputfp = va_arg(args, cups_file_t *);

	if (cupsFilePrintf(outputfp, "%s\n", line) < 0)
		FAIL("cupsFilePuts failed: %s.", strerror(errno));

	return 0;
}

/*
 * Info
 */

void free_info(struct info_t *info) {
	if (info->Job_Printer) free(info->Job_Printer);
	if (info->Job_Host) free(info->Job_Host);
	if (info->Job_User) free(info->Job_User);
	if (info->Job_JobID) free(info->Job_JobID);
	if (info->Job_Title) free(info->Job_Title);
	if (info->Job_DoPageLabels) free(info->Job_DoPageLabels);
	if (info->Job_Date) free(info->Job_Date);
	if (info->Job_Hash) free(info->Job_Hash);
	if (info->Job_Classification) free(info->Job_Classification);
	if (info->Job_Protect) free(info->Job_Protect);
	if (info->Job_Caveats) free(info->Job_Caveats);
	if (info->Job_Channels) free(info->Job_Channels);
	if (info->Job_SL_Internal) free(info->Job_SL_Internal);
}

#define GI_CLEANUP\
	if (options)\
		cupsFreeOptions(num_options, options);\
	if (host)\
		free(host);\
	if (date)\
		free(date);\
	if (hash)\
		free(hash);\
	if (file_label)\
		m_label_free(file_label)
#define GI_DUP(var, str)\
	{\
		char *gi_dup_tmp = str;\
		if (gi_dup_tmp && !(var = strdup(gi_dup_tmp))) {\
			GI_CLEANUP;\
			FAIL("strdup failed: %s.", strerror(errno));\
		}\
	}
#define GI_ASPRINTF(var, fmt, ...)\
	if (asprintf(&(var), fmt, __VA_ARGS__) == -1) {\
		GI_CLEANUP;\
		FAIL("asprintf failed: %s.", strerror(errno));\
	}
#define GI_LABEL_TO_STR(var, name, names)\
	if (label_to_str(file_label, &(var), name, names) != 0) {\
		GI_CLEANUP;\
		FAIL("label_to_str " #name " failed: %s.", strerror(errno));\
	}
#define GI_TRUSTED_FAIL(fmt, ...)\
	{\
		GI_CLEANUP;\
		FAIL(fmt, __VA_ARGS__);\
	}
int get_info(struct info_t *info, cf_filter_data_t *data, int inputfd, int *banner) {
	int num_options = 0;
	cups_option_t *options = NULL;
	char *host = NULL;
	char *date = NULL;
	char *hash = NULL;
	static m_label_t *file_label = NULL;
	const char *tmp;

	/*
	 * Gather information
	 */

	num_options = cfJoinJobOptionsAndAttrs(data, num_options, &options);

	// fill banner, default is to print banner
	if (cupsGetOption("trailer", num_options, options))
		*banner = 0;
	else
		*banner = 1;

	// host
	tmp = cupsGetOption("job-originating-host-name", num_options, options);
	GI_DUP(host, (char *) tmp);
	if (tmp && !strcmp(tmp, "localhost")) {
		char *sa = getenv("SERVER_ADMIN");
		if (sa) {
			size_t chars;
		       	if ((chars = strcspn(sa, "@!"))) {
				free(host);
				GI_DUP(host, ((char *) sa) + chars + 1);
			}
		}
	} 

	// time
	tmp = cupsGetOption("time-at-creation", num_options, options);
	if (tmp) {
		time_t c_time = atol(tmp);
		GI_DUP(date, ctime(&c_time));
		date[strlen(date) - 1] = 0;
		GI_ASPRINTF(hash, "%ld", c_time % 100000L);
	}

	// trusted
	if (!(file_label = m_label_alloc(MAC_LABEL)))
		GI_TRUSTED_FAIL("m_label_alloc failed: %s.", strerror(errno));

	if ((tmp = getenv("CLASSIFICATION"))) {
		int err;
		m_label_free(file_label);
		file_label = NULL;
		if (str_to_label(tmp, &file_label, MAC_LABEL,
			L_NO_CORRECTION, &err) == -1)
			GI_TRUSTED_FAIL("str_to_label failed: %s.", strerror(errno));
	} else if (fgetlabel(inputfd, file_label) != 0)
		GI_TRUSTED_FAIL("fgetlabel failed on inputfd.", strerror(errno));

	/*
	 * Fill info
	 */

	GI_DUP(info->Job_Printer, data->printer);
	GI_DUP(info->Job_Host, host);
	GI_DUP(info->Job_User, data->job_user);
	GI_ASPRINTF(info->Job_JobID, "%s-%d", data->printer, data->job_id);
	GI_DUP(info->Job_Title, data->job_title);
	GI_DUP(info->Job_DoPageLabels, "NO");
	GI_DUP(info->Job_Date, date);
	GI_DUP(info->Job_Hash, hash);
	GI_LABEL_TO_STR(info->Job_Classification, PRINTER_TOP_BOTTOM, DEF_NAMES);
	GI_LABEL_TO_STR(info->Job_Protect, PRINTER_LABEL, DEF_NAMES);
	GI_LABEL_TO_STR(info->Job_Caveats, PRINTER_CAVEATS, DEF_NAMES);
	GI_LABEL_TO_STR(info->Job_Channels, PRINTER_CHANNELS, DEF_NAMES);
	GI_LABEL_TO_STR(info->Job_SL_Internal, M_LABEL, LONG_NAMES);

	GI_CLEANUP;

	return 0;
}


/*
 * Emit
 */

char * template_path(const char *datadir, const char *name) {
	char *result;

	if (!name)
		return NULL;

	if (name[0] == '/')
		return strdup(name);

	if ((result = malloc(strlen(datadir) + strlen(name) + 7)) == NULL)
		return NULL;
	sprintf(result, "%s/%s", datadir, name);

	return result;
}

int emit_dict(cups_file_t *fp, struct info_t *info){
	DEBUG("Going to emit dictionary.");

#define DICT_FMT \
		"begin\n"\
		"  /Job_Printer		(%1$s) def\n"\
		"  /Job_Host		(%2$s) def\n"\
		"  /Job_User		(%3$s) def\n"\
		"  /Job_JobID		(%4$s) def\n"\
		"  /Job_Title		(%5$s) def\n"\
		"  /Job_DoPageLabels	(%6$s) def\n"\
		"  /Job_Date		(%7$s) def\n"\
		"  /Job_Hash		(%8$s) def\n"\
		"  /Job_Classification	(%9$s) def\n"\
		"  /Job_Protect		(%10$s) def\n"\
		"  /Job_Caveats		(%11$s) def\n"\
		"  /Job_Channels	(%12$s) def\n"\
		"  /Job_SL_Internal	(%13$s) def\n"\
		"end\n"
#define DICT_VARS \
		info->Job_Printer,\
		info->Job_Host,\
		info->Job_User,\
		info->Job_JobID,\
		info->Job_Title,\
		info->Job_DoPageLabels,\
		info->Job_Date,\
		info->Job_Hash,\
		info->Job_Classification,\
		info->Job_Protect,\
		info->Job_Caveats,\
		info->Job_Channels,\
		info->Job_SL_Internal

	DEBUG("Dictionary: \n" DICT_FMT, DICT_VARS);

	if (cupsFilePrintf(fp, 
		"%%!PS-Adobe-3.0\n"
		"%%%%\n"
		"%%%% Copyright (c) 2020, 2025, Oracle and/or its affiliates.\n"
		"%%%%\n"
		"%%%%Pages: 1\n"
		"%%%%EndComments\n"
		"%%%%BeginProlog\n"
		"%%%% Create JobDict if it doesn't exist\n"
		"userdict /JobDict known not {\n"
		"  userdict /JobDict 100 dict put\n"
		"} if\n"
		"\n"
		"%%%% Define job parameters, including TSOL security info\n"
		"JobDict\n"
		DICT_FMT
		"\n"
		"%%%%EndProlog\n"
		"%%%%Page: 1 1\n",
		DICT_VARS) < 0)
		FAIL("printf failed: %s.", strerror(errno));

	return 0;
}

int emit_template(cups_file_t *outputfp, const char *datadir, struct template_t *template) {
	cups_file_t *inputfp;
	int ret;
	char *path = template_path(datadir, template->template);

	if (!path)
		FAIL("Template file was not specified in the banner file.");

	DEBUG("Going to process file \"%s\".", path);

	if (!(inputfp = cupsFileOpen(path, "r")))
		FAIL("Cannot open file \"%s\".", path);

	ret = process_file(inputfp, copy_to_output, outputfp);

	cupsFileClose(inputfp);

	return ret;
}

int emit_banner_or_trailer(cups_file_t *outputfp, const char *datadir,
	struct template_t *template, int banner) {
	cups_file_t *inputfp;
	int ret;
	char *path = template_path(datadir, banner?
		template->templateBanner: template->templateTrailer);

	if (!path)
		return 0;

	DEBUG("Going to process file \"%s\".", path);

	if (!(inputfp = cupsFileOpen(path, "r")))
		FAIL("Cannot open file \"%s\".", path);

	ret = process_file(inputfp, copy_to_output, outputfp);

	cupsFileClose(inputfp);

	return ret;
}

int cfFilterLabelToPS(
	int inputfd,		// I - File descriptor input stream
	int outputfd,		// I - File descriptor output stream
	int inputseekable,	// I - Is input stream seekable?
				//     (unused)
	cf_filter_data_t *data,	// I - Job and printer data
	void *parameters)	// I - Filter-specific parameters -
				//     Template/Banner data directory
{
	cups_file_t *inputfp = NULL;
	cups_file_t *outputfp = NULL;
	cf_filter_iscanceledfunc_t iscanceled = data->iscanceledfunc;
	void *icd = data->iscanceleddata;
	struct info_t *info;
	struct template_t *template;
	int banner;
	int err = 0;

	logfunc = data->logfunc;
	logdata = data->logdata;

	if (!is_system_labeled())
		FAIL("System is not labeled.");

	if (!(info = calloc(1, sizeof(struct info_t))))
		FAIL("calloc failed: %s.", strerror(errno));
	if (!(template = calloc(1, sizeof(struct template_t)))) {
		free(info);
		FAIL("calloc failed: %s.", strerror(errno));
	}

	err = get_info(info, data, inputfd, &banner);

	if (!err && (inputfp = cupsFileOpenFd(inputfd, "rb")) == NULL) {
		if (!iscanceled || !iscanceled(icd))
			LOG(CF_LOGLEVEL_ERROR, "Unable to open input data stream.");
		err = 1;
	}

	if (!err && process_file(inputfp, parse_line_banner, template))
		err = 1;

	if (inputfp)
		cupsFileClose(inputfp);

	if (!err) {
		DEBUG("Template: \"%s\".", template->template);
		DEBUG("Template banner: \"%s\".", template->templateBanner);
		DEBUG("Template trailer: \"%s\".", template->templateTrailer);
	}

	if (!err && (outputfp = cupsFileOpenFd(outputfd, "w")) == NULL) {
		if (!iscanceled || !iscanceled(icd))
			LOG(CF_LOGLEVEL_ERROR, "Unable to open output data stream.");
		err = 1;
	}

	if (!err && emit_dict(outputfp, info))
		err = 1;
	if (!err && emit_template(outputfp, (const char *) parameters,
		template))
		err = 1;
	if (!err && emit_banner_or_trailer(outputfp, (const char *) parameters,
		template, banner))
		err = 1;

	if (outputfp)
		cupsFileClose(outputfp);

	if (info) {
		free_info(info);
		free(info);
	}
	if (template) {
		free_template(template);
		free(template);
	}

	return err;
}
