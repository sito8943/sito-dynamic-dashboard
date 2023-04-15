import React, { useCallback, useReducer, useState, useMemo } from "react";

import Tippy from "@tippyjs/react";

import { sortBy } from "some-javascript-utils/array.js";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEyeSlash,
  faEye,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider.jsx";

// components
import SitoImage from "sito-image";

// images
import noPhoto from "../../assets/images/no-photo.webp";
import noProduct from "../../assets/images/no-product.jpg";

// styles
import "./styles.css";

export default function ResponsiveList({
  model,
  rows,
  onDelete,
  onEdit,
  onShow,
  onHide,
  onPageChange,
  page,
}) {
  const { languageState } = useLanguage();

  const { models, table, tooltips } = useMemo(() => {
    return {
      models: languageState.texts.models,
      table: languageState.texts.table,
      tooltips: languageState.texts.tooltips,
    };
  }, [languageState]);

  const [activeColumn, setActiveColumn] = useState("date");

  const rowsReducer = (activeRowsOld, action) => {
    const { type } = action;
    switch (type) {
      case "toggle": {
        const { index } = action;
        if (activeRowsOld.indexOf(index) >= 0) activeRowsOld.splice(index, 1);
        else activeRowsOld.push(index);
        return [...activeRowsOld];
      }
      default:
        return activeRowsOld;
    }
  };

  const [activeRows, setActiveRows] = useReducer(rowsReducer, []);

  const getPhoto = useCallback(
    (object) => {
      if (object.photo) {
        if (object.photo.url) return object.photo.url;
      } else if (
        object.headerImages &&
        object.headerImages.length &&
        object.headerImages[0].url
      )
        return object.headerImages[0].url;
      return model === "user" ? noPhoto : noProduct;
    },
    [model]
  );

  const printRows = useCallback(() => {
    return sortBy(rows, activeColumn).map((item, i) => (
      <div
        className={`flex w-full rounded-2xl cursor-pointer ${
          activeRows.find((wtem) => wtem === item.id)
            ? "dark:bg-dark-drawer-background bg-light-drawer-background"
            : ""
        } bg-light-background2 dark:bg-dark-background2 dark:hover:bg-dark-drawer-background hover:bg-light-drawer-background`}
        key={item.id}
      >
        <div
          className="p-5 gap-5 items-center justify-between flex w-full"
          key={item.name || item.title}
          onClick={() => setActiveRows({ type: "toggle", index: item.id })}
        >
          {model !== "log" ? (
            <SitoImage
              className="element-image"
              src={getPhoto(item)}
              alt={item.name || item.title}
            />
          ) : null}
          <div className="flex flex-col w-full">
            {models[model].responsiveList.rows.map((jtem) => (
              <span key={jtem} className="w-full">
                {jtem !== "name" && jtem !== "title" && jtem !== "user"
                  ? `${table.columns[jtem].label}:`
                  : ""}{" "}
                {item[jtem]}
              </span>
            ))}
          </div>
        </div>
      </div>
    ));
  }, [rows, activeRows, activeColumn]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between w-full">
        <div>
          {activeRows.length ? (
            <p>
              {activeRows.length}{" "}
              {activeRows.length === 1
                ? table.singleSelection
                : table.multiSelection}
            </p>
          ) : null}
        </div>
        <div className="flex gap-5 justify-end">
          {onDelete && activeRows.length ? (
            <Tippy content={tooltips.deleteSelected}>
              <button
                onClick={() => onDelete(activeRows)}
                className="icon-button"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </Tippy>
          ) : null}
          {onEdit && activeRows.length === 1 ? (
            <Tippy content={tooltips.edit}>
              <button
                onClick={() => onEdit(activeRows)}
                className="icon-button"
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
            </Tippy>
          ) : null}
          {onShow && activeRows.length ? (
            <Tippy content={tooltips.showSelected}>
              <button onClick={onShow} className="icon-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
            </Tippy>
          ) : null}
          {onHide && activeRows.length ? (
            <Tippy content={tooltips.hideSelected}>
              <button
                onClick={() => onHide(activeRows)}
                className="icon-button"
              >
                <FontAwesomeIcon icon={faEyeSlash} />
              </button>
            </Tippy>
          ) : null}
        </div>
      </div>
      <div className="w-full mt-2 flex flex-col items-start justify-start gap-5">
        {printRows()}
      </div>
    </div>
  );
}
