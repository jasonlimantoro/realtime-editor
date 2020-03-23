import React, { useMemo, useState } from "react";
import { createEditor, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";

interface Props {}

const Editor: React.FC<Props> = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);

  return (
    <div className="p-8">
      <Slate
        editor={editor}
        value={value}
        onChange={(value: Node[]) => setValue(value)}
      >
        <Editable className="p-8 bg-gray-200" />
      </Slate>
    </div>
  );
};

export default Editor;
