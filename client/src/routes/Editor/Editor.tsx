import React, { useEffect } from "react";
import SyncEditor from "src/components/SyncEditor";
import { useParams, Link } from "react-router-dom";
import { serviceRegistry } from "src/lib/services/registry";

interface Props {}

const service = serviceRegistry.draft;

const Editor: React.FC<Props> = () => {
  const { editorId } = useParams<{ editorId: string }>();
  useEffect(() => {
    service.create({ id: editorId });
  }, [editorId]);
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
