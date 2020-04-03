import React, { useEffect, useCallback, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import "draft-js/dist/Draft.css";
import {
  Editor,
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw,
  RichUtils,
} from "draft-js";
import throttle from "lodash/throttle";
import {
  detail,
  broadcast,
  listen,
  unlisten,
  clearEditingValue,
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
  initialValue?: string;
}

const SyncEditor: React.FC<Props> = ({
  className,
  initialValue = "",
  editorId,
  detail,
  draft,
  broadcast,
  editingTitle,
  editingValue,
  listen,
  unlisten,
  clearEditingValue,
}) => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(ContentState.createFromText(initialValue))
  );
  const [title, setTitle] = useState("");
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
    if (draft) {
      if (draft.value) {
        setEditorState(
          EditorState.createWithContent(convertFromRaw(draft.value))
        );
      }
      setTitle(draft.title);
    }
  }, [editorId, draft]);

  useEffect(() => {
    detail(editorId);
  }, [detail, editorId]);
  useEffect(() => {
    broadcast({ field: "room", data: editorId });
  }, [editorId, broadcast]);

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
    listen({ field: "title" });
    listen({ field: "value" });
    return () => {
      unlisten({ field: "title" });
      unlisten({ field: "value" });
    };
  }, [listen, unlisten]);
  useEffect(() => {
    if (editingValue) {
      setEditorState(
        EditorState.createWithContent(convertFromRaw(editingValue))
      );
    }
    setTitle(editingTitle);
  }, [editingValue, editingTitle]);

  useEffect(() => {
    return () => {
      clearEditingValue();
    };
  }, [clearEditingValue]);
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
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SyncEditor);
