package com.bitportal.wallet;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;

import com.reactnativenavigation.NavigationActivity;
import com.umeng.analytics.MobclickAgent;

public class MainActivity extends NavigationActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      MobclickAgent.setSessionContinueMillis(1000);
      MobclickAgent.setScenarioType(this, MobclickAgent.EScenarioType.E_DUM_NORMAL);
      SplashScreen.show(this, true);
      super.onCreate(savedInstanceState);
  }

  @Override
  public void onResume() {
      super.onResume();
      MobclickAgent.onResume(this);
  }

  @Override
  protected void onPause() {
      super.onPause();
      MobclickAgent.onPause(this);
  }
}
