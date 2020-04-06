import React, { useCallback, useEffect, useMemo } from "react";
import { connect, ConnectedProps } from "react-redux";
import { AppState } from "src/modules/types";
import * as selectors from "src/modules/draft/selector";
import { selectToken } from "src/modules/auth/selector";
import * as actions from "src/modules/draft/action";
import { convertToRaw, EditorState } from "draft-js";
import throttle from "lodash/throttle";
import SyncEditor from "./SyncEditor";

interface Props extends PropsFromRedux {
  editorId: string;
  className: string;
}

/**
 * Need to maintain the current SelectionState
 * No need to store it in internal state to bypass the additional rendering
 * Reference:
 * - https://github.com/facebook/draft-js/issues/700
 * - https://caffeinecoding.com/react-redux-draftjs/
 */

let localEditorState = EditorState.createEmpty();

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
  setEditingTitle,
  setEditingValue,
  className,
  collaborators,
  editingTitle,
  editingValue,
  broadcast,
}) => {
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

  const saveEditor = (editorState: EditorState) => {
    const raw = convertToRaw(editorState.getCurrentContent());
    broadcast({
      type: "value",
      data: {
        value: raw,
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
      setEditingTitle(title);
      throttledSaveTitle(title);
    },
    [setEditingTitle, throttledSaveTitle]
  );
  const handleChangeValue = useCallback(
    (editorState: EditorState) => {
      localEditorState = editorState;
      setEditingValue(convertToRaw(editorState.getCurrentContent()));
      throttledSave(editorState);
    },
    [setEditingValue, throttledSave]
  );
  const editorState = useMemo(() => {
    return EditorState.acceptSelection(
      editingValue,
      localEditorState.getSelection()
    );
  }, [editingValue]);

  return (
    <SyncEditor
      className={className}
      onChangeValue={handleChangeValue}
      onChangeTitle={handleChangeTitle}
      editorState={editorState}
      collaborators={collaborators}
      editingTitle={editingTitle}
    />
  );
};

const mapStateToProps = (state: AppState) => ({
  editingTitle: selectors.selectEditingTitle(state),
  editingValue: selectors.selectEditingValue(state),
  collaborators: selectors.selectCollaborators(state),
  token: selectToken(state),
});

const mapDispatchToProps = {
  detail: actions.detail,
  broadcast: actions.broadcast,
  unsubscribe: actions.unsubscribe,
  clearEditingValue: actions.clearEditingValue,
  setEditingTitle: actions.setEditingTitle,
  setEditingValue: actions.setEditingValue,
  listenCollaboratorChange: actions.listenCollaboratorChange,
  listenEditorStateChange: actions.listenEditorStateChange,
  join: actions.join,
  leave: actions.leave,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SyncEditorContainer);
