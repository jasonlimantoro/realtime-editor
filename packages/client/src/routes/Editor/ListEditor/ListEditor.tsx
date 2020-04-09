import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AppState } from "src/modules/types";
import { logout } from "src/modules/auth/action";
import { selectLoggedInUser } from "src/modules/auth/selector";
import { useMst } from "src/modules/root";
import { IDraft } from "src/modules/draft/models/Draft.model";
import { observer } from "mobx-react";
import EditorCard from "./EditorCard";

interface ListEditorProps {}

type Props = ListEditorProps & LinkMapDispatchProps & LinkMapStateProps;

const ListEditor: React.FC<Props> = ({ logout, username }) => {
  const {
    drafts: { fetchDrafts, draftsByDate, draftscount },
  } = useMst();
  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  return (
    <div className="px-6">
      <h2 className="text-3xl">Welcome {username}!</h2>
      <h2 className="text-xl">Total Drafts ({draftscount})</h2>
      <Link className="inline-block btn btn-gray" to="/editor">
        Add new draft
      </Link>
      <button className="btn" onClick={() => logout()}>
        Logout
      </button>
      {Object.keys(draftsByDate).map((k) => {
        const value = draftsByDate[k];
        return (
          <div key={k} className="mt-4">
            <p className="text-2xl">{k}</p>
            <div className="grid grid-cols-3 gap-4">
              {value.map((d: IDraft) => (
                <EditorCard key={d._id} draft={d} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface LinkMapStateProps {
  username: string;
}

interface LinkMapDispatchProps {
  logout: () => void;
}

const mapStateToProps = (state: AppState): LinkMapStateProps => ({
  username: selectLoggedInUser(state),
});

const mapDispatchToProps: LinkMapDispatchProps = {
  logout,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(observer(ListEditor));
