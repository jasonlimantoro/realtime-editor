import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { DraftSchema } from "src/lib/entities/draft";
import { AppState } from "src/modules/types";
import { logout } from "src/modules/auth/action";
import { crud } from "src/modules/draft/action";
import { selectLoggedInUser } from "src/modules/auth/selector";
import {
  selectDraftByDate,
  selectDraftCount,
} from "src/modules/draft/selector";

interface ListEditorProps {}

type Props = ListEditorProps & LinkMapDispatchProps & LinkMapStateProps;

const ListEditor: React.FC<Props> = ({
  logout,
  username,
  list,
  editors,
  draftCount,
  remove,
}) => {
  useEffect(() => {
    list();
  }, [list]);
  const handleDelete = (id: string) => {
    // eslint-disable-next-line no-restricted-globals,no-alert
    if (!confirm("Are you sure you want to delete this?")) return;
    remove(id);
  };

  return (
    <div className="px-6">
      <h2 className="text-3xl">Welcome {username}!</h2>
      <h2 className="text-xl">Total Drafts ({draftCount})</h2>
      <Link className="inline-block btn btn-gray" to="/editor">
        Add new draft
      </Link>
      <button className="btn" onClick={() => logout()}>
        Logout
      </button>
      {Object.keys(editors).map((k) => {
        const value = editors[k];
        return (
          <div key={k} className="mt-4">
            <p className="text-2xl">{k}</p>
            <div className="grid grid-cols-3 gap-4">
              {value.map((v: DraftSchema) => (
                <div key={v._id} className="rounded shadow-lg">
                  <div className="px-6 py-4 flex-col">
                    <Link
                      className="text-gray-700 font-bold text-xl"
                      to={`/editor/${v._id}`}
                    >
                      {v.title}
                    </Link>
                    <div className="text-base text-gray-800">
                      <p>created at {moment(Number(v._id)).format("HH:mm")}</p>
                      <p>updated at {moment(v.updatedAt).calendar()}</p>
                    </div>
                    <button
                      className="btn btn-red"
                      onClick={() => handleDelete(v._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
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
  editors: any;
  draftCount: number;
}

interface LinkMapDispatchProps {
  logout: () => void;
  list: () => void;
  remove: (id: string) => void;
}

const mapStateToProps = (state: AppState): LinkMapStateProps => ({
  username: selectLoggedInUser(state),
  editors: selectDraftByDate(state),
  draftCount: selectDraftCount(state),
});

const mapDispatchToProps: LinkMapDispatchProps = {
  logout,
  list: crud.list,
  remove: crud.remove,
};
export default connect(mapStateToProps, mapDispatchToProps)(ListEditor);
