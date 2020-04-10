import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SyncEditorContainer from "src/components/SyncEditor/SyncEditorContainer";
import { useMst } from "src/modules/root";
import { observer } from "mobx-react";

interface Props {}

const Editor: React.FC<Props> = () => {
  const { editorId } = useParams<{ editorId: string }>();
  const {
    drafts: { createDrafts },
  } = useMst();
  useEffect(() => {
    createDrafts({ id: editorId });
  }, [createDrafts, editorId]);
  return (
    <div className="p-8 h-full">
      <Link className="underline" to="/editors">
        Leave Editor
      </Link>
      <div className="h-full">
        <SyncEditorContainer editorId={editorId} />
      </div>
    </div>
  );
};

export default observer(Editor);
