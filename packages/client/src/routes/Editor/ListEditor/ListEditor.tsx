import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { DraftSchema } from "src/lib/entities/draft";
import { ellipsis } from "src/lib/utils";
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
  return (
    <div>
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
            <ul>
              {value.map((v: DraftSchema) => (
                <li key={v._id}>
                  <div className="flex">
                    <Link className="underline" to={`/editor/${v._id}`}>
                      {ellipsis(v.title)}
                    </Link>
                    <p className="ml-4">
                      created at {moment(Number(v._id)).format("HH:mm")}
                    </p>
                    <p className="ml-4">
                      last updated at {moment(v.updatedAt).calendar()}
                    </p>
                    <button className="ml-4" onClick={() => remove(v._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
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
