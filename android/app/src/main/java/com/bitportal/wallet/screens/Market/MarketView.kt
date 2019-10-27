package com.bitportal.wallet

import android.widget.RelativeLayout
import androidx.recyclerview.widget.RecyclerView
import android.content.Context
import android.graphics.Canvas
import android.util.AttributeSet
import android.view.View
import android.widget.TextView

public class MarketView @JvmOverloads constructor(context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0) : RelativeLayout(context, attrs, defStyleAttr) {
    lateinit var text: TextView

    init {
        this.text = TextView(context)
        this.text.text = "Hello, MarketView"
        addView(this.text)
    }
}