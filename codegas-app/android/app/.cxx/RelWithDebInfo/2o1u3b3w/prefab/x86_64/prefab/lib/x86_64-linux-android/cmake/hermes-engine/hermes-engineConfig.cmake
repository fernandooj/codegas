if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/private/var/folders/zs/57ggrhfd3xd9nw35qfh5t6100000gn/T/cursor-sandbox-cache/61996870464d6b578ce2c3e746faf53e/gradle/caches/8.14.3/transforms/9ade1e1a3f0721f4b63eee6038db5aa7/transformed/hermes-android-0.81.1-release/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/private/var/folders/zs/57ggrhfd3xd9nw35qfh5t6100000gn/T/cursor-sandbox-cache/61996870464d6b578ce2c3e746faf53e/gradle/caches/8.14.3/transforms/9ade1e1a3f0721f4b63eee6038db5aa7/transformed/hermes-android-0.81.1-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

