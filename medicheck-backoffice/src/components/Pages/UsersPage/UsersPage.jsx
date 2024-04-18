import React, { useContext, useEffect, useRef, useState } from "react";

import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { MainTable } from "../../UI/MainTable";
import { PageLayout } from "../../UI/PayeLayout";
import { AddEntityModal } from "../../UI/AddEntityModal";
import { DeleteEntityModal } from "../../UI/DeleteEntityModal";
import { ModalButtons } from "../../UI/ModalButtons";
import { ModalInput } from "../../UI/ModalInput";
import { EditEntityModal } from "../../UI/EditEntityModal";
import { addUser, deleteUser, editUser, getUsers } from "../../../services/apiService";
import { ModalComboBox } from "../../UI/ModalComboBox";
import { useTranslation } from "react-i18next";
import LocaleContext from "../../../LocaleContext";

export const UsersPage = () => {
  const {t}= useTranslation();
  const {setCurrentPage} = useContext(LocaleContext)
  const AddEntityDialog = useRef();
  const DeleteEntityDialog = useRef();
  const EditEntityDialog = useRef();
  const initialState = {
    id: 0,
    Nombre: "",
    Apellidos: "",
    Rol: "",
    Correo: "",
    telefono: "",
    Clave:"",
    TipoDocumento:"",
    NoDocumento:"",
    
  };
  const [id, setId] = useState();
  const [tableData, setTableData] = useState();
  const [newUser, setNewUser] = useState(initialState);
  const [inputUsers, setInputUsers] = useState(initialState);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems,setTotalItems ] = useState(10);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    (async () => {
      setCurrentPage(t('sidebar.users'))
      const users = await getUsers(page+1, rowsPerPage, search, typeFilter == "Selecciona.."?"": typeFilter);
      setTotalItems(users.totalItems)
      setInputUsers(users.data)
      console.log(users);
      setTableData(
        users.data.map((user) => {
          return {
            id: user.idUsuario,
            Nombre: user.nombre,
            Apellidos: user.apellidos,
            Rol: user.rol,
            Correo: user.correo,
            telefono: user.telefono,
            TipoDocumento:user.tipoDocumento,
            NoDocumento:user.noDocumento,
            
          };
        })
      );
    })();
  }, [page, rowsPerPage, t, search, typeFilter]);

  async function handleSave() {
    const newData = { ...newUser };
    const response = await addUser(newData).then(
      setTableData((prevData) => [...prevData, {
        Nombre: newData.Nombre,
        Apellidos: newData.Apellidos,
        Rol: newData.Rol,
        Correo: newData.Correo,
        telefono: newData.telefono,
        Clave: newData.Clave,
        TipoDocumento:newData.TipoDocumento,
        NoDocumento:newData.NoDocumento
      }])
    );

    setNewUser(initialState);
  }
  function handleInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    setNewUser((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  // function handleUpdateInput(e) {
  //   const name = e.target.name;
  //   const value = e.target.value;
  //   setUpdateUser((prevValue) => {
  //     return { ...prevValue, [name]: value };
  //   });
  // }
  function handleOpenDeleteModal(id) {
    DeleteEntityDialog.current.showModal();
    setId(id);
  }

  async function handleDelete() {
    const response = await deleteUser(id).then(
      setTableData(tableData.filter((data) => data.id != id))
    );
  }

  function handleEdit(data) {
    console.log(data);
    EditEntityDialog.current.showModal();
    const currentUser = inputUsers.find(user => data.NoDocumento === user.noDocumento)
    setNewUser({...data, Clave: currentUser.clave });
  }

  async function handleUpdate() {
    const entityToUpdate = tableData.find((entity) => newUser.id === entity.id);
    console.log(entityToUpdate);
    await editUser(entityToUpdate.id, {...newUser
    }).then(setTableData(prevValue=> prevValue.map(user=> user.id === entityToUpdate.id? {Nombre: newUser.Nombre,
      Apellidos: newUser.Apellidos,
      Rol: newUser.Rol,
      Correo: newUser.Correo,
      telefono: newUser.telefono,
      TipoDocumento:newUser.TipoDocumento,
      NoDocumento:newUser.NoDocumento}:user)));
    console.log(newUser);

  }

  const handleNewPage = (e, newPage)=>{
    setPage(newPage)
  }

  const handlePageSize=(e)=>{
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }

  const handleSearch = (e)=> setSearch(e.target.value);
  const handleFilter = (e)=> setTypeFilter(e.target.value);

  return (
    <PageLayout
      pageMainTitle={t('usersPage.title')}
      pageMainbuttonDescription={t('usersPage.addButton')}
      pageMainbuttonIcon={<PersonAddAltOutlinedIcon />}
      onAdd={() => AddEntityDialog.current.showModal()}
      options={["Selecciona..","BACKOFFICE","ADMINISTRADOR","AFILIADO"]}
      handleSearch={handleSearch}
      handleFilter={handleFilter}
      filterValue={typeFilter}
    >
      <AddEntityModal ref={AddEntityDialog} title={t('usersPage.addButton')}>
        <ModalInput
          label={t('usersPage.tableHeaderName')}
          type={"text"}
          placeholder={t('usersPage.modalPlaceholderName')}
          onChange={handleInput}
          name={"Nombre"}
          value={newUser.Nombre}
        />
        <ModalInput
          label={t('usersPage.tableHeaderLastNames')}
          type={"text"}
          placeholder={t('usersPage.modalPlaceholderLastNames')}
          onChange={handleInput}
          name={"Apellidos"}
          value={newUser.Apellidos}
        />
        <ModalComboBox
          title={t('usersPage.tableHeaderRol')}
          options={["Selecciona..", "ADMINISTRADOR", "BACKOFFICE", "AFILIADO"]}
          value={newUser.Rol}
          name={"Rol"}
          onChange={handleInput}
        />
        <ModalInput
          label={t('usersPage.tableHeaderEmail')}
          type={"text"}
          placeholder={t('usersPage.modalPlaceholderEmail')}
          onChange={handleInput}
          name={"Correo"}
          value={newUser.Correo}
        />
        <ModalInput
          label={t('usersPage.tableHeaderPhone')}
          type={"text"}
          placeholder={t('usersPage.modalPlaceholderPhone')}
          onChange={handleInput}
          name={"telefono"}
          value={newUser.telefono}
        />
        <ModalInput
          label={t('usersPage.tableHeaderPassword')}
          type={"password"}
          placeholder={t('usersPage.modalPlaceholderPassword')}
          onChange={handleInput}
          name={"Clave"}
          value={newUser.Clave}
        />
          <ModalComboBox
          title={t('usersPage.tableHeaderDocumentType')}
          options={["Selecciona..", "CEDULA", "NSS", "CONTRATO"]}
          value={newUser.TipoDocumento}
          name={"TipoDocumento"}
          onChange={handleInput}
        />
        <ModalInput
          label={t('usersPage.tableHeaderDocumentNumber')}
          type={"text"}
          placeholder={t('usersPage.modalPlaceholderDocumentNumber')}
          onChange={handleInput}
          name={"NoDocumento"}
          value={newUser.NoDocumento}
        />
        <ModalButtons onSave={handleSave} action={t('modalButton.save')} />
      </AddEntityModal>
      <DeleteEntityModal ref={DeleteEntityDialog} onDelete={handleDelete} />
      <EditEntityModal ref={EditEntityDialog} title={t('usersPage.editButton')}>
      <ModalInput
          label={t('usersPage.tableHeaderName')}
          type={"text"}
          placeholder={t('usersPage.modalPlaceholderName')}
          onChange={handleInput}
          name={"Nombre"}
          value={newUser.Nombre}
        />
        <ModalInput
          label={t('usersPage.tableHeaderLastNames')}
          type={"text"}
          placeholder={t('usersPage.modalPlaceholderLastNames')}
          onChange={handleInput}
          name={"Apellidos"}
          value={newUser.Apellidos}
        />
        <ModalComboBox
          title={t('usersPage.tableHeaderRol')}
          options={["Selecciona..", "ADMINISTRADOR", "BACKOFFICE", "AFILIADO"]}
          value={newUser.Rol}
          name={"Rol"}
          onChange={handleInput}
        />
        <ModalInput
          label={t('usersPage.tableHeaderEmail')}
          type={"text"}
          placeholder={t('usersPage.modalPlaceholderEmail')}
          onChange={handleInput}
          name={"Correo"}
          value={newUser.Correo}
        />
        <ModalInput
          label={t('usersPage.tableHeaderPhone')}
          type={"text"}
          placeholder={t('usersPage.modalPlaceholderPhone')}
          onChange={handleInput}
          name={"telefono"}
          value={newUser.telefono}
        />
        <ModalInput
          label={t('usersPage.tableHeaderPassword')}
          type={"password"}
          placeholder={t('usersPage.modalPlaceholderPassword')}
          onChange={handleInput}
          name={"Clave"}
          value={newUser.Clave}
        />
          <ModalComboBox
          title={t('usersPage.tableHeaderDocumentType')}
          options={["Selecciona..", "CEDULA", "NSS", "CONTRATO"]}
          value={newUser.TipoDocumento}
          name={"TipoDocumento"}
          onChange={handleInput}
        />
        <ModalInput
          label={t('usersPage.tableHeaderDocumentNumber')}
          type={"text"}
          placeholder={t('usersPage.modalPlaceholderDocumentNumber')}
          onChange={handleInput}
          name={"NoDocumento"}
          value={newUser.NoDocumento}
        />
        <ModalButtons onSave={handleUpdate} action={t('modalButton.edit')} />
      </EditEntityModal>
      <MainTable
        headers={[
          t('usersPage.tableHeaderName'),
          t('usersPage.tableHeaderLastNames'),
          t('usersPage.tableHeaderRol'),
          t('usersPage.tableHeaderEmail'),
          t('usersPage.tableHeaderPhone'),
          t('usersPage.tableHeaderDocumentType'),
          t('usersPage.tableHeaderDocumentNumber'),
          t('usersPage.tableHeaderActions'),
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
