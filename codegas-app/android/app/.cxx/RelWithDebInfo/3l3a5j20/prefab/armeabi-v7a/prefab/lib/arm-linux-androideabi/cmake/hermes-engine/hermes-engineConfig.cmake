if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/ferortiz/.gradle/caches/8.14.3/transforms/9ade1e1a3f0721f4b63eee6038db5aa7/transformed/hermes-android-0.81.1-release/prefab/modules/libhermes/libs/android.armeabi-v7a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/ferortiz/.gradle/caches/8.14.3/transforms/9ade1e1a3f0721f4b63eee6038db5aa7/transformed/hermes-android-0.81.1-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

