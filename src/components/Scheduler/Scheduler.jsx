import React, { useState, useEffect, useMemo } from "react";
import { useCallback } from "react";

import { useScreenWidth } from "use-screen-width";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

export default function Scheduler({
  className,
  activeDay,
  onChange,
  schedule,
}) {
  const widthViewport = useScreenWidth();

  const [biggerThanMD, setBiggerThanMD] = useState(false);

  useEffect(() => {
    setBiggerThanMD(widthViewport.screenWidth > 900);
  }, [widthViewport]);

  const { languageState } = useLanguage();

  const { settings } = useMemo(() => {
    return { settings: languageState.texts.settings };
  }, [languageState]);

  const printDays = useCallback(() => {
    return Object.values(settings.inputs.schedule.days).map((item) => (
      <button
        type="button"
        onClick={() => onChange(item.id)}
        className={`p-button rounded-button ${
          item.id === activeDay ? "submit" : "secondary"
        }`}
        key={item.id}
      >
        {biggerThanMD ? item.label : item.id}
      </button>
    ));
  }, [activeDay, biggerThanMD, schedule]);

  return (
    <div
      className={`flex items-center justify-start gap-3 w-full ${className}`}
    >
      {printDays()}
    </div>
  );
}
