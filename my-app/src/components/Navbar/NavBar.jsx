import React from 'react';
import { NavStyle, NavLogo, NavLink, NavBars, NavMenu } from './NavStyling';

const NavBar = () => {
  return (
    <>
      <NavStyle>
        <NavLogo to='/main'>
          Cypress
        </NavLogo>
        <NavBars />
        <NavMenu>
		  <NavLink to='/browse' activestyle="true">
            Browse
          </NavLink>
          <NavLink to='/main' activestyle="true">
            Home
          </NavLink>
          <NavLink to="/explore" activestyle="true">
            Explore
          </NavLink>
          <NavLink to="/user_profile" activestyle="true">
            User Profile
          </NavLink>
          <NavLink to="/" activestyle="true">
            Login
          </NavLink>
          <NavLink to="/create_account" activestyle="true">
            Create Account
          </NavLink>
          <NavLink to='/edit_account' activestyle="true">
            Edit Account
          </NavLink>
          <NavLink to='/search_users' activestyle="true">
            Search Users
          </NavLink>
        </NavMenu>
      </NavStyle>
    </>
  );
};

export default NavBar;
