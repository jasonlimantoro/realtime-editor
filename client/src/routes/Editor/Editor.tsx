import React from "react";
import SyncEditor from "src/components/SyncEditor";

interface Props {}

const Editor: React.FC<Props> = () => {
  return (
    <div className="p-8">
      <SyncEditor className="p-8 bg-gray-200" />
    </div>
  );
};

export default Editor;
