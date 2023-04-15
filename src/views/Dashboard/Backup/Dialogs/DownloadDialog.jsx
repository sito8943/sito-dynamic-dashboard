import React, { memo, useMemo, useEffect, useCallback, useState } from "react";
import PropTypes from "prop-types";
import loadable from "@loadable/component";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faDownload } from "@fortawesome/free-solid-svg-icons";

// @emotion/css
import { css } from "@emotion/css";

// contexts
import { useLanguage } from "../../../../contexts/LanguageProvider";
import { useNotification } from "../../../../contexts/NotificationProvider";

// services
import { fetchList } from "../../../../services/general";

// components
import Loading from "../../../../components/Loading/Loading";
const DialogList = loadable((props) =>
  import("../../../../components/Modal/DialogList")
);

function RestoreDialog({ visible, onClose, onSelect, createBackup }) {
  const { languageState } = useLanguage();

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const { backupsTexts, errors } = useMemo(() => {
    return {
      backupsTexts: languageState.texts.backup,
      errors: languageState.texts.errors,
    };
  }, [languageState]);

  const [loading, setLoading] = useState(true);

  const [localList, setLocalList] = useState([]);

  const init = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchList([], "backups", 1, -1, "id");
      const { list } = response;
      setLocalList(
        list.map((item) => {
          const date = new Date(Number(item.id));
          return { id: item.id, date };
        })
      );
    } catch (err) {
      console.error(err);
      showNotification("error", errors.someWrong);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (visible) init();
    else setLoading(false);
  }, [visible]);

  return (
    <DialogList
      visible={visible}
      onClose={onClose}
      className={css({
        width: "80% !important",
        maxWidth: "500px",
        height: "600px !important",
      })}
    >
      <button
        onClick={onClose}
        className="transition flex items-center justify-center absolute top-2 right-2 text-error hover:bg-error hover:text-white w-8 h-8 rounded-circle"
      >
        <FontAwesomeIcon icon={faClose} className="text-xl" />
      </button>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full h-full flex flex-col gap-5">
          <h4 className="text-2xl font-bold dark:text-light-background text-dark-background2">
            {backupsTexts.downloadDialog.title}
          </h4>
          <div className="overflow-auto h-full w-full flex flex-col justify-start items-start gap-1">
            {!localList.length ? (
              <div className="flex flex-col gap-3 items-center justify-center h-full w-full">
                <p>{backupsTexts.restoreDialog.noBackups}</p>
                <button onClick={createBackup} className="submit">
                  {backupsTexts.restoreDialog.actionButton}
                </button>
              </div>
            ) : null}
            {localList.map((item) => (
              <button
                onClick={() => onSelect(item.id)}
                className="secondary secondary-hover flex items-center justify-start w-full gap-3"
                key={item.id}
              >
                <FontAwesomeIcon icon={faDownload} />
                <p>{`${item.date.toLocaleString()} - ${item.id}`}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </DialogList>
  );
}

const RestoreDialogMemo = memo(
  (props) => <RestoreDialog {...props} />,
  arePropsEqual
);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.visible === newProps.visible &&
    oldProps.onClose === newProps.onClose &&
    oldProps.onSelect === newProps.onSelect
  );
}

export default RestoreDialogMemo;
