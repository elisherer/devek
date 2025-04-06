import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import styled from "styled-components";

import { TextBox } from "../_lib";
import { actions, useStore } from "./SearchBox.store";

const inputNodeNames = ["INPUT", "TEXTAREA", "PRE"];

let clickedLink = false;
const clickLinkHandler = () => (clickedLink = true);
const onBlur = () => (clickedLink ? (clickedLink = false) : actions.close());

const SearchModal = styled.div`
  position: absolute;
  width: 100%;
  background: ${({ theme }) => theme.backgroundColor};
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
  background: ${({ theme, active }) => (active ? theme.highlight : theme.backgroundColor)};
  padding: 4px 8px;
  text-align: left;
  text-decoration: none;
  border-top: none;
  border-bottom: 1px solid ${({ theme }) => theme.greyBorder};
  outline: none;
  &:hover {
    background: ${({ theme }) => theme.highlight};
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

  const navigate = useNavigate();
  // on mount
  useEffect(() => {
    window.devek.openSearch = () => actions.open(navigate);
    addEventListener("keydown", e => {
      if (e.key === "/" && !e.altKey && !e.shiftKey && !e.ctrlKey && !inputNodeNames.includes(e.target.nodeName)) {
        actions.open(navigate);
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
      <SearchTextBox
        autoFocus
        autoComplete="off"
        placeholder="Search"
        value={search}
        onChange={actions.search}
        onBlur={onBlur}
      />
      {search &&
        paths.map((p, i) => (
          <SearchItem key={p.path} to={p.path} active={i === index ? "true" : ""} onMouseDown={clickLinkHandler}>
            <strong>{p.title}</strong> - <span>{p.description}</span>
          </SearchItem>
        ))}
    </SearchModal>
  );
};

export default SearchBox;
