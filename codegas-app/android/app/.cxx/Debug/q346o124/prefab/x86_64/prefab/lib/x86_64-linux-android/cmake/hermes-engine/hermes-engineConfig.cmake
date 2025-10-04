if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/reine/.gradle/caches/8.14.3/transforms/8bd5a1765acbe8bef6b172e1b822d32a/transformed/hermes-android-0.81.1-debug/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/reine/.gradle/caches/8.14.3/transforms/8bd5a1765acbe8bef6b172e1b822d32a/transformed/hermes-android-0.81.1-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

