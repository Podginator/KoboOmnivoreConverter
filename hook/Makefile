
include libs/NickelHook/NickelHook.mk

override LIBRARY  := libpocket.so
override SOURCES  += pocket.cc
override CFLAGS   += -Wall -Wextra -Werror -Wno-missing-field-initializers -fvisibility=hidden $(CFLAGS_KOBO) 
override CXXFLAGS += -Wall -Wextra -Werror -Wno-missing-field-initializers -isystemminiz -fvisibility=hidden -fvisibility-inlines-hidden 

override PKGCONF  += Qt5Widgets Qt5Network

include libs/NickelHook/NickelHook.mk
