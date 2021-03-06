import { Fragment, Suspense, useCallback, useEffect, useState } from "react";
import { Switch, Route, Link, NavLink, Redirect, useLocation } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiGithub, mdiMenu, mdiBrightness4 } from "@mdi/js";
import SearchBox from "./search/SearchBox";
import NotFound from "./NotFound";
import { siteMap } from "../sitemap";
import { useStore, actions } from "./App.store";
import screen from "helpers/screen";
import { Spinner } from "./_lib";

import GlobalStyle from "./App.global.style";
import {
  MainNavigation,
  StyledNavLink,
  Hamburger,
  ToggleTheme,
  GitHubIcon,
  SearchHint,
  StyledTabs,
  Overlay
} from "./App.style";
import { ThemeProvider } from "styled-components";
import themes from "../theme";
import Settings from "../settings";

const devekSearch = () => window.devek.openSearch();

const App = () => {
  const [theme, setTheme] = useState(Settings.get("theme"));
  const toggleTheme = useCallback(() => {
    if (theme === "dark") {
      setTheme("light");
      Settings.set("theme", "light");
    }
    if (theme === "light") {
      setTheme("dark");
      Settings.set("theme", "dark");
    }
  }, [theme]);

  const location = useLocation();
  if (location.pathname === "/" && location.search) {
    return <Redirect to="/" />;
  }

  const state = useStore();

  let header = null;
  const navLinks = Object.keys(siteMap).map(path => {
    const active = location.pathname === path || location.pathname.startsWith(path + "/");
    if (active) {
      header = siteMap[path].header;
    }

    return path === "/" ? (
      <Fragment key={path}>
        <Link to="/" aria-label="Homepage" />
        <SearchHint>
          Press <kbd onClick={devekSearch}>/</kbd> to search
        </SearchHint>
      </Fragment>
    ) : (
      <StyledNavLink key={path} to={path} activeClassName="active" aria-label={siteMap[path].title}>
        {!!siteMap[path].icon && <Icon path={siteMap[path].icon} size={1} />}
        {siteMap[path].title}
      </StyledNavLink>
    );
  });

  // locate parent on siteMap
  const parentPath = "/" + location.pathname.split("/")[1];
  const siteMapParent = siteMap[parentPath];

  // location change
  useEffect(() => {
    document.title = header && location.pathname !== "/" ? `Devek - ${header}` : "Devek";
    if (!screen.isDesktop) {
      actions.drawerClose();
    }
  }, [location.pathname]);

  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyle />

      <MainNavigation open={state.drawer}>
        <Hamburger onClick={actions.drawerClose}>
          <Icon path={mdiMenu} size={1.5} color="white" />
        </Hamburger>
        <GitHubIcon>
          <a
            href="https://github.com/elisherer/devek"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <Icon path={mdiGithub} size={1.33} />
          </a>
        </GitHubIcon>
        {navLinks}
      </MainNavigation>

      <main>
        {state.drawer && <Overlay onClick={actions.drawerClose} />}
        <SearchBox />

        <header>
          <Hamburger onClick={actions.drawerOpen}>
            <Icon path={mdiMenu} size={1.5} color={theme.dark ? "white" : "black"} />
          </Hamburger>
          <h1>
            {siteMapParent.icon && <Icon path={siteMapParent.icon} size={1.33} />}{" "}
            {siteMapParent.header}
          </h1>
          {siteMapParent && siteMapParent.children && (
            <StyledTabs>
              {Object.keys(siteMapParent.children).map(path => (
                <NavLink key={path} to={parentPath + path} exact={path === "/" || path === ""}>
                  {siteMapParent.children[path].title}
                </NavLink>
              ))}
            </StyledTabs>
          )}
          <ToggleTheme onClick={toggleTheme}>
            <Icon path={mdiBrightness4} color={theme.dark ? "#cccccc" : "#333333"} />
          </ToggleTheme>
        </header>

        <Suspense fallback={<Spinner />}>
          <article>
            <Switch>
              {Object.keys(siteMap).map(path => (
                <Route
                  key={path}
                  path={path}
                  exact={path === "/"}
                  component={siteMap[path].component}
                />
              ))}
              <Route component={NotFound} />
            </Switch>
          </article>
        </Suspense>
      </main>
    </ThemeProvider>
  );
};

export default App;
