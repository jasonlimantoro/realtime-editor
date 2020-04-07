import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { AppState } from "src/modules/types";
import { crud } from "src/modules/draft/action";
import SyncEditorContainer from "src/components/SyncEditor/SyncEditorContainer";

interface EditorProps {}

type Props = EditorProps & LinkMapStateProps & LinkMapDispatchProps;

const Editor: React.FC<Props> = ({ create }) => {
  const { editorId } = useParams<{ editorId: string }>();
  useEffect(() => {
    create({ id: editorId });
  }, [create, editorId]);
  return (
    <div className="p-8">
      <Link className="underline" to="/editors">
        Leave Editor
      </Link>
      <SyncEditorContainer editorId={editorId} />
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
