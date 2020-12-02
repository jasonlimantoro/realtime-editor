import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useMst } from "src/modules/root";
import { IDraft } from "src/modules/draft/models/draft.model";
import {
  selectLogout,
  selectUsername,
  useComposeAuth,
} from "src/modules/auth/hooks";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import EditorCard from "./EditorCard";

interface Props {}

const ListEditor: React.FC<Props> = () => {
  const {
    drafts: { fetchDrafts, draftsByDate, draftscount },
    setSearch,
    search,
  } = useMst();
  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const [username, logout] = useComposeAuth(selectUsername, selectLogout);

  return (
    <div className="py-12 px-12">
      <div className="flex justify-between mb-8">
        <h2 className="text-3xl text-gray-800">
          Welcome <b>{username}</b>!
        </h2>
        <button
          className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
      <div className="flex items-center">
        <h2 className="text-xl text-gray-800">Total Drafts: {draftscount}</h2>
        <Link
          className="relative ml-8 inline-block btn btn-indigo"
          to="/editor"
        >
          <div className="grid grid-cols-2 gap-2 items-center">
            <span>
              <FontAwesomeIcon size="lg" className="" icon={faPlus} />
            </span>
            New
          </div>
        </Link>
      </div>
      <div className="mt-4 w-full">
        <label className="block text-gray-700 font-bold mb-2">Search</label>

        <input
          placeholder="Search anything"
          className="shadow appearance-none rounded border w-full px-4 py-3 focus:outline-none"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {draftscount > 0 ? (
        Object.keys(draftsByDate).map((k) => {
          const value = draftsByDate[k];
          return (
            <div key={k} className="mt-4">
              <p className="text-2xl text-gray-800">{k}</p>
              <div className="grid grid-cols-3 gap-4">
                {value.map((d: IDraft) => (
                  <EditorCard key={d._id} draft={d} />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-gray-700">No matching draft</div>
      )}
    </div>
  );
};

export default observer(ListEditor);
