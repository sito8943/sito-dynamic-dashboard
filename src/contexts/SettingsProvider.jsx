/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useReducer, useContext } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

const SettingsContext = createContext();

const settingsReducer = (settingsState, action) => {
  switch (action.type) {
    case "set-generals": {
      const { photo, preview, business, menu, phone, types } = action;
      return { ...settingsState, photo, preview, business, menu, phone, types };
    }
    case "set-schedule": {
      const { schedule } = action;
      return { ...settingsState, schedule };
    }
    case "set-socials": {
      const { socialMedia, description } = action;
      return { ...settingsState, socialMedia, description };
    }
    case "set-map": {
      const { location } = action;
      return { ...settingsState, location };
    }
    case "set-qr": {
      const { menu, preview } = action;
      return { ...settingsState, menu, preview };
    }
    case "any-changes": {
      const { to } = action;
      return { ...settingsState, anyChange: to };
    }
    case "set-old-photo": {
      const { photo } = action;
      return { ...settingsState, oldPhoto: photo, photo };
    }
    case "set-old-panoramic": {
      const { panoramic } = action;
      return { ...settingsState, oldPanoramic: panoramic, panoramic };
    }
    case "set-old-headerImages": {
      const { headerImages } = action;
      return { ...settingsState, oldHeaderImages: headerImages, headerImages };
    }
    case "set-old-photo-promotion": {
      const { photo } = action;
      return { ...settingsState, oldPhotoPromotion: photo, photo };
    }
    case "set-photo": {
      const { photo } = action;
      return { ...settingsState, photo };
    }
    case "set-panoramic": {
      const { panoramic } = action;
      return { ...settingsState, panoramic };
    }
    case "set-headerImages": {
      const { headerImages } = action;
      return { ...settingsState, headerImages };
    }
    case "set-photo-promotion": {
      const { photo } = action;
      return { ...settingsState, oldPhotoPromotion: photo, photo };
    }
    case "reset": {
      return {};
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const SettingsProvider = ({ children }) => {
  const [settingsState, setSettingsState] = useReducer(settingsReducer, {});

  const value = { settingsState, setSettingsState };
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// hooks
const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined)
    throw new Error("settingsContext must be used within a Provider");
  return context;
};

export { SettingsProvider, useSettings };
