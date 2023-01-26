import React, { useCallback, useMemo, useReducer } from "react";

// contexts
import { useLanguage } from "../../../context/LanguageProvider";

// styles
import styles from "../../../styles/Dashboard.module.css";

const Form = ({ model }) => {
  const { languageState } = useLanguage();

  const { buttons, labels } = useMemo(() => {
    return {
      buttons: languageState.texts.Buttons,
      labels: languageState.texts.Labels,
    };
  }, [languageState]);

  const inputsReducer = (inputsState, action) => {
    const { type } = action;
    switch (type) {
      case "change": {
        const newInputsValue = { ...inputsState };
        const { id, newValue } = action;
        newInputsValue[id] = newValue;
        return newInputsValue;
      }
      default:
        return { ...inputsState };
    }
  };

  const [inputs, setInputs] = useReducer(inputsReducer, {});

  const sendInputs = useCallback(
    (e) => {
      e.preventDefault();
      console.log(inputs);
    },
    [inputs]
  );

  return (
    <form onSubmit={sendInputs}>
      {Object.values(model).map((item) => (
        <div key={item.id}>
          {item.type === "text" ? (
            <div className="flex flex-col gap-10">
              <label htmlFor={item.id}>{labels[item.id]}</label>
              <input
                type={item.text}
                value={inputs[item.id]}
                className="rounded-20px p-active"
                placeholder={item.placeholder}
                onChange={(e) =>
                  setInputs({
                    id: item.id,
                    type: "change",
                    newValue: e.target.value,
                  })
                }
              />
            </div>
          ) : null}
        </div>
      ))}
      <div className="flex gap-10 mt-5 w-full justify-end">
        <button
          type="button"
          className={`${styles["no-active"]} ${styles["tab-button"]}`}
        >
          {buttons.clear}
        </button>
        <button type="submit" className={`${styles["tab-button"]} bg-dodger`}>
          {buttons.save}
        </button>
      </div>
    </form>
  );
};

export default Form;
