import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { DraftSchema } from "src/lib/entities/draft";
import { ellipsis } from "src/lib/utils";

interface Props {}

const ListEditor: React.FC<Props> = () => {
  const [editors, setEditors] = useState<DraftSchema[]>([]);
  useEffect(() => {
    fetch("http://localhost:4000/editors")
      .then((r) => r.json())
      .then((e) => {
        setEditors(e);
      });
  }, []);
  const handleDelete = (id: string) => {
    setEditors((e) => e.filter(({ _id }) => _id !== id));
    fetch(`http://localhost:4000/editor/${id}`, { method: "delete" });
  };
  return (
    <div>
      <h2 className="text-2xl">List Editor ({editors.length})</h2>
      <Link className="inline-block btn btn-gray" to="/editor">
        Add new editor
      </Link>
      <ul className="mt-4">
        {editors.map((e: DraftSchema) => (
          <li key={e._id}>
            <div className="flex">
              <Link className="underline" to={`/editor/${e._id}`}>
                {ellipsis(e.title)}
              </Link>
              <p className="ml-4">
                created at {moment(Number(e._id)).format("YYYY-MM-DD hh:mm")}
              </p>
              <button className="ml-4" onClick={() => handleDelete(e._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListEditor;
