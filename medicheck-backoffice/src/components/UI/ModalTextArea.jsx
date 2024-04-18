import React from "react";

export const ModalTextArea = ({ label, ...props }) => {
  return (
    <label>
      {label}
      <textarea
        className="w-full h-14 border rounded-sm p-2 mt-2 border-[#D9D9D9]"
        {...props}
      ></textarea>
    </label>
  );
};
