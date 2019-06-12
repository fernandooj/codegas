package com.codegas;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import com.facebook.soloader.SoLoader;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.react.rnspinkit.RNSpinkitPackage;    
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNAndroidLocationEnablerPackage(),
          new AsyncStoragePackage(),
          new RNFirebasePackage(),
          new RNFirebaseMessagingPackage(),
          new RNGestureHandlerPackage(),
          new FIRMessagingPackage(),
          new RNSpinkitPackage(),
          new PickerPackage(),
          new FastImageViewPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
