import React, { useEffect, useCallback, useState } from "react";
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
import throttle from "lodash/throttle";
import DraftService from "src/modules/draft/service";
import config from "src/lib/config";
import { DraftSchema } from "src/lib/entities/draft";

const service = new DraftService({
  baseUrl: config.SERVER_HOST,
});

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
  editorId: string;
}

interface UpdateTitleSocketData {
  title: string;
}

const SyncEditor: React.FC<Props> = ({
  className,
  initialValue = "",
  editorId,
}) => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(ContentState.createFromText(initialValue))
  );
  const [, setDraft] = React.useState<DraftSchema>();

  const [title, setTitle] = useState("");
  const saveEditor = (editorState: EditorState) => {
    const raw = convertToRaw(editorState.getCurrentContent());
    socket.emit("changeEditor", {
      value: raw,
      editorId,
    });
  };
  const saveTitle = (title: string) => {
    socket.emit("changeTitle", {
      editorId,
      title,
    });
  };

  const throttledSave = useCallback(throttle(saveEditor, 500), [editorId]);
  const throttledSaveTitle = useCallback(throttle(saveTitle, 500), [editorId]);

  useEffect(() => {
    const fetchDetail = async () => {
      const { data } = await service.detail(editorId);
      if (data) {
        if (data.value) {
          setEditorState(
            EditorState.createWithContent(convertFromRaw(data.value))
          );
        }
        setDraft(data);
        setTitle(data.title);
      }
    };
    fetchDetail();
  }, [editorId]);

  useEffect(() => {
    socket.emit("create", editorId);
  }, [editorId]);

  const handleChange = (editorState: EditorState) => {
    setEditorState(editorState);
    throttledSave(editorState);
  };

  const handleBold = () => {
    const state = RichUtils.toggleInlineStyle(editorState, "BOLD");
    handleChange(state);
    saveEditor(state);
  };
  const handleItalic = () => {
    const state = RichUtils.toggleInlineStyle(editorState, "ITALIC");
    handleChange(state);
    saveEditor(state);
  };
  const handleBulletPoints = () => {
    const state = RichUtils.toggleBlockType(editorState, "unordered-list-item");
    handleChange(state);
    saveEditor(state);
  };
  const handleNumberedPoints = () => {
    const state = RichUtils.toggleBlockType(editorState, "ordered-list-item");
    handleChange(state);
    saveEditor(state);
  };

  useEffect(() => {
    socket.on("updateEditor", ({ value }: SocketData) => {
      setEditorState(EditorState.createWithContent(convertFromRaw(value)));
    });
    return () => {
      socket.off("updateEditor");
    };
  }, []);
  useEffect(() => {
    socket.on("updateTitle", ({ title }: UpdateTitleSocketData) => {
      setTitle(title);
    });
    return () => {
      socket.off("updateTitle");
    };
  }, []);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    throttledSaveTitle(e.target.value);
  };

  return (
    <div>
      <div>
        <input
          className="w-full text-2xl"
          placeholder="Untitled"
          type="text"
          value={title}
          onChange={handleChangeTitle}
        />
      </div>
      <div className={className}>
        <div className="flex">
          <button className="mr-4 btn btn-gray" onClick={handleBold}>
            B
          </button>
          <button onClick={handleItalic} className="mr-4 btn btn-gray">
            I
          </button>
          <button className="mr-4 btn btn-gray" onClick={handleBulletPoints}>
            Bullet points
          </button>
          <button className="mr-4 btn btn-gray" onClick={handleNumberedPoints}>
            Numbered points
          </button>
        </div>
        <Editor
          placeholder="Enter something amazing"
          editorState={editorState}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default SyncEditor;
