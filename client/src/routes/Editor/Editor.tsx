import React from "react";
import SyncEditor from "src/components/SyncEditor";
import { useParams, Link } from "react-router-dom";

interface Props {}

const Editor: React.FC<Props> = () => {
  const { editorId } = useParams<{ editorId: string }>();
  return (
    <div className="p-8">
      <Link className="underline" to="/editors">
        List of Editors
      </Link>
      <SyncEditor className="p-8 bg-gray-200" editorId={editorId} />
    </div>
  );
};

export default Editor;
