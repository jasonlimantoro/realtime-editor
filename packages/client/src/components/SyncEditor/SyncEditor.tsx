import React from "react";
import "draft-js/dist/Draft.css";
import { Editor, EditorState, RichUtils } from "draft-js";
import ToolbarItem from "src/components/SyncEditor/Toolbar";
import { TOOLBARS } from "./constants";

interface Props {
  className: string;
  onChangeTitle: (title: string) => void;
  onChangeValue: (value: any) => void;
  editingTitle: string;
  collaborators: string[];
  editorState: EditorState;
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

  const handleChangeStyle = (inlineStyle: string) => {
    const state = RichUtils.toggleInlineStyle(editorState, inlineStyle);
    onChangeValue(state);
  };
  const handleChangeBlock = (blockType: string) => {
    const state = RichUtils.toggleBlockType(editorState, blockType);
    onChangeValue(state);
  };

  const hasInlineStyle = (inlineStyle: string) => {
    try {
      const currentInlineStyle = editorState.getCurrentInlineStyle();
      return currentInlineStyle.has(inlineStyle);
    } catch {
      return false;
    }
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
              active={
                tool.inlineStyle ? hasInlineStyle(tool.inlineStyle) : false
              }
              key={tool.label}
              className="btn mx-2"
              onMouseDown={
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
          editorState={editorState}
          onChange={onChangeValue}
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
