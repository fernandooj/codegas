if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/private/var/folders/zs/57ggrhfd3xd9nw35qfh5t6100000gn/T/cursor-sandbox-cache/61996870464d6b578ce2c3e746faf53e/gradle/caches/8.14.3/transforms/af58e75fe606d438799bf9a736d10fc4/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.armeabi-v7a/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/private/var/folders/zs/57ggrhfd3xd9nw35qfh5t6100000gn/T/cursor-sandbox-cache/61996870464d6b578ce2c3e746faf53e/gradle/caches/8.14.3/transforms/af58e75fe606d438799bf9a736d10fc4/transformed/fbjni-0.7.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

