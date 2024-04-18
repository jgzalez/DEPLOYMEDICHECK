import React, { forwardRef } from "react";

export const AddEntityModal = forwardRef(function AddEntityModal(
  { title, children },
  ref
) {
  return (
    <dialog className="w-[600px] h-[800px] rounded-md z-50 " ref={ref}>
      <div className="w-full h-[10%] bg-[#1C222A] text-white p-8">
        <h2>{title}</h2>
      </div>
      <form method="dialog" className="flex flex-col p-8 ">
        {children}
      </form>
    </dialog>
  );
});
