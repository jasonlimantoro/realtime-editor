import React from "react";
import { IDraft } from "src/modules/draft/models/Draft.model";
import { Link } from "react-router-dom";
import moment from "moment";
import { observer } from "mobx-react";
import { confirmedAction } from "src/lib/utils";

interface EditorCardProps {
  draft: IDraft;
}

const EditorCard: React.FC<EditorCardProps> = ({ draft }) => {
  return (
    <div className="rounded shadow-lg">
      <div className="px-6 py-4 flex-col">
        <Link
          className="text-gray-700 font-bold text-xl"
          to={`/editor/${draft._id}`}
        >
          {draft.title}
        </Link>
        <div className="text-base text-gray-800">
          <p>created at {moment(Number(draft._id)).format("HH:mm")}</p>
          <p>updated at {moment(draft.updatedAt).calendar()}</p>
        </div>
        <button className="btn btn-red" onClick={confirmedAction(draft.remove)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default observer(EditorCard);
