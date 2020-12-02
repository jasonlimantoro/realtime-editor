import React from "react";
import { IDraft } from "src/modules/draft/models/draft.model";
import { Link } from "react-router-dom";
import moment from "moment";
import { observer } from "mobx-react";
import { confirmedAction } from "src/lib/utils";

interface EditorCardProps {
  draft: IDraft;
}

const EditorCard: React.FC<EditorCardProps> = ({ draft }) => {
  return (
    <div className="rounded shadow-md">
      <div className="px-6 py-4 flex-col">
        <div className="flex items-center justify-between">
          <Link
            className="text-gray-700 font-bold text-xl"
            to={`/editor/${draft._id}`}
          >
            {draft.title}
          </Link>
          <button
            className="btn btn-red"
            onClick={confirmedAction(draft.remove)}
          >
            Delete
          </button>
        </div>
        <div className="text-base text-gray-800">
          <p>Created at: {moment(Number(draft._id)).calendar()}</p>
          <p>Updated at: {moment(draft.updatedAt).calendar()}</p>
        </div>
      </div>
    </div>
  );
};

export default observer(EditorCard);
