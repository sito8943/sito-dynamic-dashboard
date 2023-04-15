import React, { useMemo } from "react";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

const Error = (props) => {
  const { onRetry, text } = props;
  const { languageState } = useLanguage();

  const error = useMemo(() => {
    return languageState.texts.error;
  }, [languageState]);

  return (
    <div className="w-full h-full p-error flex flex-col items-center justify-center gap-10">
      <h1 className="font-bold text-error text-2xl">
        <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" />
        {error.title}
      </h1>
      <p className="text-error perror">{text}</p>
      <button onClick={onRetry} className="submit">
        {error.retry}
      </button>
    </div>
  );
};

export default Error;
