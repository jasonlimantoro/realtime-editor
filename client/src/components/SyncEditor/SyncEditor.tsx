import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  Editor,
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw,
  RawDraftContentState,
} from "draft-js";
const SERVER_HOST = "localhost";
const SERVER_PORT = 4000;
const SERVER = `http://${SERVER_HOST}:${SERVER_PORT}`;
const socket = io(SERVER);

interface Props {
  className: string;
  initialValue?: string;
}

interface SocketData {
  value: RawDraftContentState;
  id: string;
}

const SyncEditor: React.FC<Props> = ({ className, initialValue = "" }) => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(ContentState.createFromText(initialValue))
  );
  const conn = useRef("");

  useEffect(() => {
    socket.on("connect", () => {
      conn.current = socket.id;
    });
  }, []);

  useEffect(() => {
    fetch(`${SERVER}/editor/init`)
      .then((r) => r.json())
      .then((value) => {
        return setEditorState(
          EditorState.createWithContent(ContentState.createFromText(value))
        );
      });
  }, []);

  const handleChange = (editorState: EditorState) => {
    setEditorState(editorState);
    const raw = convertToRaw(editorState.getCurrentContent());
    socket.emit("changeEditor", {
      value: raw,
      id: conn.current,
    });
  };

  useEffect(() => {
    socket.on("updateEditor", ({ value, id }: SocketData) => {
      if (id !== conn.current) {
        setEditorState(EditorState.createWithContent(convertFromRaw(value)));
      }
    });
    return () => {
      socket.off("updateEditor");
    };
  }, []);

  return (
    <div className={className}>
      <Editor editorState={editorState} onChange={handleChange} />
    </div>
  );
};

export default SyncEditor;
