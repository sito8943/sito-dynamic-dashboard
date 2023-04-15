import React, { useMemo, useCallback, useRef, useState } from "react";

import loadable from "@loadable/component";

// fontawesome
import {
  faCircleCheck,
  faClock,
  faCloudArrowUp,
  faDownload,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useNotification } from "../../../contexts/NotificationProvider";

// services
import {
  uploadBackup as remoteUploadBackup,
  createBackup as remoteCreateBackup,
  executeBackup as remoteExecuteBackup,
  downloadBackup as remoteDownloadBackup,
  restoreBackup,
} from "../../../services/backup";

// components
const ActionCard = loadable((props) => import("../../../components/ActionCard/ActionCard"));
const RestoreDialog = loadable((props) => import("./Dialogs/RestoreDialog"));
const DownloadDialog = loadable((props) => import("./Dialogs/DownloadDialog"));
const ConfirmationDialog = loadable((props) =>
  import("./Dialogs/ConfirmationDialog")
);

// styles
import "./styles.css";

function Backup() {
  const [backupToExecute, setBackupToExecute] = useState(0);

  const { languageState } = useLanguage();

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const uploadRef = useRef(null);

  const { backupText, errors, messages } = useMemo(() => {
    return {
      backupText: languageState.texts.backup,
      errors: languageState.texts.errors,
      messages: languageState.texts.messages,
    };
  }, [languageState]);

  const scheduleBackup = useCallback(() => {}, []);

  const uploadBackup = useCallback(async (json) => {
    try {
      const response = await remoteUploadBackup(json);
      const { data } = response;
      const { id } = data;
      showNotification("success", `${messages.backupUploaded} ${id}`);
    } catch (err) {
      console.error(err);
      showNotification("error", errors.someWrong);
    }
  }, []);

  const uploadBackupAction = useCallback(() => {
    if (uploadRef !== null) uploadRef.current.click();
  }, [uploadRef]);

  const onUploadFile = useCallback((e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      try {
        const json = JSON.parse(reader.result);
        if (!json.id && typeof json.id !== "number")
          throw new Error("Invalid file");
        uploadBackup(json);
      } catch (err) {
        console.error(err.message);
        showNotification("error", errors.wrongFile);
      }
    });

    reader.readAsText(file);
  }, []);

  const [showDownload, setShowDownload] = useState(false);

  const hideDownload = useCallback(() => {
    setShowDownload(false);
  }, [setShowDownload]);

  const [showRestore, setShowRestore] = useState(false);

  const hideRestore = useCallback(() => {
    setShowRestore(false);
  }, [setShowRestore]);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const hideConfirmation = useCallback(() => {
    setShowConfirmation(false);
  }, [setShowConfirmation]);

  const restoreBackupAction = useCallback(() => {
    setShowRestore(true);
  }, [setShowRestore]);

  const selectToRestore = useCallback(
    (id) => {
      setShowRestore(false);
      setBackupToExecute(id);
      setShowConfirmation(true);
    },
    [setShowConfirmation]
  );

  const downloadBackupAction = useCallback(() => {
    setShowDownload(true);
  }, [setShowDownload]);

  const selectToDownload = useCallback(async (id) => {
    try {
      const response = await remoteDownloadBackup(id);
      const { data } = response;
      var json = JSON.stringify(data);
      var blob = new Blob([json], { type: "application/json" });
      var url = URL.createObjectURL(blob);

      var a = document.createElement("a");
      a.href = url;
      a.download = `${data.id}-${data.user}.json`;
      a.click();

      URL.revokeObjectURL(url);

      console.log(response);
    } catch (err) {
      console.error(err);
      showNotification("error", errors.someWrong);
    }
  }, []);

  const createBackup = useCallback(async () => {
    setShowRestore(false);
    try {
      const response = await remoteCreateBackup();
      const { data } = response;
      const { id } = data;
      showNotification("success", `${messages.backupCreated} ${id}`);
    } catch (err) {
      console.error(err);
      showNotification("error", errors.someWrong);
    }
  }, []);

  const executeBackup = useCallback(async () => {
    if (backupToExecute) {
      try {
        await remoteExecuteBackup(backupToExecute);
        showNotification(
          "success",
          `${messages.backupRestore} ${backupToExecute}`
        );
      } catch (err) {
        console.error(err);
        showNotification("error", errors);
      }
    }
  }, [backupToExecute]);

  return (
    <div className="backup">
      <ConfirmationDialog
        visible={showConfirmation}
        onClose={hideConfirmation}
        onAction={executeBackup}
      />
      <DownloadDialog
        visible={showDownload}
        onClose={hideDownload}
        onSelect={selectToDownload}
      />
      <RestoreDialog
        visible={showRestore}
        onClose={hideRestore}
        onSelect={selectToRestore}
        createBackup={createBackup}
      />
      <ActionCard
        onClick={scheduleBackup}
        title={backupText.actions.schedule.title}
        icon={faClock}
      />
      <ActionCard
        onClick={createBackup}
        title={backupText.actions.make.title}
        icon={faCircleCheck}
      />
      <ActionCard
        onClick={downloadBackupAction}
        title={backupText.actions.download.title}
        icon={faDownload}
      />
      <ActionCard
        onClick={restoreBackupAction}
        title={backupText.actions.restore.title}
        icon={faRotateLeft}
      />
      <ActionCard
        onClick={uploadBackupAction}
        title={backupText.actions.upload.title}
        icon={faCloudArrowUp}
      />
      <input
        ref={uploadRef}
        type="file"
        onChange={onUploadFile}
        accept=".json"
      />
    </div>
  );
}

export default Backup;
