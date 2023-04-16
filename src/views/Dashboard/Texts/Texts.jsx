import React, { useMemo, useCallback, useState } from "react";

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

// components
const ActionCard = loadable((props) =>
  import("../../../components/ActionCard/ActionCard")
);
const FormDialog = loadable(() => import("./Dialogs/FormDialog"));

// styles
import "./styles.css";

function Texts() {
  const { languageState } = useLanguage();

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

  return (
    <div className="texts">
      <FormDialog
        selectedText={selectedText}
        visible={showDialog}
        onClose={hideDialog}
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
