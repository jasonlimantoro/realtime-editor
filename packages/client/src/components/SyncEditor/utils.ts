import RichTextEditor from "react-rte";

export const createEditorStateFromString = (value: string) => {
  return RichTextEditor.createValueFromString(value, "markdown");
};
