import React, { useCallback, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { IDraft } from "src/modules/draft/models/Draft.model";
import { useMst } from "src/modules/root";
import SyncEditor from "./SyncEditor";
import { createEditorStateFromString } from "./utils";

interface Props {
  editorId: string;
  className?: string;
}

const SyncEditorContainer: React.FC<Props> = ({ editorId, className }) => {
  const {
    auth: { token },
    drafts: { detailDraft, draftById },
  } = useMst();
  const {
    broadcastTitle,
    title,
    broadcastValue,
    value,
    updatedAt,
    listen,
    unlisten,
    allCollaborators,
    join,
    leave,
  } = draftById(editorId) as IDraft;

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
    join?.(payload);
    return () => {
      leave?.(payload);
    };
  }, [editorId, join, token, leave]);

  useEffect(() => {
    listen?.();
    return () => {
      unlisten?.();
    };
  }, [listen, unlisten]);

  const handleChangeTitle = useCallback(
    (title: string) => {
      broadcastTitle(title);
    },
    [broadcastTitle]
  );
  const handleChangeValue = useCallback(
    (value: any, raw) => {
      broadcastValue(value);
      setEditorState(raw);
      prevRawState.current = value;
    },
    [broadcastValue]
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
