import React, { useContext, useEffect, useRef, useState } from "react";
import moment from "moment";
import { MainTable } from "../../UI/MainTable";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { PageLayout } from "../../UI/PayeLayout";
import { AddEntityModal } from "../../UI/AddEntityModal";
import { DeleteEntityModal } from "../../UI/DeleteEntityModal";
import { ModalComboBox } from "../../UI/ModalComboBox";
import { ModalTextArea } from "../../UI/ModalTextArea";
import { ModalButtons } from "../../UI/ModalButtons";
import {
  addIncidents,
  deleteIncidents,
  editIncidents,
  getDashboardStatistics,
  getEstablishment,
  getIncidents,
  getPlans,
  getProducts,
  getUsers,
} from "../../../services/apiService";
import { NoPhotography } from "@mui/icons-material";
import { ModalInput } from "../../UI/ModalInput";
import { EditEntityModal } from "../../UI/EditEntityModal";
import { useTranslation } from "react-i18next";
import LocaleContext from "../../../LocaleContext";
export const IncidentsPage = () => {
  const { t } = useTranslation();
  const { setCurrentPage } = useContext(LocaleContext);
  const AddEntityDialog = useRef();
  const EditEntityDialog = useRef();
  const DeleteEntityDialog = useRef();
  const initialState = {
    id: 0,
    Usuario: "",
    Descripcion: "",
    Plan: "",
    Producto: "",
    Establecimiento: "",
    Estado: "",
    FechaIncidente: "",
  };
  const [id, setId] = useState();
  const [tableData, setTableData] = useState();
  const [newIncident, setNewIncident] = useState(initialState);
  const [inputUsers, setInputUsers] = useState([]);
  const [inputPlans, setInputPlans] = useState([]);
  const [inputEstablishments, setInputEstablishments] = useState([]);
  const [inputProducts, setInputProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [reduceProducts, setReduceProducts] = useState([]);

  useEffect(() => {
    (async () => {
      setCurrentPage(t("sidebar.incidents"));
      const {
        totalUsuarios,
        totalPlanes,
        totalEstablecimientos,
        totalProductos,
      } = await getDashboardStatistics();
      const incidents = await getIncidents(
        page + 1,
        rowsPerPage,
        search,
        statusFilter == "Selecciona.." ? "" : statusFilter
      );
      const users = await getUsers(1, totalUsuarios, "", "");
      const plans = await getPlans(1, totalPlanes, "","");
      const establishments = await getEstablishment(
        1,
        totalEstablecimientos,
        "",
        ""
      );
      console.log(establishments)
      const establishmentsArray = establishments.data.map(establishment=> establishment.establecimiento);
      console.log(establishmentsArray);
      const products = await getProducts(1, totalProductos, "", "");
      console.log(products);
      // const products10 = await getProducts(1, 50, "", "");
      // setReduceProducts(products10.data);
      setInputUsers(users.data);
      setInputProducts(products.data);
      setInputEstablishments(establishmentsArray);
      setInputPlans(plans.data);
      setTotalItems(incidents.totalItems);
      console.log(incidents);
      setTableData(
        incidents.data.map((incident) => {
          return {
            id: incident.idIncidente,
            Usuario: usergetName(users.data, incident.idUsuario),
            Plan: plangetName(plans.data, incident.idPlan),
            Producto: productgetName(products.data, incident.idProducto),
            Descripcion: incident.descripcion,
            Establecimiento: establishmentgetName(
              establishmentsArray,
              incident.idEstablecimiento
            ),
            Estado: incident.estado,
            FechaIncidente:
              incident.fechaIncidente == null
                ? "N/A"
                : moment(incident.fechaIncidente).format("YYYY-MM-DD"),
          };
        })
      );
    })();
  }, [page, rowsPerPage, t, search, statusFilter]);

  const usergetName = (entities, id) => {
    const objectFound = entities.find((entity) => id == entity.idUsuario);
    return `${objectFound?.nombre} ${objectFound?.apellidos}`;
  };
  const usergetId = (entities, nombre) => {
    const objectFound = entities.find((entity) => nombre == entity.nombre);
    return objectFound.idUsuario;
  };
  const plangetName = (entities, id) => {
    const objectFound = entities.find((entity) => id == entity.idPlan);
    return objectFound.descripcion;
  };

  const productgetName = (entities, id) => {
    const objectFound = entities.find((entity) => id == entity.idProducto);
    return objectFound?.nombre;
  };

  const productgetId = (entities, nombre) => {
    const objectFound = entities.find((entity) => nombre == entity.nombre);
    return objectFound.idProducto;
  };

  const plangetId = (entities, nombre) => {
    const objectFound = entities.find((entity) => nombre == entity.descripcion);
    return objectFound.idPlan;
  };
  const establishmentgetName = (entities, id) => {
    
    const objectFound = entities.find((entity) => id = entity.idEstablecimiento );
    
    return `${objectFound.nombre}`;
  };
  const establishmentgetId = (entities, nombre) => {
    const objectFound = entities.find(
      (entity) => nombre == entity.nombre
    );
    return objectFound.idEstablecimiento;
  };

  async function handleSave() {
    const newData = { ...newIncident };
    console.log(newData);
    const response = await addIncidents({
      idUsuario: usergetId(inputUsers, newData.Usuario),
      idPlan: plangetId(inputPlans, newData.Plan),
      descripcion: newData.Descripcion,
      idEstablecimiento: establishmentgetId(
        inputEstablishments,
        newData.Establecimiento
      ),
      idProducto: productgetId(inputProducts, newData.Producto),
      estado: newData.Estado,
      fechaIncidente: newData.FechaIncidente,
    });
    setTableData((prevValue) => {
      return [...prevValue, newData];
    });
    console.log(response)
    setNewIncident(initialState);
  }
  function handleInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    console.log(value);
    setNewIncident((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }
  function handleOpenDeleteModal(id) {
    DeleteEntityDialog.current.showModal();
    setId(id);
  }

  async function handleDelete() {
    const response = await deleteIncidents(id).then(
      setTableData(tableData.filter((data) => data.id != id))
    );
  }

  function handleEdit(data) {
    EditEntityDialog.current.showModal();
    const fullname = data.Usuario.split(" ");
    const [name, lastname] = fullname;
    setNewIncident({ ...data, Usuario: name });
    console.log(name);
  }

  async function handleUpdate() {
    const entityToUpdate = tableData.find(
      (entity) => newIncident.id === entity.id
    );
    const updatedIncident = await editIncidents(entityToUpdate.id, {
      idUsuario: usergetId(inputUsers, newIncident.Usuario),
      idPlan: plangetId(inputPlans, newIncident.Plan),
      descripcion: newIncident.Descripcion,
      idEstablecimiento: establishmentgetId(
        inputEstablishments,
        newIncident.Establecimiento
      ),
      idProducto: productgetId(inputProducts, newIncident.Producto),
      estado: newIncident.Estado,
      fechaIncidente: newIncident.FechaIncidente,
    }).then(
      setTableData((prevValue) =>
        prevValue.map((incident) =>
          incident.id === entityToUpdate.id ? { ...newIncident } : incident
        )
      )
    );
    console.log(updatedIncident);
  }

  const handleNewPage = (e, newPage) => {
    setPage(newPage);
  };

  const handlePageSize = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };
  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => setStatusFilter(e.target.value);

  return (
    <PageLayout
      pageMainTitle={t("incidentsPage.title")}
      pageMainbuttonDescription={t("incidentsPage.addButton")}
      pageMainbuttonIcon={<ErrorOutlineOutlinedIcon />}
      onAdd={() => AddEntityDialog.current.showModal()}
      handleSearch={handleSearch}
      handleFilter={handleFilter}
      filterValue={statusFilter}
      options={["Selecciona..", "CREADO", "ABIERTO", "EN_REVISION", "CERRADO"]}
    >
      <AddEntityModal
        ref={AddEntityDialog}
        title={t("incidentsPage.addButton")}
      >
        <ModalComboBox
          title={t("incidentsPage.tableHeaderUser")}
          options={["Selecciona..", ...inputUsers.map((user) => user.nombre)]}
          value={newIncident.Usuario}
          name={"Usuario"}
          onChange={handleInput}
        />
        <ModalTextArea
          label={t("incidentsPage.tableHeaderDescription")}
          value={newIncident.Descripcion}
          placeholder={t("incidentsPage.modalPlaceholderDescription")}
          onChange={handleInput}
          name={"Descripcion"}
        ></ModalTextArea>
        <ModalComboBox
          title={t("incidentsPage.tableHeaderEstablishment")}
          options={[
            "Selecciona..",
            ...inputEstablishments.map((establishment) => establishment.nombre),
          ]}
          value={newIncident.Establecimiento}
          name={"Establecimiento"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t("incidentsPage.tableHeaderProduct")}
          options={[
            "Selecciona..",
            ...inputProducts.map((product) => product.nombre),
          ]}
          value={newIncident.Producto}
          name={"Producto"}
          onChange={handleInput}
          loading = "lazy"
        />
        <ModalComboBox
          title={t("incidentsPage.tableHeaderPlan")}
          options={[
            "Selecciona..",
            ...inputPlans.map((plan) => plan.descripcion),
          ]}
          value={newIncident.Plan}
          name={"Plan"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t("incidentsPage.tableHeaderStatus")}
          options={[
            "Selecciona..",
            "CREADO",
            "ABIERTO",
            "EN_REVISION",
            "CERRADO",
          ]}
          value={newIncident.Estado}
          name={"Estado"}
          onChange={handleInput}
        />
        <ModalInput
          label={t("incidentsPage.tableHeaderIncidentDate")}
          type={"date"}
          placeholder={"Ingresa una fecha"}
          onChange={handleInput}
          name={"FechaIncidente"}
          value={newIncident.FechaIncidente}
        />
        <ModalButtons onSave={handleSave} action={t("modalButton.save")} />
      </AddEntityModal>
      <EditEntityModal
        ref={EditEntityDialog}
        title={t("incidentsPage.editButton")}
      >
        <ModalComboBox
          title={t("incidentsPage.tableHeaderUser")}
          options={["Selecciona..", ...inputUsers.map((user) => user.nombre)]}
          value={newIncident.Usuario}
          name={"Usuario"}
          onChange={handleInput}
        />
        <ModalTextArea
          label={t("incidentsPage.tableHeaderDescription")}
          value={newIncident.Descripcion}
          placeholder={t("incidentsPage.modalPlaceholderDescription")}
          onChange={handleInput}
          name={"Descripcion"}
        ></ModalTextArea>
        <ModalComboBox
          title={t("incidentsPage.tableHeaderEstablishment")}
          options={[
            "Selecciona..",
            ...inputEstablishments.map((establishment) => establishment.nombre),
          ]}
          value={newIncident.Establecimiento}
          name={"Establecimiento"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t("incidentsPage.tableHeaderProduct")}
          options={[
            "Selecciona..",
            ...inputProducts.map((product) => product.nombre),
          ]}
          value={newIncident.Producto}
          name={"Producto"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t("incidentsPage.tableHeaderPlan")}
          options={[
            "Selecciona..",
            ...inputPlans.map((plan) => plan.descripcion),
          ]}
          value={newIncident.Plan}
          name={"Plan"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t("incidentsPage.tableHeaderStatus")}
          options={[
            "Selecciona..",
            "CREADO",
            "ABIERTO",
            "EN_REVISION",
            "CERRADO",
          ]}
          value={newIncident.Estado}
          name={"Estado"}
          onChange={handleInput}
        />
        <ModalInput
          label={t("incidentsPage.tableHeaderIncidentDate")}
          type={"date"}
          placeholder={"Ingresa una fecha"}
          onChange={handleInput}
          name={"FechaIncidente"}
          value={newIncident.FechaIncidente}
        />

        <ModalButtons onSave={handleUpdate} action={t("modalButton.edit")} />
      </EditEntityModal>
      <DeleteEntityModal ref={DeleteEntityDialog} onDelete={handleDelete} />
      <MainTable
        headers={[
          t("incidentsPage.tableHeaderUser"),
          t("incidentsPage.tableHeaderPlan"),
          t("incidentsPage.tableHeaderProduct"),
          t("incidentsPage.tableHeaderDescription"),
          t("incidentsPage.tableHeaderEstablishment"),
          t("incidentsPage.tableHeaderStatus"),
          t("incidentsPage.tableHeaderIncidentDate"),
          t("incidentsPage.tableHeaderActions"),
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
