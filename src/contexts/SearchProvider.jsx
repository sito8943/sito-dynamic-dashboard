/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import * as React from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

const SearchContext = React.createContext();

const searchReducer = (searchState, action) => {
  switch (action.type) {
    case "error":
      return { ...searchState, error: false };
    case "loading":
      return { ...searchState, loading: true, error: false };
    case "ready":
      return { ...searchState, loading: false, error: false };
    case "set-history": {
      const { history } = action;
      return { ...searchState, history };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const SearchProvider = ({ children }) => {
  const [searchState, setSearchState] = React.useReducer(searchReducer, {
    loading: false,
    error: false,
    input: "",
    filters: {},
    history: [],
  });

  const value = { searchState, setSearchState };
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// hooks
const useSearch = () => {
  const context = React.useContext(SearchContext);
  if (context === undefined)
    throw new Error("searchContext must be used within a Provider");
  return context;
};

export { SearchProvider, useSearch };
