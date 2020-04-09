import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { AppState } from "src/modules/types";
import { crud } from "src/modules/draft/action";
import SyncEditorContainer from "src/components/SyncEditor/SyncEditorContainer";
import { useMst } from "src/modules/root";

interface EditorProps {}

type Props = EditorProps & LinkMapStateProps & LinkMapDispatchProps;

const Editor: React.FC<Props> = ({ create }) => {
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

interface LinkMapStateProps {}

interface LinkMapDispatchProps {
  create: (body: any) => void;
}

const mapStateToProps = (_state: AppState): LinkMapStateProps => ({});

const mapDispatchToProps: LinkMapDispatchProps = {
  create: crud.create,
};
export default connect(mapStateToProps, mapDispatchToProps)(Editor);
