import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { AppState } from "src/modules/types";
import * as selectors from "src/modules/draft/selector";
import { selectToken } from "src/modules/auth/selector";
import * as actions from "src/modules/draft/action";
import throttle from "lodash/throttle";
import SyncEditor from "./SyncEditor";
import { createEditorStateFromString } from "./utils";

interface Props extends PropsFromRedux {
  editorId: string;
  className?: string;
}

const SyncEditorContainer: React.FC<Props> = ({
  editorId,
  token,
  detail,
  join,
  leave,
  listenEditorStateChange,
  listenCollaboratorChange,
  clearEditingValue,
  unsubscribe,
  setEditingState,
  className,
  collaborators,
  editingTitle,
  editingValue,
  broadcast,
  timestamp,
}) => {
  const [editorState, setEditorState] = useState(
    createEditorStateFromString(editingValue)
  );
  const prevRawState = useRef(editingValue);
  useEffect(() => {
    if (prevRawState.current !== editingValue) {
      setEditorState(createEditorStateFromString(editingValue));
      prevRawState.current = editingValue;
    }
  }, [editingValue]);
  useEffect(() => {
    detail(editorId);
  }, [detail, editorId]);

  useEffect(() => {
    const payload = { room: editorId, meta: { token } };
    join(payload);
    return () => {
      leave(payload);
    };
  }, [editorId, join, token, leave]);

  useEffect(() => {
    listenEditorStateChange();
    listenCollaboratorChange();
    return () => {
      clearEditingValue();
      unsubscribe();
    };
  }, [
    listenEditorStateChange,
    unsubscribe,
    clearEditingValue,
    listenCollaboratorChange,
  ]);

  const saveEditor = (editorState: any) => {
    broadcast({
      type: "value",
      data: {
        value: editorState,
        editorId,
      },
    });
  };
  const saveTitle = (title: string) => {
    broadcast({
      type: "title",
      data: {
        editorId,
        title,
      },
    });
  };

  const throttledSave = useCallback(throttle(saveEditor, 500), [editorId]);
  const throttledSaveTitle = useCallback(throttle(saveTitle, 500), [editorId]);

  const handleChangeTitle = useCallback(
    (title: string) => {
      setEditingState("title", title);
      throttledSaveTitle(title);
    },
    [setEditingState, throttledSaveTitle]
  );
  const handleChangeValue = useCallback(
    (value: any, raw) => {
      setEditingState("value", value);
      setEditorState(raw);
      prevRawState.current = value;
      throttledSave(value);
    },
    [setEditingState, throttledSave]
  );

  return (
    <SyncEditor
      className={className}
      onChangeValue={handleChangeValue}
      onChangeTitle={handleChangeTitle}
      editorState={editorState}
      collaborators={collaborators}
      editingTitle={editingTitle}
      timestamp={timestamp}
    />
  );
};

const mapStateToProps = (state: AppState) => ({
  editingTitle: selectors.selectEditingTitle(state),
  editingValue: selectors.selectEditingValue(state),
  collaborators: selectors.selectCollaborators(state),
  timestamp: selectors.selectTimeStamp(state),
  token: selectToken(state),
});

const mapDispatchToProps = {
  detail: actions.crud.detail,
  broadcast: actions.broadcast,
  unsubscribe: actions.unsubscribe,
  clearEditingValue: actions.clearEditingValue,
  setEditingState: actions.setEditingState,
  listenCollaboratorChange: actions.listenCollaboratorChange,
  listenEditorStateChange: actions.listenEditorStateChange,
  join: actions.join,
  leave: actions.leave,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SyncEditorContainer);
