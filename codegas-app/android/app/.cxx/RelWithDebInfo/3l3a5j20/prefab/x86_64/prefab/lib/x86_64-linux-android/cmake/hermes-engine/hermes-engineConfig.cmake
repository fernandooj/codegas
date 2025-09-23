if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/ferortiz/.gradle/caches/8.14.3/transforms/e9901e460df50d358f1b90a2b1959259/transformed/hermes-android-0.81.1-release/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/ferortiz/.gradle/caches/8.14.3/transforms/e9901e460df50d358f1b90a2b1959259/transformed/hermes-android-0.81.1-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

