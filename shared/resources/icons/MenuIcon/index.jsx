

import React from 'react'
import style from './style.css'

const MenuIcon = ({ onClick, isMenuOpen }) => (
  <div onClick={onClick} className={`${style.menuIcon} ${isMenuOpen ? style.isOpen : ''}`}>
    <span />
  </div>
)

export default MenuIcon
