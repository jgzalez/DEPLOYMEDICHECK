import React from "react";
import { Link } from "react-router-dom";

export const SidebarItem = ({ children, title, path }) => {
  return (
    <Link to={path}>
      <div className="text-white flex items-center gap-3 py-4 pl-8  hover:bg-grey-hover rounded-lg">
        {children}
        <p>{title}</p>
      </div>
    </Link>
  );
};
