import React, { useMemo, useCallback } from "react";

import loadable from "@loadable/component";

// fontawesome
import {
  faCookieBite,
  faEye,
  faCircleInfo,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useNotification } from "../../../contexts/NotificationProvider";

// services

// components
const ActionCard = loadable((props) =>
  import("../../../components/ActionCard/ActionCard")
);
const FormDialog = loadable(() => import("./Dialogs/FormDialog"));

// styles
import "./styles.css";
import { useState } from "react";
import { createModel } from "../../../services/general";

function Texts() {
  const { languageState } = useLanguage();

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const { texts, errors, messages } = useMemo(() => {
    return {
      texts: languageState.texts.texts,
      errors: languageState.texts.errors,
      messages: languageState.texts.messages,
    };
  }, [languageState]);

  const [selectedText, setSelectedText] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const termsAction = useCallback(() => {
    setShowDialog(true);
    setSelectedText("terms");
  }, []);

  const aboutAction = useCallback(() => {
    setShowDialog(true);
    setSelectedText("about");
  }, []);

  const privacyPolicyAction = useCallback(() => {
    setShowDialog(true);
    setSelectedText("privacyPolicy");
  }, []);

  const cookiesPolicyAction = useCallback(() => {
    setShowDialog(true);
    setSelectedText("cookiesPolicy");
  }, []);

  const hideDialog = useCallback(() => {
    setShowDialog(false);
    setSelectedText("");
  }, []);

  const onSave = useCallback(
    async (content) => {
      setShowDialog(false);
      try {
        const response = await createModel("texts", {
          id: selectedText,
          content,
        });
        console.log(response)
      } catch (err) {
        console.error(err);
        if (String(err) === "AxiosError: Network Error")
          showNotification("error", errors.notConnected);
        else showNotification("error", String(err));
      }
      setSelectedText("");
    },
    [selectedText]
  );

  return (
    <div className="texts">
      <FormDialog
        selectedText={selectedText}
        visible={showDialog}
        onClose={hideDialog}
        onAction={onSave}
      />
      <ActionCard
        onClick={termsAction}
        title={texts.actions.terms.title}
        icon={faUserLock}
      />
      <ActionCard
        onClick={aboutAction}
        title={texts.actions.about.title}
        icon={faCircleInfo}
      />
      <ActionCard
        onClick={privacyPolicyAction}
        title={texts.actions.privacyPolicy.title}
        icon={faEye}
      />
      <ActionCard
        onClick={cookiesPolicyAction}
        title={texts.actions.cookiesPolicy.title}
        icon={faCookieBite}
      />
    </div>
  );
}

export default Texts;
