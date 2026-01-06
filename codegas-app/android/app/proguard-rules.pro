# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }

# Firebase - Keep all classes and methods
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-keep class com.google.api.** { *; }
-keep class com.google.protobuf.** { *; }
-keep class com.google.common.** { *; }

# Keep Firebase internal classes (Hp, etc.)
-keep class * extends com.google.firebase.** { *; }
-keepclassmembers class * extends com.google.firebase.** {
    *;
}

# Keep all classes with Builder pattern (Firebase uses builders extensively)
-keepclassmembers class * {
    public static ** newBuilder();
    public ** build();
    public ** Builder();
}

# Keep all classes that might be referenced by Firebase
-keep class com.google.** { *; }
-dontwarn com.google.**

# Keep all classes that might be accessed via reflection (Firebase uses reflection extensively)
-keepclassmembers class * {
    public <init>(...);
}

# Keep all classes with single-letter or short names (Firebase internal classes like Hp, Mn, etc.)
-keep class * {
    public static ** newBuilder(...);
}

# Keep all classes in packages that might be obfuscated
-keepnames class * {
    public static ** newBuilder(...);
}

# Don't obfuscate classes that might be accessed via reflection
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes EnclosingMethod
-keepattributes InnerClasses

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep React Native bridge methods
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
}

# Keep JavaScript interfaces
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
}

# Optimizaciones conservadoras para evitar crashes
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 1
-allowaccessmodification
-dontpreverify

# No hacer optimizaciones agresivas que puedan romper el código
# -mergeinterfacesaggressively
# -overloadaggressively
-repackageclasses ''
-allowaccessmodification
-dontskipnonpubliclibraryclasses
-dontskipnonpubliclibraryclassmembers

# Eliminar atributos innecesarios
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep all React Native classes
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}

# Keep React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.react.views.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep JavaScript interfaces
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
}

# Keep Redux classes
-keep class * extends com.facebook.react.bridge.ReactContextBaseJavaModule { *; }
-keep class * extends com.facebook.react.bridge.BaseJavaModule { *; }

# Keep AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Keep Toast
-keep class com.toast.** { *; }

# Keep Axios
-keep class com.facebook.react.modules.network.** { *; }

# Remove logging (solo en release final, comentar para debug)
# -assumenosideeffects class android.util.Log {
#     public static boolean isLoggable(java.lang.String, int);
#     public static int v(...);
#     public static int i(...);
#     public static int w(...);
#     public static int d(...);
#     public static int e(...);
# }

# Coil (image loading library)
-dontwarn coil3.PlatformContext
-keep class coil3.** { *; }
-dontwarn coil3.**
