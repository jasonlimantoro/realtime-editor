import React, { useEffect, useCallback } from "react";
import { connect, ConnectedProps } from "react-redux";
import "draft-js/dist/Draft.css";
import { Editor, EditorState, convertToRaw, RichUtils } from "draft-js";
import throttle from "lodash/throttle";
import {
  detail,
  broadcast,
  listen,
  unlisten,
  clearEditingValue,
  setEditingTitle,
  setEditingValue,
  listenCollaboratorChange,
  leave,
} from "src/modules/draft/action";
import {
  selectDraftById,
  selectEditingTitle,
  selectEditingValue,
} from "src/modules/draft/selector";
import { AppState } from "src/modules/types";

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
  listen,
  unlisten,
  clearEditingValue,
  setEditingTitle,
  setEditingValue,
  listenCollaboratorChange,
  leave,
}) => {
  const saveEditor = (editorState: EditorState) => {
    const raw = convertToRaw(editorState.getCurrentContent());
    broadcast({
      field: "value",
      data: {
        value: raw,
        editorId,
      },
    });
  };
  const saveTitle = (title: string) => {
    broadcast({
      field: "title",
      data: {
        editorId,
        title,
      },
    });
  };

  const throttledSave = useCallback(throttle(saveEditor, 500), [editorId]);
  const throttledSaveTitle = useCallback(throttle(saveTitle, 500), [editorId]);

  useEffect(() => {
    listenCollaboratorChange();
  }, [listenCollaboratorChange]);
  useEffect(() => {
    detail(editorId);
  }, [detail, editorId]);
  useEffect(() => {
    broadcast({ field: "room", data: editorId });
  }, [editorId, broadcast]);

  const handleChange = (editorState: EditorState) => {
    localEditorState = editorState;
    setEditingValue(convertToRaw(editorState.getCurrentContent()));
    throttledSave(editorState);
  };

  const handleBold = () => {
    const state = RichUtils.toggleInlineStyle(editingValue, "BOLD");
    handleChange(state);
    saveEditor(state);
  };
  const handleItalic = () => {
    const state = RichUtils.toggleInlineStyle(editingValue, "ITALIC");
    handleChange(state);
    saveEditor(state);
  };
  const handleBulletPoints = () => {
    const state = RichUtils.toggleBlockType(
      editingValue,
      "unordered-list-item"
    );
    handleChange(state);
    saveEditor(state);
  };
  const handleNumberedPoints = () => {
    const state = RichUtils.toggleBlockType(editingValue, "ordered-list-item");
    handleChange(state);
    saveEditor(state);
  };

  useEffect(() => {
    listen({ field: "title" });
    listen({ field: "value" });
    return () => {
      unlisten();
    };
  }, [listen, unlisten]);

  useEffect(() => {
    return () => {
      leave({ room: editorId });
      clearEditingValue();
    };
  }, [clearEditingValue, leave, editorId]);
  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
    throttledSaveTitle(e.target.value);
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
          editorState={EditorState.acceptSelection(
            editingValue,
            localEditorState.getSelection()
          )}
          onChange={handleChange}
        />
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
});

const mapDispatchToProps = {
  detail,
  broadcast,
  listen,
  unlisten,
  clearEditingValue,
  setEditingTitle,
  setEditingValue,
  listenCollaboratorChange,
  leave,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SyncEditor);
