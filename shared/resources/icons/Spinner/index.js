/* @jsx */

import React from 'react'
import style from './style.css'

const Spinner = ({ color }) => (
  <div className={style.spinner}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <radialGradient id="a" cx="97.483%" cy="28.573%" r="168.336%" fx="97.483%" fy="28.573%" gradientTransform="matrix(.9983 -.05822 .02352 .40335 -.005 .227)">
          <stop stopColor={color || '#FFF'} offset="0%" />
          <stop stopColor={color || '#FFF'} stopOpacity=".816" offset="18.426%" />
          <stop stopColor={color || '#FFF'} stopOpacity="0" offset="100%" />
        </radialGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path fill="none" d="M0 0h24v24H0z" />
        <path stroke="url(#a)" strokeWidth="2" d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11-4.925 11-11 11z" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="48.33 69.117" />
      </g>
    </svg>
  </div>
)

export default Spinner
