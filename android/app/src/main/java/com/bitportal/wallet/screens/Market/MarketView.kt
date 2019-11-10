package com.bitportal.wallet.screens.Market

import android.widget.LinearLayout
import androidx.recyclerview.widget.RecyclerView
import android.content.Context
import android.util.AttributeSet
import androidx.recyclerview.widget.LinearLayoutManager

public class MarketView @JvmOverloads constructor(context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0) : LinearLayout(context, attrs, defStyleAttr) {
  lateinit var tickerList: RecyclerView
  var animals: ArrayList<String> = ArrayList()

  init {
    addAnimals()
    this.tickerList = RecyclerView(context)
    this.tickerList.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    this.tickerList.layoutManager = LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false)
    this.tickerList.adapter = TickerAdapter(animals, context)
    addView(this.tickerList)
  }

    public fun setData(data: ArrayList<String>) {
        animals = data
    }

  fun addAnimals() {
    animals.add("dog")
    animals.add("cat")
    animals.add("owl")
    animals.add("cheetah")
    animals.add("raccoon")
    animals.add("bird")
    animals.add("snake")
    animals.add("lizard")
    animals.add("hamster")
    animals.add("bear")
    animals.add("lion")
    animals.add("tiger")
    animals.add("horse")
    animals.add("frog")
    animals.add("fish")
    animals.add("shark")
    animals.add("turtle")
    animals.add("elephant")
    animals.add("cow")
    animals.add("beaver")
    animals.add("bison")
    animals.add("porcupine")
    animals.add("rat")
    animals.add("mouse")
    animals.add("goose")
    animals.add("deer")
    animals.add("fox")
    animals.add("moose")
    animals.add("buffalo")
    animals.add("monkey")
    animals.add("penguin")
    animals.add("parrot")
  }
}
