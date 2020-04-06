import React from "react";
import cls from "classnames";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ReactElement;
  active?: boolean;
}

const ToolbarItem: React.FC<Props> = ({
  label,
  icon,
  active = false,
  className,
  ...rest
}) => (
  <button
    className={cls(
      {
        "shadow text-gray-200 bg-blue-700": active,
      },
      "hover:bg-blue-900 hover:text-white",
      className
    )}
    {...rest}
  >
    {icon || label}
  </button>
);
export default ToolbarItem;
