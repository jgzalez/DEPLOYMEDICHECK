import React from "react";

export const ModalInput = ({ label, ...props }) => {
  return (
    <label className="my-2">
      {label}
      <input
        className="w-full h-14 border rounded-sm p-2 mt-2 border-[#D9D9D9]"
        {...props}
      />
    </label>
  );
};
