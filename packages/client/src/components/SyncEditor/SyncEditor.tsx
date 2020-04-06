import React, { useCallback, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import "draft-js/dist/Draft.css";
import { convertToRaw, Editor, EditorState, RichUtils } from "draft-js";
import throttle from "lodash/throttle";
import {
  broadcast,
  clearEditingValue,
  detail,
  join,
  leave,
  listenCollaboratorChange,
  listenEditorStateChange,
  setEditingTitle,
  setEditingValue,
  unsubscribe,
} from "src/modules/draft/action";
import {
  selectCollaborators,
  selectDraftById,
  selectEditingTitle,
  selectEditingValue,
} from "src/modules/draft/selector";
import { AppState } from "src/modules/types";
import { selectToken } from "src/modules/auth/selector";
import ToolbarItem from "src/components/SyncEditor/Toolbar";
import { TOOLBARS } from "./constants";

interface Props extends PropsFromRedux {
  className: string;
  editorId: string;
}

/**
 * Need to maintain the current SelectionState
 * No need to store it in internal state to bypass the additional rendering
 * Reference:
 * - https://github.com/facebook/draft-js/issues/700
 * - https://caffeinecoding.com/react-redux-draftjs/
 */
let localEditorState = EditorState.createEmpty();

const SyncEditor: React.FC<Props> = ({
  className,
  editorId,
  detail,
  broadcast,
  editingTitle,
  editingValue,
  unsubscribe,
  clearEditingValue,
  setEditingTitle,
  setEditingValue,
  listenCollaboratorChange,
  listenEditorStateChange,
  leave,
  token,
  collaborators,
  join,
}) => {
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

  const handleChange = (editorState: EditorState) => {
    localEditorState = editorState;
    setEditingValue(convertToRaw(editorState.getCurrentContent()));
    throttledSave(editorState);
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
    throttledSaveTitle(e.target.value);
  };

  const getEditorState = () => {
    return EditorState.acceptSelection(
      editingValue,
      localEditorState.getSelection()
    );
  };
  const handleChangeStyle = (inlineStyle: string) => {
    const state = RichUtils.toggleInlineStyle(getEditorState(), inlineStyle);
    handleChange(state);
    const raw = convertToRaw(state.getCurrentContent());
    broadcast({
      type: "value",
      data: {
        value: raw,
        editorId,
      },
    });
  };
  const handleChangeBlock = (blockType: string) => {
    const state = RichUtils.toggleBlockType(getEditorState(), blockType);
    handleChange(state);
    const raw = convertToRaw(state.getCurrentContent());
    broadcast({
      type: "value",
      data: {
        value: raw,
        editorId,
      },
    });
  };

  return (
    <div>
      <div>
        <input
          className="w-full text-2xl"
          placeholder="Untitled"
          type="text"
          value={editingTitle}
          onChange={handleChangeTitle}
        />
      </div>
      <div className={className}>
        <div className="flex">
          {TOOLBARS.map((tool) => (
            <ToolbarItem
              key={tool.label}
              className="btn mx-2"
              onClick={
                tool.blockType
                  ? () => handleChangeBlock(tool.blockType)
                  : () => handleChangeStyle(tool.inlineStyle as string)
              }
              label={tool.label}
              icon={tool.icon}
            />
          ))}
        </div>
        <Editor
          placeholder="Enter something amazing"
          editorState={getEditorState()}
          onChange={handleChange}
        />
      </div>
      <div>
        <p className="text-xl">
          Collaborators: You{" "}
          {collaborators.length ? (
            <span>and {collaborators.length} others</span>
          ) : (
            <span>only</span>
          )}
        </p>
        <ul>
          {collaborators.map((c, idx) => (
            <li key={idx}>
              {c} <span className="italic text-gray-700">is collaborating</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (
  state: AppState,
  { editorId }: { editorId: string }
) => ({
  draft: selectDraftById(state, { id: editorId }),
  editingTitle: selectEditingTitle(state),
  editingValue: selectEditingValue(state),
  token: selectToken(state),
  collaborators: selectCollaborators(state),
});

const mapDispatchToProps = {
  detail,
  broadcast,
  unsubscribe,
  clearEditingValue,
  setEditingTitle,
  setEditingValue,
  listenCollaboratorChange,
  listenEditorStateChange,
  join,
  leave,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SyncEditor);
