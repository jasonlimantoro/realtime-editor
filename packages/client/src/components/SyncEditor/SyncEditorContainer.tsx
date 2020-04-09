import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { AppState } from "src/modules/types";
import * as selectors from "src/modules/draft/selector";
import { selectToken } from "src/modules/auth/selector";
import * as actions from "src/modules/draft/action";
import { observer } from "mobx-react";
import { IDraft } from "src/modules/draft/models/Draft.model";
import { useMst } from "src/modules/root";
import SyncEditor from "./SyncEditor";
import { createEditorStateFromString } from "./utils";

interface Props extends PropsFromRedux {
  editorId: string;
  className?: string;
}

const SyncEditorContainer: React.FC<Props> = ({
  editorId,
  token,
  join,
  leave,
  listenEditorStateChange,
  listenCollaboratorChange,
  clearEditingValue,
  unsubscribe,
  className,
  collaborators,
}) => {
  const {
    drafts: { detailDraft, draftById },
  } = useMst();
  const { broadcastTitle, title, broadcastValue, value, updatedAt } = draftById(
    editorId
  ) as IDraft;

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
      collaborators={collaborators}
      editingTitle={title || ""}
      timestamp={updatedAt}
    />
  );
};

const mapStateToProps = (state: AppState) => ({
  collaborators: selectors.selectCollaborators(state),
  token: selectToken(state),
});

const mapDispatchToProps = {
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

export default connector(observer(SyncEditorContainer));
