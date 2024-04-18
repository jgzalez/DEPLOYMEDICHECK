import React, { useContext, useEffect, useRef, useState } from "react";

import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import { MainTable } from "../../UI/MainTable";

import { PageLayout } from "../../UI/PayeLayout";
import { AddEntityModal } from "../../UI/AddEntityModal";
import { DeleteEntityModal } from "../../UI/DeleteEntityModal";
import { ModalInput } from "../../UI/ModalInput";
import { ModalButtons } from "../../UI/ModalButtons";
import { ModalComboBox } from "../../UI/ModalComboBox";
import {
  addEstablishment,
  deleteEstablishment,
  editEstablishment,
  getEstablishment,
  getEstablishmentById
} from "../../../services/apiService";
import { EditEntityModal } from "../../UI/EditEntityModal";
import { useTranslation } from "react-i18next";
import LocaleContext from "../../../LocaleContext";
import { LocationMap } from "../../UI/LocationMap";
export const EstablishmentPage = () => {
  const { t } = useTranslation();
  const { setCurrentPage } = useContext(LocaleContext);
  const AddEntityDialog = useRef();
  const EditEntityDialog = useRef();
  const DeleteEntityDialog = useRef();
  const initialState = {
    id: 0,
    Nombre: "",
    Categoria: "",
    Direccion: "",
    Correo: "",
    Telefono: "",
    Latitud: null,
    Longitud: null,
    GooglePlaceId: "",
  };
  const [id, setId] = useState();
  const [tableData, setTableData] = useState([]);
  const [newEstablishment, setNewEstablishment] = useState(initialState);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(10);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Selecciona..");
  const [location, setLocation] = useState(null);
  const [defaultLocation, setDefaultLocation] = useState(null);

  useEffect(() => {
    (async () => {
      setCurrentPage(t("sidebar.establishments"));
      const establishments = await getEstablishment(
        page + 1,
        rowsPerPage,
        search,
        typeFilter == "Selecciona.." ? "" : typeFilter
      );
      setTotalItems(establishments.totalItems);
      console.log(establishments);
      setTableData(
        establishments.data.map((establishment) => {
          return {
            id: establishment.establecimiento.idEstablecimiento,
            Nombre: establishment.establecimiento.nombre,
            Categoria: establishment.establecimiento.categoria,
            Direccion: establishment.establecimiento.direccion,
            Correo:
              establishment.establecimiento.correo == null
                ? "N/A"
                : establishment.establecimiento.correo,
            Telefono: establishment.establecimiento.telefono,
            // Latitud: establishment.establecimiento.latitud,
            // Longitud: establishment.establecimiento.longitud,
          };
        })
      );
    })();
  }, [page, rowsPerPage, t, search, typeFilter]);

  async function handleSave() {
    const newData = {
      ...newEstablishment,
      Latitud: location.lat,
      Longitud: location.lng,
      GooglePlaceId: location.place_id
    };
    const response = await addEstablishment(newData).then(
      setTableData((prevData) => [...prevData, {
            Nombre: newData.Nombre,
            Categoria: newData.Categoria,
            Direccion: newData.Direccion,
            Correo: newData.Correo,
            Telefono: newData.Correo,
      }])
    );
  }
  function handleInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    setNewEstablishment((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }
  async function handleEdit(data) {
    EditEntityDialog.current.showModal();
    console.log(data);
    const establishmentFound = await getEstablishmentById(data.id)
    setLocation({lat:establishmentFound.latitud, lng:establishmentFound.longitud, GooglePlaceId:establishmentFound.googlePlaceId, Direccion: establishmentFound.address})
    setNewEstablishment(data);
  }
  function handleOpenDeleteModal(id) {
    DeleteEntityDialog.current.showModal();
    setId(id);
  }
  async function handleUpdate() {
    const entityToUpdate = tableData.find(
      (entity) => newEstablishment.id === entity.id
    );
   console.log( { ...newEstablishment,Latitud:location.lat, Longitud:location.lng, GooglePlaceId: location.place_id, Direccion:location.address})
   const updatedEstablishment = await editEstablishment(entityToUpdate.id, { ...newEstablishment,Latitud:location.lat, Longitud:location.lng,GooglePlaceId: location.place_id, Direccion:location.address}).then(
      setTableData((prevValue) =>
        prevValue.map((establishment) =>
          establishment.id === entityToUpdate.id
            ? {
                id: newEstablishment.idEstablecimiento,
                Nombre: newEstablishment.Nombre,
                Categoria: newEstablishment.Categoria,
                Direccion: location.address|| newEstablishment.Direccion,
                Correo: newEstablishment.Correo,
                Telefono: newEstablishment.Telefono,
              }
            : establishment
        )
      )
    );

    console.log(updatedEstablishment);
  }

  async function handleDelete() {
    const response = await deleteEstablishment(id).then(
      setTableData(tableData.filter((data) => data.id != id))
    );
  }

  const handleNewPage = (e, newPage) => {
    setPage(newPage);
  };

  const handlePageSize = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => setTypeFilter(e.target.value);

  const handleLocation = (location) => setLocation(location);

  return (
    <PageLayout
      pageMainTitle={t("establishmentsPage.title")}
      pageMainbuttonDescription={t("establishmentsPage.addButton")}
      pageMainbuttonIcon={<AddLocationAltOutlinedIcon />}
      onAdd={() => AddEntityDialog.current.showModal()}
      handleSearch={handleSearch}
      options={["Selecciona..", "LABORATORIO", "CENTRO_MEDICO", "FARMACIA"]}
      handleFilter={handleFilter}
      filterValue={typeFilter}
    >
      <AddEntityModal
        ref={AddEntityDialog}
        title={t("establishmentsPage.addButton")}
      >
        <ModalInput
          label={t("establishmentsPage.tableHeaderName")}
          type={"text"}
          placeholder={t("establishmentsPage.modalPlaceholderName")}
          onChange={handleInput}
          name={"Nombre"}
          value={newEstablishment.Nombre}
        />
        <ModalComboBox
          title={t("establishmentsPage.tableHeaderCategory")}
          options={["Selecciona..", "LABORATORIO", "CENTRO_MEDICO", "FARMACIA"]}
          value={newEstablishment.Categoria}
          name={"Categoria"}
          onChange={handleInput}
        />
        <ModalInput
          label={t("establishmentsPage.tableHeaderAddress")}
          type={"text"}
          placeholder={t("establishmentsPage.modalPlaceholderAddress")}
          onChange={handleInput}
          name={"Direccion"}
          value={newEstablishment.Direccion}
        />
        <ModalInput
          label={t("establishmentsPage.tableHeaderEmail")}
          type={"text"}
          placeholder={t("establishmentsPage.modalPlaceholderEmail")}
          onChange={handleInput}
          name={"Correo"}
          value={newEstablishment.Correo}
        />
        <ModalInput
          label={t("establishmentsPage.tableHeaderPhone")}
          type={"text"}
          placeholder={t("establishmentsPage.modalPlaceholderPhone")}
          onChange={handleInput}
          name={"Telefono"}
          value={newEstablishment.Telefono}
        />
        <LocationMap onLocation={handleLocation} />
        {/* <ModalInput
          label={t("establishmentsPage.tableHeaderLatitude")}
          type={"text"}
          placeholder={t("establishmentsPage.modalPlaceholderLatitude")}
          onChange={handleInput}
          name={"Latitud"}
          value={newEstablishment.Latitud}
        />
        <ModalInput
          label={t("establishmentsPage.tableHeaderLongitude")}
          type={"text"}
          placeholder={t("establishmentsPage.modalPlaceholderLongitude")}
          onChange={handleInput}
          name={"Longitud"}
          value={newEstablishment.Longitud}
        /> */}
        {/* <ModalInput
          label={t("establishmentsPage.tableHeaderGooglePlace")}
          type={"text"}
          onChange={handleInput}
          name={"GooglePlaceId"}
          value={newEstablishment.GooglePlaceId}
        /> */}
        <ModalButtons onSave={handleSave} action={t("modalButton.save")} />
      </AddEntityModal>
      <EditEntityModal
        ref={EditEntityDialog}
        title={t("establishmentsPage.editButton")}
      >
        <ModalInput
          label={t("establishmentsPage.tableHeaderName")}
          type={"text"}
          placeholder={t("establishmentsPage.modalPlaceholderName")}
          onChange={handleInput}
          name={"Nombre"}
          value={newEstablishment.Nombre}
        />
        <ModalComboBox
          title={t("establishmentsPage.tableHeaderCategory")}
          options={["Selecciona..", "LABORATORIO", "CENTRO_MEDICO", "FARMACIA"]}
          value={newEstablishment.Categoria}
          name={"Categoria"}
          onChange={handleInput}
        />
        <ModalInput
          label={t("establishmentsPage.tableHeaderAddress")}
          type={"text"}
          placeholder={t("establishmentsPage.modalPlaceholderAddress")}
          onChange={handleInput}
          name={"Direccion"}
          value={newEstablishment.Direccion}
        />
        <ModalInput
          label={t("establishmentsPage.tableHeaderEmail")}
          type={"text"}
          placeholder={t("establishmentsPage.modalPlaceholderEmail")}
          onChange={handleInput}
          name={"Correo"}
          value={newEstablishment.Correo}
        />
        <ModalInput
          label={t("establishmentsPage.tableHeaderPhone")}
          type={"text"}
          placeholder={t("establishmentsPage.modalPlaceholderPhone")}
          onChange={handleInput}
          name={"Telefono"}
          value={newEstablishment.Telefono}
        />
        <LocationMap onLocation={handleLocation} defaultLocation={location} />
        {/* <ModalInput
          label={t("establishmentsPage.tableHeaderLatitude")}
          type={"text"}
          placeholder={t("establishmentsPage.modalPlaceholderLatitude")}
          onChange={handleInput}
          name={"Latitud"}
          value={newEstablishment.Latitud}
        />
        <ModalInput
          label={t("establishmentsPage.tableHeaderLongitude")}
          type={"text"}
          placeholder={t("establishmentsPage.modalPlaceholderLongitude")}
          onChange={handleInput}
          name={"Longitud"}
          value={newEstablishment.Longitud}
        /> */}
        {/* <ModalInput
          label={t("establishmentsPage.tableHeaderGooglePlace")}
          type={"text"}
          onChange={handleInput}
          name={"GooglePlaceId"}
          value={newEstablishment.GooglePlaceId}
        /> */}
        <ModalButtons onSave={handleUpdate} action={t("modalButton.edit")} />
      </EditEntityModal>
      <DeleteEntityModal ref={DeleteEntityDialog} onDelete={handleDelete} />
      <MainTable
        headers={[
          t("establishmentsPage.tableHeaderName"),
          t("establishmentsPage.tableHeaderCategory"),
          t("establishmentsPage.tableHeaderAddress"),
          t("establishmentsPage.tableHeaderEmail"),
          t("establishmentsPage.tableHeaderPhone"),
          // t("establishmentsPage.tableHeaderLatitude"),
          // t("establishmentsPage.tableHeaderLongitude"),
        
          t("establishmentsPage.tableHeaderActions"),
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
