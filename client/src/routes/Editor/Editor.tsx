import React from "react";
import SyncEditor from "src/components/SyncEditor";
import { useParams } from "react-router-dom";

interface Props {}

const Editor: React.FC<Props> = () => {
  const { editorId } = useParams<{ editorId: string }>();
  return (
    <div className="p-8">
      <SyncEditor className="p-8 bg-gray-200" editorId={editorId} />
    </div>
  );
};

export default Editor;
