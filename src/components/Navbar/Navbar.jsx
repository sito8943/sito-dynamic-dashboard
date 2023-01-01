/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useReducer } from "react";

// @mui/material
import {
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  Typography,
  IconButton,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import FilterAltIcon  from "@mui/icons-material/FilterAlt";
import LightModeIcon from "@mui/icons-material/LightMode";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

// components
import CookieBox from "../CookieBox/CookieBox";
import BackButton from "../BackButton/BackButton";

// contexts
import { useMode } from "../../context/ModeProvider";
import { useSearch } from "../../context/SearchProvider";
import { useHistory } from "../../context/HistoryProvider";
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

// services
import { search } from "../../services/search";

const Navbar = () => {
  const theme = useTheme();
  const location = useLocation();
  const biggerThanMD = useMediaQuery("(min-width:900px)");

  const { languageState } = useLanguage();
  const { modeState, setModeState } = useMode();
  const { searchState, setSearchState } = useSearch();

  const toggleMode = () => setModeState({ type: "toggle" });

  const { setNotificationState } = useNotification();

  const [showSearch, setShowSearch] = useState(false);
  const toggleSearchInput = () => setShowSearch(!showSearch);

  useEffect(() => {
    if (!showSearch) setShowFilters(false);
  }, [showSearch]);

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const searchResultReducer = (searchResultState, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { newArray } = action;
        return newArray;
      }
      default:
        return [];
    }
  };

  const [searchResult, setSearchResult] = useReducer(searchResultReducer, []);

  const preventDefault = (event) => event.preventDefault();

  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { historyState, setHistoryState } = useHistory();

  useEffect(() => {
    try {
      const exist = localStorage.getItem("search-history");
      if (exist !== null && exist !== "") {
        setHistoryState({
          type: "set",
          newArray: JSON.parse(exist).filter(
            (item) => item !== null && item.trim().length > 0
          ),
        });
        setShowHistory(true);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const toggleFilters = () => setShowFilters(!showFilters);

  const topBarHeight = useCallback(() => {
    let returnHeight = 60;
    if (biggerThanMD) {
      if (showHistory && showSearch) returnHeight += 50;
      if (showFilters) returnHeight += 55;
    } else {
      if (showFilters) returnHeight += 55;
      if (showSearch) {
        returnHeight += 55;
        if (showHistory) {
          if (historyState.length) returnHeight += 50;
          else returnHeight += 40;
        }
      }
    }
    return `${returnHeight}px`;
  }, [biggerThanMD, showSearch, showFilters, showHistory, historyState]);

  const [toSearch, setToSearch] = useState("");

  const clearInput = () => setToSearch("");

  const filter = async () => {
    setSearchState({ type: "loading" });
    try {
      const response = await search(toSearch, {});
      const data = await response.list;
      setSearchResult({ type: "set", newArray: data });
      setSearchState({ type: "ready" });
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
      setSearchState({ type: "error" });
    }
  };

  useEffect(() => {
    if (searchState.length) filter();
  }, [searchState]);

  const handleToSearch = (e) => setToSearch(e.target.value);

  const searchResultIsEmpty = useCallback(() => {
    if (searchResult && (searchResult[0] || searchResult[1]))
      if (searchResult[0].list.length || searchResult[1].list.length)
        return false;
    return true;
  }, [searchResult]);

  const [homePage, setHomePage] = useState(false);

  useEffect(() => {
    try {
      if (location.search) {
        const queryParams = location.search.substring(1);
        const params = queryParams.split("&");
        params.forEach((item) => {
          const [paramName, paramValue] = item.split("=");
          if (paramValue)
            switch (paramName) {
              default:
                break;
            }
        });
      }
      setHomePage(location.pathname !== "/" ? false : true);
    } catch (err) {
      console.error(err);
    }
  }, [location]);

  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        zIndex: 99,
        width: "100%",
        padding: "10px 10px 0px 0px",
        position: "fixed",
        overflow: "hidden",
        height: topBarHeight(),
        borderBottom: "1px solid",
        transition: "height 200ms ease",
        borderColor: "rgba(87,87,87,0.5)",
        background: theme.palette.background.paper,
      }}
    >
      <CookieBox />
      <Box
        sx={{
          gap: "30px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          marginBottom: biggerThanMD ? "20px" : "10px",
          position: "relative",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {!homePage ? (
            <BackButton
              flat
              to="/"
              sx={{ position: "relative", top: 0, left: 0 }}
            />
          ) : null}

          <Typography
            sx={{
              fontSize: { xs: "1.3rem", md: "1.5rem" },
              width: "100%",
              marginTop: "3px",
              marginLeft: homePage ? "20px" : 0,
            }}
            variant="h3"
          >
            {languageState.texts.AppName}
          </Typography>
        </Box>
        {biggerThanMD ? (
          <FormControl
            sx={{
              overflow: "hidden",
              position: "absolute",
              right: "40px",
              div: { borderRadius: "25px" },
              width: showSearch ? "50%" : "40px",
              transition: "all 1000ms ease",
              marginLeft: showSearch ? 0 : "50%",
              fieldset: {
                transition: "all 1000ms ease",
                borderWidth: showSearch ? "1px" : 0,
              },
              input: { padding: "7.5px 14px", fontSize: "15px" },
            }}
            variant="outlined"
          >
            <OutlinedInput
              id="search"
              size="small"
              value={toSearch}
              onClick={() => setShowHistory(true)}
              placeholder={languageState.texts.Navbar.Search}
              onChange={handleToSearch}
              type="search"
              startAdornment={
                <InputAdornment position="start">
                  {showSearch ? (
                    <IconButton
                      sx={{ marginLeft: "-12px" }}
                      color="secondary"
                      aria-label="filter"
                      onClick={toggleFilters}
                      onMouseDown={preventDefault}
                      edge="start"
                      size="small"
                    >
                      {!showFilters ? <FilterAltIcon /> : <FilterAltOffIcon />}
                    </IconButton>
                  ) : null}
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment
                  position="end"
                  sx={{ button: { marginRight: "20px" } }}
                >
                  {toSearch.length > 0 ? (
                    <IconButton
                      sx={{ marginRight: "20px" }}
                      color="secondary"
                      aria-label="clear"
                      onClick={clearInput}
                      onMouseDown={preventDefault}
                      edge="end"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ) : null}
                </InputAdornment>
              }
            />
          </FormControl>
        ) : null}
        <Box display="flex" alignItems="center">
          <IconButton color="inherit" onClick={toggleSearchInput}>
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit" onClick={toggleMode}>
            {modeState.mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Box>
      </Box>
      {!biggerThanMD ? (
        <FormControl
          sx={{
            width: "100%",
            padding: "0 10px 0 20px",
            div: { borderRadius: "25px" },
            input: { padding: "7.5px 14px", fontSize: "15px" },
          }}
          variant="outlined"
          component="form"
        >
          <OutlinedInput
            id="search"
            size="small"
            value={toSearch}
            placeholder={languageState.texts.Navbar.Search}
            onChange={handleToSearch}
            onClick={() => setShowHistory(true)}
            type="search"
            startAdornment={
              <InputAdornment position="start">
                {showSearch ? (
                  <IconButton
                    color="secondary"
                    aria-label="filter"
                    onClick={toggleFilters}
                    sx={{ marginLeft: "-12px" }}
                    onMouseDown={preventDefault}
                    edge="start"
                    size="small"
                  >
                    {!showFilters ? <FilterAltIcon /> : <FilterAltOffIcon />}
                  </IconButton>
                ) : null}
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                {toSearch.length > 0 ? (
                  <IconButton
                    color="secondary"
                    aria-label="clear"
                    onClick={clearInput}
                    onMouseDown={preventDefault}
                    edge="end"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                ) : null}
              </InputAdornment>
            }
          />
        </FormControl>
      ) : null}
      {historyState.length > 0 ? (
        <Box
          sx={{
            gap: "10px",
            marginLeft: 0,
            width: "100vw",
            display: "flex",
            overflow: "auto",
            marginTop: "20px",
            padding: "0px 10px 0px 20px",
          }}
        >
          {historyState.map((item, i) => (
            <Chip
              key={i}
              label={item}
              onClick={() => setToSearch(item)}
              icon={<AccessTimeIcon fontSize="small" />}
            />
          ))}
        </Box>
      ) : (
        <Typography
          sx={{
            color: "gray",
            marginTop: biggerThanMD ? 0 : "20px",
            marginLeft: biggerThanMD ? 0 : "5px",
          }}
        >
          {languageState.texts.Navbar.NoHistory}
        </Typography>
      )}
      <Box
        sx={{
          gap: "10px",
          marginLeft: 0,
          display: "flex",
          marginTop: "20px",
          padding: "0px 10px 0px 20px",
        }}
      >
        chips
      </Box>
    </Box>
  );
};

export default Navbar;
