import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import "draft-js/dist/Draft.css";
import {
  Editor,
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw,
  RawDraftContentState,
  RichUtils,
} from "draft-js";

const SERVER_HOST = "localhost";
const SERVER_PORT = 4000;
const SERVER = `http://${SERVER_HOST}:${SERVER_PORT}`;
const socket = io(SERVER);

interface Props {
  className: string;
  editorId: string;
  initialValue?: string;
}

interface SocketData {
  value: RawDraftContentState;
  id: string;
  editorId: string;
}

const SyncEditor: React.FC<Props> = ({
  className,
  initialValue = "",
  editorId,
}) => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(ContentState.createFromText(initialValue))
  );
  const conn = useRef(String(Date.now()));

  useEffect(() => {
    fetch(`${SERVER}/editor/${editorId}/init`)
      .then((r) => r.json())
      .then((value) => {
        if (typeof value === "string") {
          setEditorState(
            EditorState.createWithContent(ContentState.createFromText(value))
          );
        } else {
          setEditorState(EditorState.createWithContent(convertFromRaw(value)));
        }
      });
  }, [editorId]);

  const handleChange = (editorState: EditorState) => {
    setEditorState(editorState);
    const raw = convertToRaw(editorState.getCurrentContent());
    socket.emit("changeEditor", {
      value: raw,
      id: conn.current,
      editorId,
    });
  };
  const handleBold = () => {
    handleChange(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };
  const handleItalic = () => {
    handleChange(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  };

  useEffect(() => {
    const updateEditorEvent = `updateEditor-${editorId}`;
    socket.on(updateEditorEvent, ({ value, id }: SocketData) => {
      if (id !== conn.current) {
        setEditorState(EditorState.createWithContent(convertFromRaw(value)));
      }
    });
    return () => {
      socket.off(updateEditorEvent);
    };
  }, [editorId]);

  return (
    <div className={className}>
      <div className="flex">
        <button className="mr-4 btn btn-gray" onClick={handleBold}>
          B
        </button>
        <button onClick={handleItalic} className="mr-4 btn btn-gray">
          I
        </button>
      </div>
      <Editor editorState={editorState} onChange={handleChange} />
    </div>
  );
};

export default SyncEditor;
