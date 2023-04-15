import React, { useState, memo } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

// styles
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./styles.css";

function Content({ className, value, onChange, editorFixed }) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (nEditorState) => setEditorState(nEditorState);

  return (
    <div className={className}>
      <Editor
        editorState={value || editorState}
        wrapperClassName="wrapper"
        editorClassName={`editor ${editorFixed ? "editor-fixed" : ""}`}
        onEditorStateChange={onChange || onEditorStateChange}
      />

      {/*   <textarea
        disabled
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      /> */}
    </div>
  );
}

const ContentMemo = memo((props) => <Content {...props} />, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.className === newProps.className &&
    oldProps.value === newProps.value &&
    oldProps.onChange === newProps.onChange &&
    oldProps.editorFixed === newProps.editorFixed
  );
}

export default ContentMemo;
