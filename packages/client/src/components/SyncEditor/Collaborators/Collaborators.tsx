import React from "react";
import { observer } from "mobx-react";

interface CollaboratorsProps {
  collaborators: string[];
}

const Collaborators: React.FC<CollaboratorsProps> = ({ collaborators }) => {
  return (
    <div>
      <p className="text-xl">
        Collaborators: You{" "}
        {collaborators && collaborators.length ? (
          <span>and {collaborators.length} others</span>
        ) : (
          <span>only</span>
        )}
      </p>
      <ol className="list-decimal">
        {collaborators &&
          collaborators.map((c, idx) => (
            <li key={idx} className="list-inside">
              {c} <span className="italic text-gray-700">is collaborating</span>
            </li>
          ))}
      </ol>
    </div>
  );
};

export default observer(Collaborators);
