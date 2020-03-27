import React, { useMemo, useState, useEffect, useRef } from "react";
import { createEditor, Node } from "slate";
import io from "socket.io-client";
import { Slate, Editable, withReact } from "slate-react";

const SERVER_HOST = "localhost";
const SERVER_PORT = 4000;
const SERVER = `http://${SERVER_HOST}:${SERVER_PORT}`;
const socket = io(SERVER);

interface Props {
  className: string;
  initialValue?: Node[];
}

interface SocketData {
  value: Node[];
  id: string;
}

const SyncEditor: React.FC<Props> = ({ className, initialValue = [] }) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>(initialValue);
  const now = useRef(`${Date.now()}`);

  const handleChange = (value: Node[]) => {
    setValue(value);
    const anySyncOperation = editor.operations.some(({ type }) => {
      // @ts-ignore
      return !(type === "set_selection" || type === "set_value");
    });
    if (anySyncOperation) {
      socket.emit("changeEditor", { value, id: now.current });
    }
  };

  useEffect(() => {
    fetch(`${SERVER}/editor/init`)
      .then((r) => r.json())
      .then((value) => setValue(value));
  }, []);

  useEffect(() => {
    socket.on("updateEditor", ({ value, id }: SocketData) => {
      if (id !== now.current) {
        console.log("SYNCING");
        setValue(value);
      }
    });
    return () => {
      socket.off("updateEditor");
    };
  }, []);

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <Editable className={className} />
    </Slate>
  );
};

export default SyncEditor;
