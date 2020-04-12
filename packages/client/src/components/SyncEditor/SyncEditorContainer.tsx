import React, { useCallback, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { IEditor } from "src/modules/editor/editor.model";
import throttle from "lodash/throttle";
import { useMst } from "src/modules/root";
import { selectToken, useComposeAuth } from "src/modules/auth/hooks";
import SyncEditor from "./SyncEditor";
import { createEditorStateFromString } from "./utils";

const DELAY = 1000;
const stopper = throttle;

interface Props {
  editorId: string;
  className?: string;
}

const SyncEditorContainer: React.FC<Props> = ({ editorId, className }) => {
  const {
    drafts: { detailDraft },
    editor,
  } = useMst();
  const {
    title,
    broadcast,
    setTitle,
    setValue,
    value,
    updatedAt,
    listen,
    unlisten,
    allCollaborators,
    join,
    leave,
  } = editor as IEditor;
  const [token] = useComposeAuth(selectToken);

  const safeBroadcastTitle = useCallback(
    stopper((title: string) => {
      broadcast("Title", { editorId, title });
    }, DELAY),
    [editorId, broadcast]
  );
  const safeBroadcastValue = useCallback(
    stopper((value: string) => {
      broadcast("Value", { editorId, value });
    }, DELAY),
    [editorId, broadcast]
  );

  const [editorState, setEditorState] = useState(
    createEditorStateFromString(value || "")
  );
  const prevRawState = useRef(value);
  useEffect(() => {
    if (prevRawState.current !== value) {
      setEditorState(createEditorStateFromString(value));
      prevRawState.current = value;
    }
  }, [value]);
  useEffect(() => {
    detailDraft(editorId);
  }, [detailDraft, editorId]);

  useEffect(() => {
    const payload = { room: editorId, meta: { token } };
    join(payload);
    return () => {
      leave(payload);
    };
  }, [editorId, join, token, leave]);

  useEffect(() => {
    listen();
    return () => {
      unlisten();
    };
  }, [listen, unlisten]);

  const handleChangeTitle = useCallback(
    (title: string) => {
      setTitle(title);
      safeBroadcastTitle(title);
    },
    [setTitle, safeBroadcastTitle]
  );
  const handleChangeValue = useCallback(
    (value: any, raw) => {
      setValue(value);
      safeBroadcastValue(value);
      setEditorState(raw);
      prevRawState.current = value;
    },
    [safeBroadcastValue, setValue]
  );
  return (
    <SyncEditor
      className={className}
      onChangeValue={handleChangeValue}
      onChangeTitle={handleChangeTitle}
      editorState={editorState}
      collaborators={allCollaborators}
      editingTitle={title || ""}
      timestamp={updatedAt}
    />
  );
};

export default observer(SyncEditorContainer);
