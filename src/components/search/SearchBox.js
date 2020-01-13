import React, {useEffect} from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { TextBox } from '../_lib';
import { actions, useStore } from './SearchBox.store';
import styled from 'styled-components';

const inputNodeNames = ['INPUT', 'TEXTAREA', 'PRE'];

let clickedLink = false;
const clickLinkHandler = () => clickedLink = true;
const onBlur = () => clickedLink ? (clickedLink = false) : actions.close();

const SearchModal = styled.div`
  position: absolute;
  width: 100%;
  background: white;
  height: 54px;
  z-index: 999;
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 20px;
  left: 16px;
`;

const SearchItem = styled(Link)`
  color: ${({ theme }) => theme.foregroundColor};
  display: block;
  background: ${({ theme, active }) => active ? theme.searchItemActive : 'white'};
  padding: 4px 8px;
  text-align: left;
  text-decoration: none;
  border: 1px solid silver;
  border-top: none;
  outline: none;
  &:hover {
    background: ${({ theme }) => theme.searchItemHover};
  }
`;

const SearchTextBox = styled(TextBox)`
  margin-top: 12px;
  margin-left: 40px;
  max-width: 100%;
  border: none;
`;

const SearchBox = () => {
  const location = useLocation();
  const state = useStore();

  const history = useHistory();
  // on mount
  useEffect(() => {
    window.devek.openSearch = () => actions.open(history);
    addEventListener('keydown', e => {
      if (e.key === "/" && !e.altKey && !e.shiftKey && !e.ctrlKey && !inputNodeNames.includes(e.target.nodeName)) {
        actions.open(history);
        e.preventDefault();
      }
    });
  }, []);

  // location change
  useEffect(() => {
    if (state.open) {
      actions.close();
    }
  }, [location.pathname]);

  const { search, open, index, paths } = state;
  if (!open) return null;

  return (
    <SearchModal>
      <SearchIcon>🔍</SearchIcon>
      <SearchTextBox type="search" autoFocus autoComplete="off" placeholder="Search" 
                     value={search} onChange={actions.search} onBlur={onBlur} />
      {search && paths.map((p, i) => (
        <SearchItem key={p.path} to={p.path} active={i === index} onMouseDown={clickLinkHandler}>
          <strong>{p.title}</strong> - <span>{p.description}</span>
        </SearchItem>
      ))
      }
    </SearchModal>
  );
};

export default SearchBox;