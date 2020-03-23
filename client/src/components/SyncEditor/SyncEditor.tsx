import React, { useMemo, useState } from "react";
import { createEditor, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";

interface Props {
  className: string;
  initialValue?: Node[];
}
const dummyContents = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

const SyncEditor: React.FC<Props> = ({
  className,
  initialValue = dummyContents,
}) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>(initialValue);
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value: Node[]) => setValue(value)}
    >
      <Editable className={className} />
    </Slate>
  );
};

export default SyncEditor;
