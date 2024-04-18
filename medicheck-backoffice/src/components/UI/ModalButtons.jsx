import React from "react";
import { useTranslation } from "react-i18next";

export const ModalButtons = ({ onSave, action }) => {
  const {t} = useTranslation();
  return (
    <div className="flex justify-end gap-8">
      <button className="w-[170px] p-2 rounded-md h-[70px] border border-black">
       {t('modalButton.cancel')}
      </button>
      <button
        className="w-[170px] p-2 rounded-md h-[70px] bg-[#1C222A] text-white"
        onClick={onSave}
      >
        {action}
      </button>
    </div>
  );
};
