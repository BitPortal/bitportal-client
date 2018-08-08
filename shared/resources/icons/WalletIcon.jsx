

import React from 'react'

const WalletIcon = ({ color = '#005eda' }) => (
  <svg viewBox="0 0 1024 1024" width="16" height="16">
    <path d="M96 192H768V0H96C44.8 0 0 44.8 0 96S44.8 192 96 192zM0 320v576c0 70.4 57.6 128 128 128h896V320H0z m800 448c-51.2 0-96-44.8-96-96S748.8 576 800 576s96 44.8 96 96-44.8 96-96 96z" fill={color} />
  </svg>
)

export default WalletIcon
