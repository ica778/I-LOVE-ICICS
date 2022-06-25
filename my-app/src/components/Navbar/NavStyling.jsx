import styled from 'styled-components';
import { NavLink as Link } from 'react-router-dom';
import { FaBars as Bars } from 'react-icons/fa';

export const NavStyle = styled.nav`
  background: #181818;
  height: 80px;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem calc((100vw - 1000px) / 4);
  z-index: 10;
`;

export const NavLogo = styled(Link)`
  font-size: 1.75rem;
  color: lavender;
  background-color: #181818;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
`;

export const NavLink = styled(Link)`
  color: lavender;
  background-color: #181818; 
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &.active {
    color: orange;
  }

  &:hover {
    transition: all 0.3s ease-in-out;
    background: lavender;
    color: #181818;
  }
`;

export const NavBars = styled(Bars)`
  display: none;
  color: lavender;
  background-color: #181818;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -24px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;