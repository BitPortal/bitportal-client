package com.reactnativenavigation.views.element.animators;

import android.animation.TypeEvaluator;
import androidx.core.graphics.ColorUtils;

public class LabColorEvaluator implements TypeEvaluator<double[]> {
    private final double[] color = new double[3];

    @Override
    public double[] evaluate(float ratio, double[] from, double[] to) {
        ColorUtils.blendLAB(from, to, ratio, color);
        return color;
    }
}
