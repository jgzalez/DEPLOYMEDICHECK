import React, { useContext, useEffect, useRef, useState } from "react";

import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { MainTable } from "../../UI/MainTable";

import { PageLayout } from "../../UI/PayeLayout";
import { AddEntityModal } from "../../UI/AddEntityModal";
import { ModalInput } from "../../UI/ModalInput";
import { DeleteEntityModal } from "../../UI/DeleteEntityModal";
import { ModalButtons } from "../../UI/ModalButtons";
import {
  addInsurance,
  deleteInsurances,
  editInsurances,
  getInsurances,
  getProducts,
} from "../../../services/apiService";
import { EditEntityModal } from "../../UI/EditEntityModal";
import { useTranslation } from "react-i18next";
import LocaleContext from "../../../LocaleContext";
import Alert from '@mui/material/Alert';

export const InsurancePage = () => {
  const {t} = useTranslation();
  const {setCurrentPage}= useContext(LocaleContext)
  const AddEntityDialog = useRef();
  const EditEntityDialog = useRef();
  const DeleteEntityDialog = useRef();
  const [id, setId] = useState();
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems,setTotalItems ] = useState(10);
  const [search, setSearch]= useState("");

  const initialState = {
    id: 0,
    Nombre: "",
    Direccion: "",
    Correo: "",
    Telefono: "",
    sitioWeb: "",
  };
  const [newinsurance, setNewInsurance] = useState(initialState);

  useEffect(() => {
    
    (async () => {
      try {
        setCurrentPage(t('sidebar.insurances'))
        const insurances = await getInsurances(page+1, rowsPerPage, search);
        setTotalItems(insurances.totalItems);
        console.log(insurances);
        
        setTableData(
          insurances.data.map((insurance) => {
            return {
              id: insurance.idAseguradora,
              Nombre: insurance.nombre,
              Direccion: insurance.direccion,
              Correo: insurance.correo,
              Telefono: insurance.telefono,
              sitioWeb: insurance.sitioWeb,
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, [page, rowsPerPage, t, search]);

  async function handleSave() {
    const newData = { ...newinsurance };
    console.log(newData);
    await addInsurance(newData).then(
      setTableData((prevData) => {
        return [...prevData, newData];
      })
    );

    setNewInsurance(initialState);
  }

  function handleInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    setNewInsurance((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }
  function handleOpenDeleteModal(id) {
    DeleteEntityDialog.current.showModal();
    setId(id);
  }

  async function handleDelete() {
    const response = await deleteInsurances(id).then(
      setTableData(tableData.filter((data) => data.id != id))
    );
  }
  function handleEdit(data) {
    EditEntityDialog.current.showModal();
    setNewInsurance(data);
  }

  async function handleUpdate() {
    const entityToUpdate = tableData.find(
      (entity) => newinsurance.id === entity.id
    );
    console.log(entityToUpdate);
    const updatedInsurance = await editInsurances(entityToUpdate.id, {
      ...newinsurance,
    }).then(
      setTableData((prevValue) =>
        prevValue.map((insurance) =>
          insurance.id === entityToUpdate.id ? { ...newinsurance } : insurance
        )
      )
    );
    console.log(updatedInsurance);
  }

  const handleNewPage = (e, newPage)=>{
    setPage(newPage)
  }

  const handlePageSize=(e)=>{
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }

  const handleSearch=(e)=>{
    setSearch(e.target.value);
  }

  return (
    <PageLayout
      pageMainTitle={t('insurancePage.title')}
      pageMainbuttonDescription={t('insurancePage.addButton')}
      pageMainbuttonIcon={
        <VerifiedOutlinedIcon className="!text-base md:!text-xl" />
      }
      onAdd={() => AddEntityDialog.current.showModal()}
      handleSearch={handleSearch}
    >
      <AddEntityModal title={t('insurancePage.addButton')} ref={AddEntityDialog}>
        <ModalInput
          label={t('insurancePage.tableHeaderName')}
          type={"text"}
          placeholder={t('insurancePage.modalPlaceholderName')}
          onChange={handleInput}
          name={"Nombre"}
          value={newinsurance.Nombre}
        />
        <ModalInput
          label={t('insurancePage.tableHeaderAddress')}
          type={"text"}
          placeholder={t('insurancePage.modalPlaceholderAddress')}
          onChange={handleInput}
          name={"Direccion"}
          value={newinsurance.Direccion}
        />
        <ModalInput
          label={t('insurancePage.tableHeaderEmail')}
          type={"email"}
          placeholder={t('insurancePage.modalPlaceholderEmail')}
          onChange={handleInput}
          name={"Correo"}
          value={newinsurance.Correo}
        />
        <ModalInput
          label={t('insurancePage.tableHeaderPhone')}
          type={"text"}
          placeholder={t('insurancePage.modalPlaceholderPhone')}
          onChange={handleInput}
          name={"Telefono"}
          value={newinsurance.Telefono}
        />
        <ModalInput
          label={t('insurancePage.tableHeaderUrl')}
          type={"text"}
          placeholder={t('insurancePage.modalPlaceholderUrl')}
          onChange={handleInput}
          name={"sitioWeb"}
          value={newinsurance.sitioWeb}
        />
        <ModalButtons onSave={handleSave} action={t('modalButton.save')} />
      </AddEntityModal>
      <EditEntityModal ref={EditEntityDialog} title={t('insurancePage.editButton')}>
      <ModalInput
          label={t('insurancePage.tableHeaderName')}
          type={"text"}
          placeholder={t('insurancePage.modalPlaceholderName')}
          onChange={handleInput}
          name={"Nombre"}
          value={newinsurance.Nombre}
        />
        <ModalInput
          label={t('insurancePage.tableHeaderAddress')}
          type={"text"}
          placeholder={t('insurancePage.modalPlaceholderAddress')}
          onChange={handleInput}
          name={"Direccion"}
          value={newinsurance.Direccion}
        />
        <ModalInput
          label={t('insurancePage.tableHeaderEmail')}
          type={"email"}
          placeholder={t('insurancePage.modalPlaceholderEmail')}
          onChange={handleInput}
          name={"Correo"}
          value={newinsurance.Correo}
        />
        <ModalInput
          label={t('insurancePage.tableHeaderPhone')}
          type={"text"}
          placeholder={t('insurancePage.modalPlaceholderPhone')}
          onChange={handleInput}
          name={"Telefono"}
          value={newinsurance.Telefono}
        />
        <ModalInput
          label={t('insurancePage.tableHeaderUrl')}
          type={"text"}
          placeholder={t('insurancePage.modalPlaceholderUrl')}
          onChange={handleInput}
          name={"sitioWeb"}
          value={newinsurance.sitioWeb}
        />
        <ModalButtons onSave={handleUpdate} action={t('modalButton.edit')} />
      </EditEntityModal>
      <DeleteEntityModal ref={DeleteEntityDialog} onDelete={handleDelete} />
      <MainTable
        headers={[
          t('insurancePage.tableHeaderName'),
          t('insurancePage.tableHeaderAddress'),
          t('insurancePage.tableHeaderEmail'),
          t('insurancePage.tableHeaderPhone'),
          t('insurancePage.tableHeaderUrl'),
          t('insurancePage.tableHeaderActions'),
        ]}
        mainData={tableData}
        onDelete={handleOpenDeleteModal}
        onEdit={handleEdit}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangeRowsPerPage={handlePageSize}
        handlePageChange={handleNewPage}
        totalRows={totalItems}
      />
    </PageLayout>
  );
};
