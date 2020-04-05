import React, { useEffect } from "react";
import { connect } from "react-redux";
import SyncEditor from "src/components/SyncEditor";
import { useParams, Link } from "react-router-dom";
import { AppState } from "src/modules/types";
import { create } from "src/modules/draft/action";

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
      <SyncEditor className="p-8 bg-gray-200" editorId={editorId} />
    </div>
  );
};

interface LinkMapStateProps {}

interface LinkMapDispatchProps {
  create: (body: any) => void;
}

const mapStateToProps = (_state: AppState): LinkMapStateProps => ({});

const mapDispatchToProps: LinkMapDispatchProps = {
  create,
};
export default connect(mapStateToProps, mapDispatchToProps)(Editor);
