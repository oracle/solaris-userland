#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2014, 2026, Oracle and/or its affiliates.
#
/LoadModule auth_gss_module/d
/LoadModule ssl_fips_module/d
/LoadModule session_crypto_module/s/^LoadModule/#LoadModule/
/LoadModule mpm_event_module /i\
<IfDefine prefork>\
LoadModule mpm_prefork_module libexec/mod_mpm_prefork.so\
</IfDefine>\
<IfDefine worker>\
LoadModule mpm_worker_module libexec/mod_mpm_worker.so\
</IfDefine>\
<IfDefine !prefork>\
<IfDefine !worker>
/LoadModule mpm_event_module /a\
</IfDefine>\
</IfDefine>
/#LoadModule cgi_module /i\
<IfDefine prefork>
/#LoadModule cgi_module /a\
</IfDefine>
/#LoadModule cgid_module /i\
<IfDefine !prefork>
/#LoadModule cgid_module /a\
</IfDefine>

