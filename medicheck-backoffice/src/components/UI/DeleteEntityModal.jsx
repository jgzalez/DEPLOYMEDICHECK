import React, { forwardRef } from "react";
import closeImg from "../../assets/CloseWindow.png";
import { useTranslation } from "react-i18next";
export const DeleteEntityModal = forwardRef(function DeleteEntityModal(
  { onDelete },
  ref
) {
  const {t}= useTranslation();
  return (
    <dialog ref={ref} className="w-[500px] h-fit rounded-md   p-8 text-center ">
      <div className="flex flex-col items-center gap-8">
        <img src={closeImg} className="w-[110px] h-[110px]" />
        <h1 className="text-3xl"> {t('modalButton.deleteTitle') }</h1>
        <p>
         {t('modalButton.deleteDescripcion') }
        </p>
        <form method="dialog" className="flex gap-4">
          <button className=" border border-black rounded-sm p-4 w-32">
           {t('modalButton.cancel')}
          </button>
          <button
            className="bg-[#1C222A] border border-black rounded-sm p-4 w-32 text-white"
            onClick={onDelete}
          >
              {t('modalButton.delete')}
          </button>
        </form>
      </div>
    </dialog>
  );
});
