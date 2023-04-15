import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { v4 } from "uuid";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

// @emotion/css
import { css } from "@emotion/css";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider.jsx";

const none = css({ display: "none" });

export default function Autocomplete({
  emptyText,
  extensible,
  placeholder,
  single,
  className,
  inputType,
  inputClassName,
  label,
  id,
  list,
  inputValue,
  inputValueChange,
  loadingComponent,
  loadingEffect,
  options,
  onOptionSelect,
}) {
  const { languageState } = useLanguage();

  const { errors, buttons } = useMemo(() => {
    return {
      errors: languageState.texts.errors,
      buttons: languageState.texts.buttons,
    };
  }, [languageState]);

  const escapeHandler = useCallback((e) => {
    const { keyCode } = e;
    if (keyCode === 27) {
      setDisplayList(false);
      e.target.blur();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", escapeHandler);
    return () => {
      window.removeEventListener("keydown", escapeHandler);
    };
  }, [escapeHandler]);

  const [displayList, setDisplayList] = useState(false);

  const toggleList = () => {
    if (!displayList) setDisplayList(true);
  };

  const deleteItem = useCallback(
    (e, id) => {
      if (!single) {
        const findIndex = list.findIndex((item) => item.id === id);
        if (findIndex >= 0) list.splice(findIndex, 1);
      }
      onOptionSelect([...list]);
    },
    [list, single]
  );

  const inputRef = useRef(null);

  const localOptionSelect = useCallback(
    (e, item) => {
      setDisplayList(false);
      if (!single) {
        if (inputValueChange) inputValueChange({ target: { value: "" } });
        else localValueChange({ target: { value: "" } });
      } else {
        if (inputValueChange)
          inputValueChange({ target: { value: item.name } });
        else localValueChange({ target: { value: item.name } });
      }
      if (typeof item === "string")
        onOptionSelect(e, [...list, { id: v4(), name: item, new: true }]);
      else onOptionSelect(e, [...list, item]);
      if (inputRef !== null) inputRef.current.focus();
    },
    [inputRef, list, single]
  );

  const [localValue, setLocalValue] = useState("");
  const localValueChange = useCallback(
    (e) => setLocalValue(e.target.value),
    [setLocalValue]
  );

  useEffect(() => {
    if (single && list.length) {
      if (inputValueChange)
        inputValueChange({ target: { value: list[0].name } });
      else localValueChange({ target: { value: list[0].name } });
    }
  }, [list, single]);

  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <input
        ref={inputRef}
        onClick={toggleList}
        className={inputClassName || ""}
        type={inputType || "text"}
        id={id}
        value={inputValue || localValue}
        onChange={inputValueChange || localValueChange}
        placeholder={placeholder}
      />
      {!single && list.length ? (
        <div className="flex justify-start items-center m-h-10 gap-2 flex-wrap">
          {list.map((item) => (
            <div key={item.id}>
              <button
                onClick={(e) => deleteItem(e, item.id)}
                type="button"
                className="flex items-center gap-2 justify-start transition-all dark:text-white-hover text-bg-dark-background2 hover:text-white hover:bg-primary dark:hover-bg-primary p-button rounded-button border-white-hover dark:border-dark-drawer-background border-1"
                key={item.id}
              >
                <span>{item.name}</span>
                <FontAwesomeIcon icon={faClose} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      {displayList ? (
        <div
          className="fixed top-0 left-0 w-full h-screen z-10"
          onClick={() => setDisplayList(false)}
        ></div>
      ) : null}
      <div
        className={`absolute z-10 p-2 w-full max-h-400 overflow-auto ${css({
          top: "75px",
        })} bg-light-background2 dark:bg-dark-background shadow-2xl ${
          !displayList && !loadingEffect ? none : "flex"
        }`}
      >
        {loadingEffect ? (
          loadingComponent
        ) : (
          <div className="w-full h-full flex flex-col items-start justify-start">
            {options.length ? (
              options
                .filter((item) =>
                  list
                    ? !list.find((jtem) => {
                        return item.id === jtem.id;
                      })
                    : true
                )
                .map((item) => (
                  <button
                    type="button"
                    onClick={(e) => localOptionSelect(e, item)}
                    className="flex items-start justify-start transition-all hover:text-white dark:text-white-hover text-bg-dark-background2 hover:bg-primary dark:hover-bg-primary w-full p-button"
                    key={item.id}
                  >
                    {item.name}
                  </button>
                ))
            ) : (
              <>{!extensible ? <span>{errors.noResults}</span> : null}</>
            )}
            {((inputValue && inputValue.length) || localValue.length) &&
            options.length === 0 &&
            extensible ? (
              <button
                type="button"
                onClick={(e) => localOptionSelect(e, inputValue || localValue)}
                className="flex items-start justify-start transition-all hover:text-white dark:text-white-hover text-bg-dark-background2 hover:bg-primary dark:hover-bg-primary w-full p-button"
              >
                {buttons.insert} {inputValue || localValue}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
