import React from 'react'
import { NavStyle, NavLogo, NavLink, NavBars, NavMenu } from './NavStyling'

const NavBar = () => {
  return (
    <>
      <NavStyle>
        <NavLogo to='/main'>
          Language Helper
        </NavLogo>
        <NavBars />
        <NavMenu>
          <NavLink to='/main' activestyle="true">
            Home
          </NavLink>
          <NavLink to='/user_profile' activestyle="true">
            User Profile
          </NavLink>
          <NavLink to='/' activestyle="true">
            Login
          </NavLink>
          <NavLink to='/create_account' activestyle="true">
            Create Account
          </NavLink>
        </NavMenu>
      </NavStyle>
    </>
  )
}

export default NavBar