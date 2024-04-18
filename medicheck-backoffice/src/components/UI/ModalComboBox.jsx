import React from "react";

export const ModalComboBox = ({ title, options, ...props }) => {
  return (
    <label>
      {title}
      <select
        {...props}
        className="w-full h-14 border rounded-sm p-2 mt-2 border-[#D9D9D9]"
      >
        {options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </label>
  );
};
