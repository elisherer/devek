import {NavLink} from 'react-router-dom';
import styled from 'styled-components';
import DevekLogo from '../assets/devek_text_white.svg';
import { Tabs } from './_lib';

export const MainNavigation = styled.nav`
  position: absolute;
  width: ${({ theme, open }) => open ? theme.navWidth : 0};
  height: 100%;
  color: ${({ theme }) => theme.navForeground};
  background: ${({ theme }) => theme.navBackground};
  background-size: contain;
  overflow-x: hidden;
  overflow-y: scroll;
  transition: width 300ms ease-in-out;
  z-index:998;

  /* Chrome, Safari, newer versions of Opera */
  &::-webkit-scrollbar { width: 0 !important }
  /* Firefox */
  overflow: -moz-scrollbars-none;
  /* Internet Explorer +10 */
  -ms-overflow-style: none;

  > a:first-of-type {
    display: block;
    background: url(${DevekLogo}) center no-repeat;
    background-size: contain;
    width: 110px;
    height: 30px;
    margin: 15px 20px 16px 65px;

    @media (min-width: ${({ theme }) => theme.screenDesktopMin}) {
      margin: 16px 6px;
      width: 162px;
      height: 38px;
    }
  }

  > p {
    display: none;
    margin: 40px 20px 0 20px;
    font-family: ${({ theme }) => theme.fontMono};
    @media (min-width: ${({ theme }) => theme.screenDesktopMin}) {
      display: block;
      position: relative;
      width: ${({ theme }) => theme.navWidth};
    }
  }

  @media (min-width: ${({ theme }) => theme.screenDesktopMin}) {
    position: relative;
    width: ${({ theme }) => theme.navWidth};
  }
`;

const navItemHeight = '54px',
  navItemPadding = '10px';
export const StyledNavLink = styled(NavLink)`
  color: ${({ theme }) => theme.navForeground};
  text-decoration: none;
  display: block;
  width: 100%;
  height: ${navItemHeight};
  line-height: calc(${navItemHeight} - 2 * ${navItemPadding});
  cursor: pointer;
  padding: ${navItemPadding};
  padding-left: 40px;
  border-left: 4px solid transparent;
  font-size: 18px;
  text-transform: uppercase;
  &:hover {
    border-color: ${({ theme }) => theme.navHoverColor};
    background: linear-gradient(120deg, ${({ theme }) => theme.navHoverColor}, transparent);
  }
  &.active {
    color: ${({ theme }) => theme.navSelected};
    background-color: rgba(0,0,0,0.2);
    border-color: ${({ theme }) => theme.navSelected};
    svg path {
      fill: ${({ theme }) => theme.navSelected};
    }
  }
  svg {
    margin-right: 10px;
    vertical-align: middle;
    padding-bottom: 5px;
    path {
      fill: ${({ theme }) => theme.navForeground};
    }
  }
`;

export const Hamburger = styled.div`
  position: absolute;
  top: 10px;
  left: 14px;
  width: 34px;
  height: 34px;
  cursor: pointer;

  @media only screen and (min-width: ${({ theme }) => theme.screenDesktopMin}) {
    display: none;
  }
`;

export const ToggleTheme = styled.div`
  position: absolute;
  top: 16px;
  right: 10px;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export const GitHubIcon = styled.div`
  position: absolute;
  text-align: right;
  padding-bottom: 10px;
  right: 16px;
  top: 14px;
  @media only screen and (min-width: ${({ theme }) => theme.screenDesktopMin}) {
    padding-bottom: 10px;
    right: 24px;
    top: 26px;
  }
  svg {
    fill: ${({ theme }) => theme.navSelected};
  }
`;

export const SearchHint = styled.div`
  display: none;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.screenDesktopMin}) {
    padding: 10px;
    height: ${navItemHeight};
    display: block;
  }
`;

export const StyledTabs = styled(Tabs)`
  @media only screen and (min-width: ${({ theme }) => theme.screenDesktopMin}) {
    width: fit-content;
    margin: 0 20px;  
  }
`;

export const Overlay = styled.div`
  z-index: 997;
  opacity: 0.5;
  background-color: black;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  @media (min-width: ${({ theme }) => theme.screenDesktopMin}) {
    display: none;
  }
`;