import React, { useMemo, useState } from "react";
import { createEditor, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";

interface Props {}

const Editor: React.FC<Props> = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }]
    }
  ]);

  return (
    <div style={{ paddingLeft: "3rem", paddingRight: "3rem" }}>
      <Slate
        editor={editor}
        value={value}
        onChange={(value: Node[]) => setValue(value)}
      >
        <Editable
          style={{
            backgroundColor: "#fafafa",
            padding: "2rem"
          }}
        />
      </Slate>
    </div>
  );
};

export default Editor;
