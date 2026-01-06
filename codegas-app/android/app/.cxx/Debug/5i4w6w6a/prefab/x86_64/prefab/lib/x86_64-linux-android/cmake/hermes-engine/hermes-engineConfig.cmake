if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/ferortiz/.gradle/caches/8.14.3/transforms/846a170e091b2b39eb80661205ec329f/transformed/hermes-android-0.81.1-debug/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/ferortiz/.gradle/caches/8.14.3/transforms/846a170e091b2b39eb80661205ec329f/transformed/hermes-android-0.81.1-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

