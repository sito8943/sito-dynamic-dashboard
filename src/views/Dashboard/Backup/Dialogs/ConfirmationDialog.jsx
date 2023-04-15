import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import loadable from "@loadable/component";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faWarning } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../../../contexts/LanguageProvider";

// components
const DialogList = loadable((props) =>
  import("../../../../components/Modal/DialogList")
);

function ConfirmationDialog({ visible, onClose, onAction }) {
  const { languageState } = useLanguage();

  const { backupsTexts, buttons } = useMemo(() => {
    return {
      backupsTexts: languageState.texts.backup,
      buttons: languageState.texts.buttons,
    };
  }, [languageState]);

  return (
    <DialogList visible={visible} onClose={onClose}>
      <button
        onClick={onClose}
        className="transition flex items-center justify-center absolute top-2 right-2 text-error hover:bg-error hover:text-white w-8 h-8 rounded-circle"
      >
        <FontAwesomeIcon icon={faClose} className="text-xl" />
      </button>
      <div className="flex pt-10 h-full w-20">
        <FontAwesomeIcon className="text-warning text-6xl" icon={faWarning} />
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <h2 className="text-2xl text-dark-background2 dark:text-light-background2 font-bold">
          {backupsTexts.confirmationDialog.title}
        </h2>
        <p>{backupsTexts.confirmationDialog.body}</p>
        <div className="flex items-center justify-end gap-5">
          <button className="submit" type="button" onClick={onAction}>
            {buttons.accept}
          </button>
          <button className="secondary" type="button" onClick={onClose}>
            {buttons.cancel}
          </button>
        </div>
      </div>
    </DialogList>
  );
}

const ConfirmationDialogMemo = memo(
  (props) => <ConfirmationDialog {...props} />,
  arePropsEqual
);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.visible === newProps.visible &&
    oldProps.onClose === newProps.onClose &&
    oldProps.onAction === newProps.onAction
  );
}

export default ConfirmationDialogMemo;
