package com.bitportal;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
import com.bitgo.randombytes.RandomBytesPackage;
import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this, true);
      super.onCreate(savedInstanceState);
  }

  @Override
  public void onResume() {
      super.onResume();
  }

  @Override
  protected void onPause() {
      super.onPause();
  }
}
