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
      case "clear":
        return {};
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

  const modelsReducer = (modelsState, action) => {
    const { type } = action;
    switch (type) {
      default:
        return { ...modelsState };
    }
  };

  const [models, setModels] = useReducer(modelsReducer, {
    provinces: ["HOla", "Jelou"],
  });

  const getFilter = useCallback(
    (field) => {
      const { id } = field;
      if (models[id] && inputs[id])
        return models[id]
          .filter(
            (item) => item.toLowerCase().indexOf(inputs[id].toLowerCase()) >= 0
          )
          .map((jtem, i) => (
            <button type="button" key={i}>
              Lorem Ipsum
            </button>
          ));
      return [];
    },
    [inputs, models]
  );

  return (
    <form onSubmit={sendInputs} className="flex flex-col gap-10">
      {Object.values(model).map((item) => (
        <div key={item.id}>
          {item.type === "text" ? (
            <div className="flex flex-col gap-10">
              <label htmlFor={item.id}>{labels[item.id]}</label>
              <input
                type={item.text}
                value={inputs[item.id] || ""}
                className="bg-dark-blood rounded-20px p-active bg-none w-full"
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
          {item.type === "autocomplete" ? (
            <div className={`${styles.autocomplete} flex flex-col gap-10`}>
              <label htmlFor={item.id}>{labels[item.id]}</label>
              <input
                type={item.text}
                value={inputs[item.id] || ""}
                className="bg-dark-blood rounded-20px p-active w-full"
                placeholder={item.placeholder}
                onChange={(e) =>
                  setInputs({
                    id: item.id,
                    type: "change",
                    newValue: e.target.value,
                  })
                }
              />
              <div
                className={`${styles.options} bg-blood rounded-20px flex flex-col gap-10`}
              >
                {getFilter(item)}
              </div>
            </div>
          ) : null}
        </div>
      ))}
      <div className="flex gap-10 mt-5 w-full justify-end">
        <button
          type="button"
          onClick={() => setInputs({ type: "clear" })}
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
