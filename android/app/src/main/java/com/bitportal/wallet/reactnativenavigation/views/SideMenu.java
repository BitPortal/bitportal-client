package com.reactnativenavigation.views;

import android.content.*;
import androidx.annotation.*;
import androidx.drawerlayout.widget.*;
import android.util.*;

public class SideMenu extends DrawerLayout {
    public SideMenu(@NonNull Context context) {
        super(context);
    }

    @Override
    public void openDrawer(int gravity, boolean animate) {
        try {
            super.openDrawer(gravity, animate);
        } catch (IllegalArgumentException e) {
            Log.w("RNN", "Tried to open sideMenu, but it's not defined");
        }
    }
}
