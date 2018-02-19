# util-macros must be built before any other x11 component as they may need
# the macros it provides to regenerate their configure scripts with autoreconf

X11_COMPONENT_DIRS = \
    $(filter-out x11/util/util-macros, $(filter x11/%, $(COMPONENT_DIRS)))

$(X11_COMPONENT_DIRS): x11/util/util-macros
