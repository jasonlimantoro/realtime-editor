import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Props {}

interface Draft {
  _id: string;
}

const ListEditor: React.FC<Props> = () => {
  const [editors, setEditors] = useState<Draft[]>([]);
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
        {editors.map((e: Draft) => (
          <li key={e._id}>
            <div className="flex">
              <Link className="underline" to={`/editor/${e._id}`}>
                {e._id}
              </Link>
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
