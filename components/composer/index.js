import { useState, useRef } from "react";
import Image from "next/image";

import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";

import styles from "./composer.module.scss";

export default function Composer({ account, className }) {
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleChange = (editorState) => {
    setEditorState(editorState);
  };

  const renderClass = () => {
    return className ? ` ${className}` : "";
  };

  return (
    <div className={`${styles.editor}${renderClass()}`}>
      <div className={styles.photo}>
        <Image
          src={account.photo}
          width={40}
          height={40}
          layout="fixed"
          alt={account.name}
        />
      </div>
      <div className={styles.input}>
        <Editor
          placeholder="What's happening?"
          editorState={editorState}
          onChange={handleChange}
          ref={editorRef}
        />
      </div>
    </div>
  );
}

