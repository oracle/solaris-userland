/*
 * Copyright (c) 2004, Oracle and/or its affiliates. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice (including the next
 * paragraph) shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

#include <stdio.h>		/* fprintf */
#include <stdlib.h>		/* malloc */
#include <strings.h>		/* strpbrk strchr strlen */ 
#include <sys/types.h>		/* uint16_t (indirectly) */

#include <gfx_gamma_pack.h>



typedef enum {
	PackSingle,
	PackTinyGroup
} PackTableStateType;



/*
 *************  Strings for Integer pack and unpack  ****************
 *
 *	Note you need to escape " with \"  and  \ with \\
 *
 */

#define GammaIntStartPacked ('|')   /* 0x7c - Packed Region Start Token */
#define GammaIntReserved1   ('~')   /* 0x7e - reserved, for future use */
#define GammaIntReserved2   ('\"')  /* Hard to pack into OWconfig */
#define GammaIntReserved3   ('\\')  /* Hard to pack into OWconfig */
#define GammaIntReserved4   (' ')   /* Space might get whitespace altered */

static  char gamma_tbl_int_pos[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                                   ":;?!@#$%^&,.";
static  char gamma_tbl_int_neg[] = "abcdefghijklmnopqrstuvwxyz";
static  char gamma_tbl_int_lsb[] = "[]{}()<>'`+-/*=_";




/*
 *************  Packed data conversion table  ****************
 *
 *	Table is machine generated.
 *	Table create code is in gamma_test.c
 *
 */

typedef struct {
	char	ascii;    /* packed ASCII character */
	char	len;      /* number of bytes in sequence */
	char	term;     /* Does this terminate a sequence */
	int	val[4];   /* Up to 4 packed values */
} ascii_to_four_ddel;

#define DeltaTableMin      (0x21)
#define DeltaTableMax      (0x7e)

#define DeltaTableBase_4X  (0x21)
#define DeltaTableBase_2X  (0x72)
#define DeltaTableBase_1X  (0x7b)
#define DeltaTableBase_0X  (0x7e)

static ascii_to_four_ddel  delta_table[] = {
    /* ! */	{ 0x21, 4, 0, {-1, -1, -1, -1} },  /* 4X */
    /* " */	{ 0x22, 4, 0, {-1, -1, -1,  0} },
    /* # */	{ 0x23, 4, 0, {-1, -1, -1,  1} },
    /* $ */	{ 0x24, 4, 0, {-1, -1,  0, -1} },
    /* % */	{ 0x25, 4, 0, {-1, -1,  0,  0} },
    /* & */	{ 0x26, 4, 0, {-1, -1,  0,  1} },
    /* ' */	{ 0x27, 4, 0, {-1, -1,  1, -1} },
    /* ( */	{ 0x28, 4, 0, {-1, -1,  1,  0} },
    /* ) */	{ 0x29, 4, 0, {-1, -1,  1,  1} },
    /* * */	{ 0x2a, 4, 0, {-1,  0, -1, -1} },
    /* + */	{ 0x2b, 4, 0, {-1,  0, -1,  0} },
    /* , */	{ 0x2c, 4, 0, {-1,  0, -1,  1} },
    /* - */	{ 0x2d, 4, 0, {-1,  0,  0, -1} },
    /* . */	{ 0x2e, 4, 0, {-1,  0,  0,  0} },
    /* / */	{ 0x2f, 4, 0, {-1,  0,  0,  1} },
    /* 0 */	{ 0x30, 4, 0, {-1,  0,  1, -1} },
    /* 1 */	{ 0x31, 4, 0, {-1,  0,  1,  0} },
    /* 2 */	{ 0x32, 4, 0, {-1,  0,  1,  1} },
    /* 3 */	{ 0x33, 4, 0, {-1,  1, -1, -1} },
    /* 4 */	{ 0x34, 4, 0, {-1,  1, -1,  0} },
    /* 5 */	{ 0x35, 4, 0, {-1,  1, -1,  1} },
    /* 6 */	{ 0x36, 4, 0, {-1,  1,  0, -1} },
    /* 7 */	{ 0x37, 4, 0, {-1,  1,  0,  0} },
    /* 8 */	{ 0x38, 4, 0, {-1,  1,  0,  1} },
    /* 9 */	{ 0x39, 4, 0, {-1,  1,  1, -1} },
    /* : */	{ 0x3a, 4, 0, {-1,  1,  1,  0} },
    /* ; */	{ 0x3b, 4, 0, {-1,  1,  1,  1} },
    /* < */	{ 0x3c, 4, 0, { 0, -1, -1, -1} },
    /* = */	{ 0x3d, 4, 0, { 0, -1, -1,  0} },
    /* > */	{ 0x3e, 4, 0, { 0, -1, -1,  1} },
    /* ? */	{ 0x3f, 4, 0, { 0, -1,  0, -1} },
    /* @ */	{ 0x40, 4, 0, { 0, -1,  0,  0} },
    /* A */	{ 0x41, 4, 0, { 0, -1,  0,  1} },
    /* B */	{ 0x42, 4, 0, { 0, -1,  1, -1} },
    /* C */	{ 0x43, 4, 0, { 0, -1,  1,  0} },
    /* D */	{ 0x44, 4, 0, { 0, -1,  1,  1} },
    /* E */	{ 0x45, 4, 0, { 0,  0, -1, -1} },
    /* F */	{ 0x46, 4, 0, { 0,  0, -1,  0} },
    /* G */	{ 0x47, 4, 0, { 0,  0, -1,  1} },
    /* H */	{ 0x48, 4, 0, { 0,  0,  0, -1} },
    /* I */	{ 0x49, 4, 0, { 0,  0,  0,  0} },
    /* J */	{ 0x4a, 4, 0, { 0,  0,  0,  1} },
    /* K */	{ 0x4b, 4, 0, { 0,  0,  1, -1} },
    /* L */	{ 0x4c, 4, 0, { 0,  0,  1,  0} },
    /* M */	{ 0x4d, 4, 0, { 0,  0,  1,  1} },
    /* N */	{ 0x4e, 4, 0, { 0,  1, -1, -1} },
    /* O */	{ 0x4f, 4, 0, { 0,  1, -1,  0} },
    /* P */	{ 0x50, 4, 0, { 0,  1, -1,  1} },
    /* Q */	{ 0x51, 4, 0, { 0,  1,  0, -1} },
    /* R */	{ 0x52, 4, 0, { 0,  1,  0,  0} },
    /* S */	{ 0x53, 4, 0, { 0,  1,  0,  1} },
    /* T */	{ 0x54, 4, 0, { 0,  1,  1, -1} },
    /* U */	{ 0x55, 4, 0, { 0,  1,  1,  0} },
    /* V */	{ 0x56, 4, 0, { 0,  1,  1,  1} },
    /* W */	{ 0x57, 4, 0, { 1, -1, -1, -1} },
    /* X */	{ 0x58, 4, 0, { 1, -1, -1,  0} },
    /* Y */	{ 0x59, 4, 0, { 1, -1, -1,  1} },
    /* Z */	{ 0x5a, 4, 0, { 1, -1,  0, -1} },
    /* [ */	{ 0x5b, 4, 0, { 1, -1,  0,  0} },
    /* \ */	{ 0x5c, 4, 0, { 1, -1,  0,  1} },
    /* ] */	{ 0x5d, 4, 0, { 1, -1,  1, -1} },
    /* ^ */	{ 0x5e, 4, 0, { 1, -1,  1,  0} },
    /* _ */	{ 0x5f, 4, 0, { 1, -1,  1,  1} },
    /* ` */	{ 0x60, 4, 0, { 1,  0, -1, -1} },
    /* a */	{ 0x61, 4, 0, { 1,  0, -1,  0} },
    /* b */	{ 0x62, 4, 0, { 1,  0, -1,  1} },
    /* c */	{ 0x63, 4, 0, { 1,  0,  0, -1} },
    /* d */	{ 0x64, 4, 0, { 1,  0,  0,  0} },
    /* e */	{ 0x65, 4, 0, { 1,  0,  0,  1} },
    /* f */	{ 0x66, 4, 0, { 1,  0,  1, -1} },
    /* g */	{ 0x67, 4, 0, { 1,  0,  1,  0} },
    /* h */	{ 0x68, 4, 0, { 1,  0,  1,  1} },
    /* i */	{ 0x69, 4, 0, { 1,  1, -1, -1} },
    /* j */	{ 0x6a, 4, 0, { 1,  1, -1,  0} },
    /* k */	{ 0x6b, 4, 0, { 1,  1, -1,  1} },
    /* l */	{ 0x6c, 4, 0, { 1,  1,  0, -1} },
    /* m */	{ 0x6d, 4, 0, { 1,  1,  0,  0} },
    /* n */	{ 0x6e, 4, 0, { 1,  1,  0,  1} },
    /* o */	{ 0x6f, 4, 0, { 1,  1,  1, -1} },
    /* p */	{ 0x70, 4, 0, { 1,  1,  1,  0} },
    /* q */	{ 0x71, 4, 0, { 1,  1,  1,  1} },
    /* r */	{ 0x72, 2, 0, {-1, -1, 99, 99} },  /* 2X */
    /* s */	{ 0x73, 2, 0, {-1,  0, 99, 99} },
    /* t */	{ 0x74, 2, 0, {-1,  1, 99, 99} },
    /* u */	{ 0x75, 2, 0, { 0, -1, 99, 99} },
    /* v */	{ 0x76, 2, 0, { 0,  0, 99, 99} },
    /* w */	{ 0x77, 2, 0, { 0,  1, 99, 99} },
    /* x */	{ 0x78, 2, 0, { 1, -1, 99, 99} },
    /* y */	{ 0x79, 2, 0, { 1,  0, 99, 99} },
    /* z */	{ 0x7a, 2, 0, { 1,  1, 99, 99} },
    /* { */	{ 0x7b, 1, 1, {-1, 99, 99, 99} },  /* 1X */
    /* | */	{ 0x7c, 1, 1, { 0, 99, 99, 99} },
    /* } */	{ 0x7d, 1, 1, { 1, 99, 99, 99} },
    /* ~ */	{ 0x7e, 0, 1, {99, 99, 99, 99} }   /* 0X */
};



/*
 *****************************************************************************
 *****************************************************************************
 *
 *	Multibyte pack routines.
 *
 *	The functions pack a series of values in the range
 *	of {-1, 0 1}.   These values are typical of the
 *	second derivative of smooth curves.
 *	It packs sequences of up to 4 of these in a row.
 *	There are also codes for sequences of 2 and 1.
 *	One byte sequences are always at the end, and
 *	terminate the string.  There's also a "zero byte"
 *	termination code for even length strings.
 *	
 *****************************************************************************
 *****************************************************************************
 */
		

/*
 ***********************  pack_tiny_bytes()  **********************
 *
 *	This packs up to four values in array "data" and
 *	sets the result into the string character pointed
 *	to by "byte".   It returns the number of values
 *	that it packed (that were consumed from "data").
 *
 *	If no sequences are found, it stores a terminator
 *	into "byte", and returns zero ints consumed.
 *	It's up to the calling routine to determine
 *	whether to keep the terminator or ignore it.
 *	If you are currently packing a valid sequence,
 *	it's the terminator.   If your trying to find
 *	the begining of a new section, you'd ignore it.
 *	
 *	This function does not search the delta_table,
 *	but assumes a certain mathematical sequence.
 *	That's why that table was originally computer
 *	generated to achieve the data (used in unpack).
 *
 */


static int
pack_tiny_bytes (char *byte, int *data, int max_len)
{
	int            good_len;
	int            pack_len;
	int            p;
	unsigned int   pack_byte;
	unsigned int   base_byte;

	if (max_len < 0) return(-1);
	if (max_len > 4) max_len = 4;

/******	See how many of the next 4 elements are in range.
 */

	for (good_len=0 ; good_len<max_len ; good_len++) {
		if (data[good_len] < -1) break;
		if (data[good_len] >  1) break;
	}

/******	Pack 1, 2, or 4 bytes  (3 end up as 2,1)
 *	Zero is special, since 4 and 2 are not
 *	terminators. So even length sequences
 *	require an extra terminator of zero length.
 *	One element sequences will always end a section
 *	of odd length, so it's assumed to be a terminator.
 */

	switch (good_len) {
	    case 4:
		pack_len = 4;
		base_byte = DeltaTableBase_4X;
		break;
	    case 3:
	    case 2:
		pack_len = 2;
		base_byte = DeltaTableBase_2X;
		break;
	    case 1:
		pack_len = 1;
		base_byte = DeltaTableBase_1X ;
		break;
	    case 0:
		*byte     = DeltaTableBase_0X ;
		return(0);          /* end of section */
		break;
	};

/******	Pack the elements using base 3 arithmetic.
 */

	pack_byte = 0;
	for (p=0 ; p<pack_len ; p++) {
		pack_byte *= 3;
		pack_byte += data[p] + 1;  /* bias [-1,1] to [0,2] */
	}
	pack_byte += base_byte;

	*byte = (char) pack_byte;

	return (pack_len);
}


/*
 ***********************  unpack_tiny_bytes()  **********************
 *
 *	This unpacks up to four values into array "data"
 *	from the string character pointed to by "byte".
 *
 *	It returns the number of values that it unpacked 
 *	(that were filled into "data").  It will not
 *	fill in the "data" table past element "max_len"
 *	(this gives a warning in DEBUG mode).
 *	
 *	The unpacking info is contained in delta_table[].
 *
 */


static int
unpack_tiny_bytes (char byte, int *data, int max_len)
{
	int    w;
	int    offs;
	int   *tbl;
	char   endtb;
	char   words;
	char   asc_b;

	if (byte < DeltaTableMin) return(0);
	if (byte > DeltaTableMax) return(0);

	offs = byte - DeltaTableMin;

	words = delta_table[offs].len;
	asc_b = delta_table[offs].ascii;
	endtb = delta_table[offs].term;
	tbl   = delta_table[offs].val;

#ifdef DEBUG
	if (asc_b != byte) {
		fprintf(stderr, "unpack_tiny_bytes: offset wrong\n");
	}
#endif

	if (words == 0) {
		return (0);
	}

	if (words > max_len) {
		words = max_len;
#ifdef DEBUG
		fprintf(stderr, "unpack_tiny_bytes: length mismatch\n");
#endif
	}

	for (w=0 ; w < words ; w++) {
		data[w] = tbl[w];
	}

	return(words);
}




/*
 *****************************************************************************
 *****************************************************************************
 *
 *	Integer Pack Routines (and wrappers).
 *
 *	These functions pack an arbitrary integer into
 *	a series of bytes.   Small values (positive and neg)
 *	are packed into a single byte.  Larger values pack
 *	some of the "bits" into the first byte, and then
 *	calls this function recursively to pack the rest,
 *	until the number gets within the "small" range.
 *
 *	The core functions below are passed in the ranges
 *	for the positive, negative, and low order "bits".
 *	The also compute arbitrariily big numbers
 *	  (as big as your compiler's int range).
 *	These should be wrapped by functions that setup the
 *	tables to tune these ranges for a particular
 *	application (bias toward small/large, or pos/neg).
 *
 *	The wrappers far below are tuned for 8-10 bit gamma
 *	tables and their second derivitive's range.
 *
 *****************************************************************************
 *****************************************************************************
 */


/*
 ***********************  pack_int_core()  **********************
 *
 *	This packs the integer "data" into a series of bytes.
 *	The bytes are filled in starting at the location
 *	pointed to by "byte".   It's up to the caller to
 *	make sure there is enough space for this to fit.
 *	The number of bytes packed is returned to caller.
 *	
 *	The three _tbl strings control what byte values
 *	are used to pack the integers. pos_tbl and neg_tbl are
 *	used to pack small positive and negative integers.
 *	The length of these strings determine the range
 *	of small integers before it goes to multibyte packing.
 *	lsb_tbl is used for the "extra" bytes for both 
 *	positive and negative values in a multibyte sequence.
 *	The extra bytes come first, until a "small" byte
 *	actually terminates the sequence (and determines
 *	if it's positive or negative).
 *	These three strings must not contain any duplicate
 *	characters within or between the strings.
 *
 */

#if defined(DEBUG) && 0    /* Use "1" for more debug */
#define Dprintf printf
#else
static void Dprintf(char*d,...){}
#endif

static int
pack_int_core(
	char *byte,
	int   data,
	char *pos_tbl,
	char *neg_tbl,
	char *lsb_tbl  )
{
	int  msb;
	int  lsb;
	int  da2;
	int  rc;
	int  max_pos_lim;
	int  min_neg_lim;
	int  lsb_range;
	char *ovlap;

	Dprintf("\npack_int: ====> val=%d\n", data);

	max_pos_lim =   strlen(pos_tbl) - 1;  /*  0 to n-1 */
	min_neg_lim = - strlen(neg_tbl);      /* -1 to  -n */
	lsb_range   =   strlen(lsb_tbl);      /* n values  */

/******	Make sure that we don't have any bytes overlapping
 *	in the three packing sequence strings.  This would
 *	cause unpacking to be ambiguous (impossible).
 */

#ifdef DEBUG
	ovlap = strpbrk(pos_tbl, neg_tbl);
	if (ovlap != NULL) {
	  fprintf(stderr, "pack_int_core: overlap(pn)=\'%c\'\n", *ovlap);
	}
	ovlap = strpbrk(neg_tbl ,lsb_tbl);
	if (ovlap != NULL) {
	  fprintf(stderr, "pack_int_core: overlap(nl)=\'%c\'\n", *ovlap);
	}
	ovlap = strpbrk(lsb_tbl ,pos_tbl);
	if (ovlap != NULL) {
	  fprintf(stderr, "pack_int_core: overlap(lp)=\'%c\'\n", *ovlap);
	}
#endif 



	if (data >= 0) {

/**************	Positive small value.
 *		Pack the value from the Pos table
 *		as a single byte.
 */
		if (data <= max_pos_lim) {
			*byte = pos_tbl[data];

			Dprintf(" Pos(small) = %d, ",       data);
			Dprintf("\tbyte=\'%c\'=0x%02x\n\n", *byte, *byte);

			return (1);

/**************	Positive large value.
 *		Find the least significant portion, and then
 *		call recursively to find the rest of it.
 *		
 *		First, bias or origin past the end of the
 *		range of "small" positive int's.
 *		Then divide by the lsb range and pack
 *		the remainder in this byte.
 *		Call recursively until it's finally
 *		small int, and then back out counting
 *		the bytes in the return value.
 *
 */
		} else {
			da2   = data - (max_pos_lim + 1);
			msb   =       da2/lsb_range;
			lsb   = da2 - msb*lsb_range;
			*byte = lsb_tbl[lsb];

			Dprintf(" Pos(large,Da2)=%d\n",    da2);
			Dprintf(" Pos(large,MSB)=%d\n",    msb);
			Dprintf("    (large,LSB)=%d, ",    lsb);
			Dprintf("\tbyte=\'%c\'=0x%02x\n",  *byte, *byte);

			rc = pack_int_core (byte+1,  msb,
			                    pos_tbl, neg_tbl, lsb_tbl  );

			Dprintf("Done: Pos(large) bytes=%d", (rc+1));
			Dprintf(" ====> val=%d\n",           data);

			return (1 + rc);
		}

	} else {

/**************	Negative small value.
 *		Pack the value from the Neg table
 *		as a single byte (backward from -1).
 */
		if (data >= min_neg_lim) {
			*byte = neg_tbl[ (-data-1) ] ;

			Dprintf(" Neg(small) = %d, ",       data);
			Dprintf("\tbyte=\'%c\'=0x%02x\n\n", *byte, *byte);

			return (1);
			
/**************	Negative large value.
 *		Find the least significant portion, and then
 *		call recursively to find the rest of it.
 *		
 *		First, bias or origin past the end of the
 *		range of "small" negative int's.
 *		Then divide by the lsb range and pack
 *		the remainder in this byte.
 *		Call recursively until it's finally
 *		small int, and then back out counting
 *		the bytes in the return code.
 *
 */
		} else {
			da2   = data - (min_neg_lim - 1);
			msb   =       da2/lsb_range - 1;
			lsb   = da2 - msb*lsb_range - 1;
			*byte = lsb_tbl[lsb];

			Dprintf(" Neg(large,Da2)=%d\n",   da2);
			Dprintf(" Neg(large,MSB)=%d\n",   msb);
			Dprintf("    (large,LSB)=%d, ",   lsb);
			Dprintf("\tbyte=\'%c\'=0x%02x\n", *byte, *byte);

			rc = pack_int_core (byte+1,  msb,
			                    pos_tbl, neg_tbl, lsb_tbl  );

			Dprintf("Done: Neg(large) bytes=%d", (rc+1));
			Dprintf(" ====> val=%d\n", data);

			return (1 + rc);
		}

	}
}




/*
 ***********************  unpack_int_core()  **********************
 *
 *	This unpacks the integer "data" from a series of bytes.
 *	The bytes are scanned starting at the location
 *	pointed to by "inp_str".  The result is stored using
 *	the pointer "data" (normally pointing somewhere
 *	into the middle of an array in the caller).
 *	
 *	The three _tbl strings control the unpacking
 *	the same way as the unpack function above.
 *	
 *	It returns the number of bytes needed to
 *	unpack the value (consumed from inp_str).
 *
 */


#if defined(DEBUG) && 0    /* Use "1" for more debug */
#define Cprintf printf
#else
static void Cprintf(char*d,...){}
#endif


#define UnpackTypeIntPos (0x1)
#define UnpackTypeIntNeg (0x2)
#define UnpackTypeIntLSB (0x4)


static int
unpack_int_core(
	char *inp_str,
	int  *data,
	char *pos_tbl,
	char *neg_tbl,
	char *lsb_tbl  )
{
	int  rc;
	int  msb;
	int  lsb;
	int  valu;
	int  max_pos_lim;
	int  min_neg_lim;
	int  lsb_range;
	int  unpack_type;
	char *index_p;


	if( inp_str == NULL) return(0);
	if(*inp_str == 0   ) return(0);

	max_pos_lim =   strlen(pos_tbl) - 1;  /*  0 to n-1 */
	min_neg_lim = - strlen(neg_tbl);      /* -1 to  -n */
	lsb_range   =   strlen(lsb_tbl);      /* n values  */



/******	Search the three strings, and find the index
 *	of the next character (should only be in one
 *	of these, but try all 3 for error checking).
 *	Compute the value of the small int, or the
 *	partial piece for use later.
 *	Compute a mask defining which string we found
 *	our byte in (hopefully only one).
 */

	unpack_type = 0;

	index_p = strchr (lsb_tbl, *inp_str);
	if (index_p != NULL) {
		valu         = index_p - lsb_tbl;
		unpack_type |= UnpackTypeIntLSB;
	}

	index_p = strchr (neg_tbl, *inp_str);
	if (index_p != NULL) {
		valu         = neg_tbl - index_p - 1;
		unpack_type |= UnpackTypeIntNeg;
	}

	index_p = strchr (pos_tbl, *inp_str);
	if (index_p != NULL) {
		valu         = index_p - pos_tbl;
		unpack_type |= UnpackTypeIntPos;
	}



	switch(unpack_type) {

/********** These are small integers.
 *	    We already computed the value above.
 *	    Store it, and return 1 byte consumed.
 */

	    case UnpackTypeIntPos:
	    case UnpackTypeIntNeg:
		*data = valu;
		Cprintf("unpack_int: 0x%2x, \'%c\' ====> %d\n",
		        *inp_str, *inp_str, *data);
		return (1);
		break;

/********** This is for large multibyte sequences.
 *	    Since the least significant piece is first,
 *	    we recursively call ourselves till we finally
 *	    find a small "byte" to terminate sequence.
 *	    That last byte will also determine if it's
 *	    positive or negative.   Then we build up
 *	    the integer as we unwrap the recursive calls.
 *	    The return code also counts up the number
 *	    of bytes consumed.
 */

	    case UnpackTypeIntLSB:
		Cprintf("unpack_int: 0x%2x, \'%c\' LSB %d\n",
		        *inp_str, *inp_str, valu);
		rc = unpack_int_core (inp_str+1,
		                      &msb,
		                      pos_tbl, neg_tbl, lsb_tbl  );
		if (rc > 0) {
			Cprintf("unpack_int: 0x%2x, \'%c\' MSB %d\n",
			        *inp_str, *inp_str, msb);
			if (msb >=0) {
				lsb   = valu + max_pos_lim + 1;
				*data = msb * lsb_range + lsb;
			} else {
				lsb   = valu + min_neg_lim + lsb_range;
				*data = (msb-1) * lsb_range + lsb;
			}
			Cprintf("unpack_int: 0x%2x, \'%c\' combined %d\n",
			        *inp_str, *inp_str, *data);
		}
		return (1 + rc);
		break;

/********** Error cases.  Return 0 bytes consumed.
 *	    Print warning in debug more for:
 *	      - Byte not found in any string
 *	      - Byte found in multiple strings
 */

	    case 0:
#ifdef DEBUG
		fprintf(stderr, "unpack_int_core: ");
		fprintf(stderr, "invalid byte = 0x%2x\n", *inp_str);
#endif
		return(0);
		break;

	    default:
#ifdef DEBUG
		fprintf(stderr, "unpack_int_core: ");
		fprintf(stderr, "range overlap, mask=0x%x\n",
		                 unpack_type);
		fprintf(stderr, "  Check wrapper function\n");
#endif
		return(0);
		break;

	};
}



/*
 ***********************    pack_gam_int()  **********************
 *                        unpack_gam_int()
 *
 *	Wrappers to un/pack one integer into the output string.
 *	Returns the number of bytes inserted.
 *	Strings are optimized for small integers,
 *	which are typical of the second derivative
 *	of smooth curves like gamma functions.
 *
 *	If you typically packed larger integers, you could
 *	make different wrappers.   For those, you'd make the
 *	LSB strings bigger, so you wouldn't have to extend
 *	as much (you have a lower chance to getting it
 *	done in one byte, though).  If you didn't expect
 *	negative numbers, you could make that string
 *	very short (even one byte, didn't debug zero)
 *	so you can spend you codes on the other two.
 *	
 */

#ifndef INT_TEST  /* only export for validation, or make better name */
static
#endif
int
pack_gam_int(char *byte, int data)
{
	int rc;

	rc = pack_int_core(byte, data, gamma_tbl_int_pos,
	                               gamma_tbl_int_neg,
	                               gamma_tbl_int_lsb  );
	return (rc);
}


#ifndef INT_TEST  /* only export for validation, or make better name */
static
#endif
int
unpack_gam_int(char *byte, int *data)
{
	int rc;

	rc = unpack_int_core(byte, data, gamma_tbl_int_pos,
	                                 gamma_tbl_int_neg,
	                                 gamma_tbl_int_lsb  );
	return (rc);
}




/*
 *****************************************************************************
 *****************************************************************************
 *
 *	Integer table to string Pack routines
 *
 *	This section packs and unpacks groups of integers.
 *	It's tuned for the second derivitive of smooth
 *	curves, which typically have integers that are
 *	1, 0, or +1.  It tries to match longs strings of
 *	these and pack them into a single byte.
 *	Otherwise, it packs a single integer into one
 *	or more bytes using a different algorithm
 *	until it can get back to strings of [-1, +1].
 *	
 *****************************************************************************
 *****************************************************************************
 */



/*
 ***********************  pack_tbl_to_string()  **********************
 *
 *	Pack an integer table into a string.
 *
 *	The calling function must make sure the string
 *	is large enough to pack the entire table.
 *	This is mostly based on pack_gam_int() which
 *	should be 8 bytes for a maximum range int_32.
 *	   (I suppose you could implement a "try" mode
 *	    if str_data was NULL, and you modified this
 *	    function and pack_tiny_bytes() not to store
 *	    values and just count.   Gamma tables aren't
 *	    that big, though, so I'm just making it "big"
 *	    in the calling function, for now)
 *
 *	The return value is the number of bytes filled into
 *	the result string.
 *
 *	This is optimized to looks for sequences of
 *	  these three tiny numbers:  -1, 0 +1
 *	If these are not found, it packs the integers
 *	  into one or more bytes individually.
 *	The "state" variable keeps track of switching
 *	  between the two packing methods
 *
 */

#if defined(DEBUG) && 0    /* Use "1" for more debug */
#define Eprintf printf
#else
static void Eprintf(char*d,...){}
#endif


static int
pack_tbl_to_string (char       *str_data
                   ,int         str_len
                   ,int        *tbl
                   ,int         tbl_len
                   )
{
	int                 g;
	int                 pw;
	int                 str_count;
	PackTableStateType  state;

	if (str_data == NULL) return(0);
	if (tbl      == NULL) return(0);

	str_count = 0;
	state     = PackSingle;


	for (g=0 ; g<tbl_len ; ) {
	    Eprintf("\n{%d,%d,%d,%d}\n",tbl[g],tbl[g+1],tbl[g+2],tbl[g+3]);

/********** Make sure we don't overrun table.
 */
	    if (str_count+4 >= str_len) {
		return(0);
	    }

/********** Try to pack multiple tiny values,
 *	    and see if we succeeded.
 */
	    pw = pack_tiny_bytes (str_data+str_count, 
		                  tbl+g,
		                  tbl_len-g);
	    Eprintf("pw=%d\n", pw);


	    switch(state) {


/************** Here we've been packing full sized integer, and
 *		are trying to find a group of 4 tiny ones.
 *
 *		If we haven't found them yet, pack a single int
 *		and continue the search till we do.
 *		
 *		If we've just found a new tiny sequence,
 *		then insert the transition token, switch
 *		to the packing multiple values.  Don't
 *		move the gamma pointer (g) so we re-run
 *		the current position in the other state.
 *		
 *		In all sections, make sure we have enough room
 *		in the results string for worst case results,
 *		or return that we failed (zero words packed).
 */
	        case PackSingle:
		    if (pw < 4) {
			Eprintf("Val = %d\n", tbl[g]);
			if (str_count+8 >= str_len)  return(0);
			str_count += pack_gam_int(str_data+str_count, tbl[g]);
			g++;
		    } else {
			if (str_count+1 >= str_len)  return(0);
			str_data[str_count]=0x7c;
			str_count++;
			state = PackTinyGroup;
			Eprintf("Start Compressed\n");
		    }
		    break;

/************** Here we've already been packing multiple tiny values.
 *		Adjust pointer to move past what we've just packed.
 *		When pw = 0,1 means we've reached the end of a
 *		section of tiny values.   Switch back to packing
 *		full integer values.
 */
	        case PackTinyGroup:
		    if (pw >= 0) {
			g += pw;
			str_count++;
			if (pw <= 1) {
				state = PackSingle;
				Eprintf("End Compressed\n");
			}
		    } else {
			return (0);  /* shouldn't happen, error ? */
		    }
		    break;

	    };

#ifdef Eprintf
	    str_data[str_count]=0;
	    Eprintf("%s\n", str_data);
#endif

	}

/******	Add a final terminator if section ended
 *	at a boundary that's not a terminator.
 */
	if (pw >= 2) {
		if (str_count+1 >= str_len)  return(0);
		pack_tiny_bytes (str_data+str_count, NULL, 0);
		str_count++;
	}


/******	Terminate the C string.
 *
 */
	if (str_count+1 >= str_len)  return(0);
	str_data[str_count]=0;

	return(str_count);
}



/*
 ***********************  unpack_string_to_tbl()  **********************
 *
 *	This function unpacks the string back into a table
 *
 *	The integer output table has to be allocated in
 *	the caller to the correct length.
 *
 *	The return value is the number of values unpacked.
 */

#if defined(DEBUG) && 0    /* Use "1" for more debug */
#define Uprintf printf
#else
static void Uprintf(char*d,...){}
#endif


static int
unpack_string_to_tbl (char       *packed_string
                     ,int        *tbl
                     ,int         tbl_len
                     )
{
	int                  tb;
	int                  ll;
	int                  tcount;
	char                *sp;
	PackTableStateType   state;


	if ( packed_string == NULL) return(0);
	if (*packed_string == 0   ) return(0);
	sp = packed_string;

	tcount = 0;
	state     = PackSingle;


	while (*sp != 0) {
	    if (tcount >= tbl_len) {

		/* ignore a zero length terminator at the end */
		if (*sp != DeltaTableBase_0X) {
#ifdef DEBUG
			fprintf(stderr, "unpack: Length Mismatch\n");
#endif
			return (0);
		}

	    }

	    switch(state) {

/************** Here we single integer values till we find
 *		the token to switch into multiple unpack mode.
 */
		case PackSingle:
		    if (*sp == 0x7c) {
			sp++;
			state = PackTinyGroup;
			Uprintf("unpack: Start Compressed\n");
		    } else {
			ll = unpack_gam_int(sp, tbl+tcount);
			if (ll == 0) {
				return (0);
			} else {
				sp += ll;
				tcount++;
			}
		    }
		    break;

/************** Here we unpack multiple tiny values.
 *		When tb = 0,1 means we've reached the end of a
 *		section of tiny values.   Switch back to packing
 *		full integer values.
 */
		case PackTinyGroup:

		    tb = unpack_tiny_bytes (*sp, tbl+tcount, tbl_len-tcount);

		    sp++;
		    tcount += tb;

		    if ( (tb == 0) || (tb == 1) ) {
			state = PackSingle;
			Uprintf("unpack: End Compressed\n");
		    }

		    break;

	    };

	}

	return (tcount);
}





/*
 *****************************************************************************
 *****************************************************************************
 *
 *	Gamma table routines
 *
 *	These are the high level routines that deal with
 *	the gamma table packing.   These actually take
 *	the second derivitive of the data table.
 *	Since most gamma tables are ver smooth, this
 *	should produce very small numbers.
 *	Typically you only get values of -1, 0, +1
 *	in the bulk of the table after a little
 *	transient instability at the start of the table.
 *	A header is also added, including a version
 *	number and a length.
 *
 *****************************************************************************
 *****************************************************************************
 */




/*
 ***********************  pack_gamma_string()  **********************
 *
 *	Pack integer tbl[tbl_len] into a string.
 *	The string is malloc'd and the pointer is returned.
 *	This space must be free'd up by the caller.
 *
 *	This is an inner helper function that just
 *	packs the array (typically the 2nd derivitive),
 *	and should be called by an appropriate wrapper
 *	that performs the high level functions and
 *	converts to an int array.
 *
 */




static int
pack_gamma_string (char      **packed_string
                  ,int        *tbl
                  ,int         tbl_len
                  )
{
	int    rc;

	int    str_alloc;
	char  *str_data;
	int    str_count;
	int    str_left;


/******	Allocate a string that big enough for a
 *	worst case input.  This is way too big,
 *	but we'll copy it and trim it off below.
 */
	str_alloc  = tbl_len*8 + 20; /* worst case */
	str_data   = malloc(str_alloc);
	str_count  = 0;


/******	Add a "gamma" header to the string,
 *	including version numbers for future expansion.
 *	Pack the table length is for:
 *	    Error checking on unpack
 *	    Unpacker can malloc data table up front
 *	      since it knows the size.
 */
	str_data[str_count++]  =  'G'; /* Gamma packing type */
	str_data[str_count++]  =  '0'; /* Major Rev */
	str_data[str_count++]  =  '0'; /* Minor Rev */

	str_count += pack_gam_int(str_data+str_count, tbl_len);


/******	Move past the header.
 *	Pack the array into the string,
 *	  and check for errors.
 *	Find the new end of the string.
 */
	str_left = str_alloc - str_count;

	rc = pack_tbl_to_string (str_data+str_count,
	                         str_left, tbl, tbl_len);

	if (rc <= 0) {
		return (rc);
	} else {
		str_count += rc;
	}


/******	Make a new (much shorter) copy to return.
 *	Free temporary workspace.
 */
	*packed_string = strdup(str_data);
	free(str_data);

	return(str_count);
}



/*
 ***********************  gfx_pack_gamma_string_16()  **********************
 *
 *	This is the wrapper for 16-bit unsigned int
 *	gamma tables.  
 *
 *	It packs gamma_entries elements in array gt_data[].  
 *
 *	It returns a pointer to the the resulting string, 
 *	which is dynamically allocated.
 *	This space must be free'd up by the caller.
 *	
 *	This function converts the uint16_t table
 *	elements into int's as it's computing
 *	the second derivitive.  It then calls
 *	pack_gamma_string() to process the data.
 *
 */


int
gfx_pack_gamma_string_16 (char      **gamma_string
                         ,int         gamma_entries
                         ,uint16_t   *gt_data
                         )
{
	int    g;
	int    curr_val;
	int    last_val;
	int    curr_del;
	int    last_del;
	int   *ddel;
	int    rc;

	ddel = (int *) malloc( gamma_entries * sizeof(int) );


	last_val = 0;
	last_del = 0;

	for (g=0 ; g<gamma_entries ; g++) {
		curr_val = gt_data[g];
		curr_del = curr_val - last_val;
		ddel[g]  = curr_del - last_del;
#if 0
		printf("ix=%4d  val=%4d,%03x  del=%4d  ddel=%4d\n", 
		        g, curr_val, curr_val, curr_del, ddel[g] );
#endif
		last_val = curr_val;
		last_del = curr_del;
	}


	rc = pack_gamma_string (gamma_string, ddel, gamma_entries);

	free(ddel);

	return (rc);

}


/*
 ***********************  gfx_unpack_gamma_string_16()  **********************
 *
 *	This function takes a gamma string and
 *	unpacks it into a unsigned 16-bit integer array.
 *
 *	The results array is filled in up to max_entries
 *	elements (a warning is given for a length mismatch
 *	when compiled in DEBUG mode).
 *
 *	It first checks the header and allocates a temp array.
 *	Then it unpacks the string, and undoes the second
 *	derivative by integrating (accumulating) the table.
 *
 */


int
gfx_unpack_gamma_string_16 (char       *str
                           ,int         max_entries
                           ,uint16_t   *gt_data
                           )
{
	int    g;
	int    curr_val;
	int    last_val;
	int    curr_del;
	int    last_del;
	int   *ddel;
	int    str_entries;
	int    rc;
	int    str_count;


	if (str == NULL) return (-1);

	str_count=0;
	if (str[str_count++] != 'G') return (-1);
	if (str[str_count++] != '0') return (-1);
	if (str[str_count++] != '0') return (-1);

	rc = unpack_gam_int(str+str_count, &str_entries);
	if (rc <= 0) {
		return (rc);
	} else {
		str_count += rc;
	}

#ifdef DEBUG
	if (str_entries != max_entries) {
		fprintf(stderr, "\nstr_entries = %d\n", str_entries);
		fprintf(stderr, "max_entries = %d\n\n", max_entries);
	}
#endif

	ddel = (int *) malloc( str_entries * sizeof(int) );

	for (g=0 ; g<str_entries ; g++) {
		ddel[g] = 0;
	}


	rc = unpack_string_to_tbl (str+str_count, ddel, str_entries);

	last_val = 0;
	last_del = 0;

	for (g=0 ; g<max_entries ; g++) {
		curr_del   = ddel[g]  + last_del;
		curr_val   = curr_del + last_val;
		gt_data[g] = (uint16_t) curr_val;

#if 0
		printf("ix=%4d  val=%4d,%03x  del=%4d  ddel=%4d\n", 
		        g, curr_val, curr_val, curr_del, ddel[g] );
#endif
		last_val = curr_val;
		last_del = curr_del;
	}


	free(ddel);

	return (rc);

}

