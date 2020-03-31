import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { DraftSchema } from "src/lib/entities/draft";
import { ellipsis } from "src/lib/utils";
import { serviceRegistry } from "src/lib/services/registry";

interface Props {}

const service = serviceRegistry.draft;

const ListEditor: React.FC<Props> = () => {
  const [editors, setEditors] = useState<DraftSchema[]>([]);
  useEffect(() => {
    service.list().then(({ data }) => {
      setEditors(data);
    });
  }, []);
  const handleDelete = (id: string) => {
    setEditors((e) => e.filter(({ _id }) => _id !== id));
    service.destroy(id);
  };
  const groupByDate = useMemo(() => {
    const grouped = editors.reduce((accum: any, current) => {
      const day = moment(Number(current._id)).format("YYYY-MM-DD");
      return {
        ...accum,
        [day]: accum[day]?.length > 0 ? accum[day].concat(current) : [current],
      };
    }, {});
    return grouped;
  }, [editors]);
  return (
    <div>
      <h2 className="text-2xl">List Editor ({editors.length})</h2>
      <Link className="inline-block btn btn-gray" to="/editor">
        Add new editor
      </Link>
      {Object.keys(groupByDate).map((k) => {
        const value = groupByDate[k];
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
                    <button
                      className="ml-4"
                      onClick={() => handleDelete(v._id)}
                    >
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

export default ListEditor;
