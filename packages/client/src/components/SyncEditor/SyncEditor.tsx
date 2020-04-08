import React from "react";
import cls from "classnames";
import moment from "moment";
import RichTextEditor, { EditorValue } from "react-rte";
import Collaborators from "./Collaborators";

interface Props {
  className?: string;
  onChangeTitle: (title: string) => void;
  onChangeValue: (value: any, raw: EditorValue) => void;
  editingTitle: string;
  timestamp: any;
  collaborators: string[];
  editorState: EditorValue;
}

const SyncEditor: React.FC<Props> = ({
  className,
  onChangeTitle,
  onChangeValue,
  editingTitle,
  collaborators,
  editorState,
  timestamp,
}) => {
  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeTitle(e.target.value);
  };
  const handleChangeValue = (value: EditorValue) => {
    onChangeValue(value.toString("markdown"), value);
  };

  return (
    <div className={cls("h-full", className)}>
      <p className="text-gray-600">
        Last updated at {timestamp && moment(timestamp).calendar()}
      </p>
      <div className="mb-4">
        <input
          className="w-full text-2xl"
          placeholder="Untitled"
          type="text"
          value={editingTitle}
          onChange={handleChangeTitle}
        />
      </div>
      <div className="flex h-full">
        <div className="w-3/4 h-full">
          <RichTextEditor
            editorClassName="font-sans p-4 shadow-xl"
            placeholder="Enter something amazing"
            value={editorState}
            onChange={handleChangeValue}
          />
        </div>
        <div className="w-1/4 ml-4 h-full">
          <div className="p-4 h-full">
            <Collaborators collaborators={collaborators} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncEditor;
