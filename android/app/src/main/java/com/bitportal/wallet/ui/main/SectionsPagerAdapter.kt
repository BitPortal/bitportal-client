package com.bitportal.wallet.ui.main

import android.content.Context
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentPagerAdapter
import com.bitportal.wallet.R
import com.bitportal.wallet.ReactNativeFragmentActivity
import com.bitportal.wallet.reactnative.ReactNativeFragment

private val TAB_TITLES = arrayOf(
  R.string.tab_text_1,
  R.string.tab_text_2,
  R.string.tab_text_3
)

/**
 * A [FragmentPagerAdapter] that returns a fragment corresponding to
 * one of the sections/tabs/pages.
 */
class SectionsPagerAdapter(private val context: Context, fm: FragmentManager) :
  FragmentPagerAdapter(fm) {

  override fun getItem(position: Int): Fragment {
    // getItem is called to instantiate the fragment for the given page.
    // Return a PlaceholderFragment (defined as a static inner class below).
    if (position == 1) {
      return ReactNativeFragment.createReactNativeFragment("Market")
    }

    return PlaceholderFragment.newInstance(position + 1)
  }

  override fun getPageTitle(position: Int): CharSequence? {
    return context.resources.getString(TAB_TITLES[position])
  }

  override fun getCount(): Int {
    // Show 2 total pages.
    return 3
  }
}