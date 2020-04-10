import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useMst } from "src/modules/root";
import { IDraft } from "src/modules/draft/models/draft.model";
import { observer } from "mobx-react";
import EditorCard from "./EditorCard";

interface Props {}

const ListEditor: React.FC<Props> = () => {
  const {
    drafts: { fetchDrafts, draftsByDate, draftscount },
    auth: { logout, username },
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

export default observer(ListEditor);
