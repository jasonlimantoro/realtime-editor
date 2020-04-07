import React from "react";
import RichTextEditor, { EditorValue } from "react-rte";

interface Props {
  className?: string;
  onChangeTitle: (title: string) => void;
  onChangeValue: (value: any, raw: EditorValue) => void;
  editingTitle: string;
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
}) => {
  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeTitle(e.target.value);
  };
  const handleChangeValue = (value: EditorValue) => {
    onChangeValue(value.toString("markdown"), value);
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
        <RichTextEditor
          placeholder="Enter something amazing"
          value={editorState}
          onChange={handleChangeValue}
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

export default SyncEditor;
