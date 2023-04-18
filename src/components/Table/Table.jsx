import React, { useCallback, useMemo, useState, useReducer } from "react";
import Tippy from "@tippyjs/react";

// @emotion/css
import { css } from "@emotion/css";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEyeSlash,
  faEye,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// components
import SitoImage from "sito-image";

// utils
import { parseDate } from "../../utils/parser.js";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider.jsx";
import { sortBy } from "some-javascript-utils/array.js";

// images
import noPhoto from "../../assets/images/no-photo.webp";
import noProduct from "../../assets/images/no-product.jpg";

// styles
import "./styles.css";

export default function Table({
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

  const { columns, models, table, tooltips } = useMemo(() => {
    return {
      columns: languageState.texts.table.columns,
      models: languageState.texts.models,
      table: languageState.texts.table,
      tooltips: languageState.texts.tooltips,
    };
  }, [languageState]);

  const rowsReducer = (activeRowsOld, action) => {
    const { type } = action;
    switch (type) {
      case "toggle": {
        const { index } = action;
        if (activeRowsOld.indexOf(index) >= 0)
          activeRowsOld.splice(activeRowsOld.indexOf(index), 1);
        else activeRowsOld.push(index);
        console.log(activeRowsOld);
        return [...activeRowsOld];
      }
      default:
        return activeRowsOld;
    }
  };

  const [activeColumn, setActiveColumn] = useState("date");
  const [activeRows, setActiveRows] = useReducer(rowsReducer, []);

  const printColumns = useCallback(() => {
    const parseActiveColumn =
      activeColumn[0] === "-" ? activeColumn.substring(1) : activeColumn;
    console.log(models[model]);
    return models[model].table.columns
      .filter((item) => item !== "id")
      .map((item) => (
        <th
          className={`p-5 text-left ${css({
            minWidth: columns[item].minWidth,
            width: columns[item].width,
          })}`}
          key={item}
        >
          <button
            onClick={() => {
              if (parseActiveColumn === item) setActiveColumn(`-${item}`);
              else setActiveColumn(item);
            }}
            className={`transition dark:hover:text-primary hover:text-primary ${
              parseActiveColumn === item
                ? "text-primary"
                : "dark:text-white-hover text-dark-background2"
            }`}
          >
            {columns[item].label}
          </button>
        </th>
      ));
  }, [activeColumn]);

  const getPhoto = useCallback(
    (key, object) => {
      if (object[key]) {
        if (key === "photo" && object[key].url) return object[key].url;
        else if (
          key === "headerImages" &&
          object[key].length &&
          object[key][0].url
        )
          return object[key][0].url;
      }
      return model === "user" ? noPhoto : noProduct;
    },
    [model]
  );

  const printRows = useCallback(() => {
    return sortBy(
      rows,
      activeColumn[0] === "-" ? activeColumn.substring(1) : activeColumn,
      activeColumn[0] === "-"
    ).map((item, i) => (
      <tr
        className={`border-white-hover dark:border-secondary border-b-1 cursor-pointer ${
          activeRows?.find((wtem) => wtem === item.id)
            ? "dark:bg-dark-background2 bg-light-background2"
            : ""
        } dark:hover:bg-dark-background2 hover:bg-light-background2`}
        key={item.id}
      >
        {models[model].table.columns
          .filter((jtem) => jtem !== "id")
          .map((jtem, j) => (
            <td
              className="p-5 text-left"
              key={jtem}
              onClick={() => setActiveRows({ type: "toggle", index: item.id })}
            >
              {jtem === "photo" || jtem === "headerImages" ? (
                <div className="table-image">
                  <SitoImage
                    className="rounded-circle w-full h-full object-cover"
                    src={getPhoto(jtem, item)}
                    alt={item.name || item.title}
                  />
                </div>
              ) : (
                <span>
                  {jtem === "date" ? parseDate(item[jtem]) : item[jtem]}
                </span>
              )}
            </td>
          ))}
      </tr>
    ));
  }, [rows, activeRows, activeColumn]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between w-full">
        <div>
          {activeRows?.length ? (
            <p>
              {activeRows.length}{" "}
              {activeRows.length === 1
                ? table.singleSelection
                : table.multiSelection}
            </p>
          ) : null}
        </div>
        <div className="flex gap-5 justify-end">
          {onDelete && activeRows?.length ? (
            <Tippy content={tooltips.deleteSelected}>
              <button
                onClick={() => onDelete(activeRows)}
                className="icon-button"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </Tippy>
          ) : null}
          {onEdit && activeRows?.length === 1 ? (
            <Tippy content={tooltips.edit}>
              <button
                onClick={() => onEdit(activeRows)}
                className="icon-button"
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
            </Tippy>
          ) : null}
          {onShow && activeRows?.length ? (
            <Tippy content={tooltips.showSelected}>
              <button onClick={onShow} className="icon-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
            </Tippy>
          ) : null}
          {onHide && activeRows?.length ? (
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
      <table className="w-full mt-2 ">
        <tbody>
          <tr className="border-white-hover dark:border-secondary border-b-1">
            {printColumns()}
          </tr>
          {printRows()}
        </tbody>
      </table>
    </div>
  );
}
