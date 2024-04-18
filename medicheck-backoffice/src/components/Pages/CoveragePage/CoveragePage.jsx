import React, { useContext, useEffect, useRef, useState } from "react";

import { MainTable } from "../../UI/MainTable";
import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
import { PageLayout } from "../../UI/PayeLayout";
import { AddEntityModal } from "../../UI/AddEntityModal";
import { DeleteEntityModal } from "../../UI/DeleteEntityModal";
import { ModalInput } from "../../UI/ModalInput";
import { ModalComboBox } from "../../UI/ModalComboBox";
import { ModalButtons } from "../../UI/ModalButtons";
import {
  addCoverages,
  deleteCoverage,
  editCoverage,
  getCoverages,
  getDashboardStatistics,
  getGroups,
  getPlans,
  getProducts,
  getSubGroups,
} from "../../../services/apiService";
import { EditEntityModal } from "../../UI/EditEntityModal";
import { useTranslation } from "react-i18next";
import LocaleContext from "../../../LocaleContext";
import moment from "moment";
export const CoveragePage = () => {
  const { t } = useTranslation();
  const { setCurrentPage } = useContext(LocaleContext);
  const AddEntityDialog = useRef();
  const EditEntityDialog = useRef();
  const DeleteEntityDialog = useRef();
  const initialState = {
    id: 0,
    Producto: "",
    Plan: "",
    Grupo: "",
    SubGrupo: "",
    IsPdss: "",
    Porcentaje: "",
    FechaVencimiento: "",
  };
  const [id, setId] = useState();
  const [tableData, setTableData] = useState();
  const [newCoverage, setNewCoverage] = useState(initialState);
  const [inputProducts, setInputProducts] = useState([]);
  const [inputPlans, setInputPlans] = useState([]);
  const [inputGroups, setInputGroups] = useState([]);
  const [inputSubGroups, setInputSubGroups] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(10);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Selecciona..");
  const [subgroupFilter, setSubGroupFilter] = useState("Selecciona..");

  useEffect(() => {
    (async () => {

      setCurrentPage(t("sidebar.coverages"));
      const groups = await getGroups();
      const subGroups = await getSubGroups();
      const coverages = await getCoverages(
        page + 1,
        rowsPerPage,
        search,
        typeFilter == "Selecciona.." ? "" : groupgetid(groups, typeFilter),
        subgroupFilter == "Selecciona.."
          ? ""
          : subgroupgetid(subGroups, subgroupFilter)
      );
      console.log(coverages.data);
      const { totalProductos, totalPlanes } = await getDashboardStatistics();
      const products = await getProducts(1, totalProductos, "", "");
      const plans = await getPlans(1, totalPlanes, "","");

      setInputGroups(groups);
      setInputSubGroups(subGroups);
      setTotalItems(coverages.totalItems);
      setInputPlans(plans.data);
      setInputProducts(products.data);

      setTableData(
        coverages.data.map((coverage) => {
          return {
            id: coverage.idCobertura,
            Producto: productgetName(products.data, coverage?.idProducto),
            Plan:
              coverage.idPlan == null
                ? "N/A"
                : plangetName(plans.data, coverage.idPlan),
            Grupo: groupgetName(groups, coverage.idGrupo),
            SubGrupo: subgroupgetName(subGroups, coverage.idSubgrupo),
            Porcentaje: coverage.porcentaje,
            IsPdss: coverage.isPdss ? "Si" : "No",
            FechaVencimiento:
              coverage.fechaVencimiento == null
                ? moment(new Date().now).format("YYYY-MM-DD")
                : moment(coverage.fechaVencimiento).format("YYYY-MM-DD"),
          };
        })
      );
    })();
  }, [page, rowsPerPage, t, search, typeFilter, subgroupFilter]);
 
  const productgetid = (entities, nombre) => {
    const objectFound = entities.find((entity) => nombre == entity.nombre);
    return objectFound.idProducto;
  };

  const productgetName = (entities, id) => {
    const objectFound = entities.find((entity) => id == entity.idProducto);
    console.log(objectFound);
    return objectFound.nombre;
  };

  const groupgetName = (entities, id) => {
    const objectFound = entities.find((entity) => id == entity.id);
    console.log(objectFound);
    return objectFound.descripcion;
  };

  const groupgetid = (entities, nombre) => {
    const objectFound = entities.find((entity) => nombre == entity.descripcion);
    return objectFound.id;
  };
  const subgroupgetName = (entities, id) => {
    const objectFound = entities.find((entity) => id == entity.idSubgrupo);
    console.log(objectFound);
    return objectFound.descripcion;
  };
  const subgroupgetid = (entities, nombre) => {
    const objectFound = entities.find((entity) => nombre == entity.descripcion);
    return objectFound.idSubgrupo;
  };

  const plangetName = (entities, id) => {
    if ((id = !null)) {
      const objectFound = entities.find((entity) => id == entity.idPlan);
      return objectFound.descripcion;
    } else {
      return null;
    }
  };

  const plangetid = (entities, nombre) => {
    const objectFound = entities.find((entity) => nombre == entity.descripcion);
    return objectFound.idPlan;
  };

  async function handleSave() {
    const newData = {
      idProducto: productgetid(inputProducts, newCoverage.Producto),
      idPlan: plangetid(inputPlans, newCoverage.Plan),
      idGrupo: newCoverage.Grupo,
      idSubgrupo: newCoverage.SubGrupo,
      porcentaje: newCoverage.Porcentaje,
      isPdss: newCoverage.IsPdss === "Si" ? true : false,
      fechaVencimiento: newCoverage.FechaVencimiento,
      // Plan: getid(inputPlans, newCoverage.Plan),
    };

    console.log(newData);

    const response = await addCoverages(newData).then(
      setTableData((prevData) => [
        ...prevData,
        {
          Producto: productgetName(inputProducts, newData.idProducto),
          Plan: plangetName(inputPlans, newData.idPlan),
          Grupo: newData.idGrupo,
          SubGrupo: newData.idSubgrupo,
          Porcentaje: newData.porcentaje,
          IsPdss: newData.isPdss ? "Si" : "No",
          FechaVencimiento: moment(newData.fechaVencimiento).format(
            "YYYY-MM-DD"
          ),
        },
      ])
    );
  }
  function handleInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    setNewCoverage((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }
  function handleEdit(data) {
    EditEntityDialog.current.showModal();
    setNewCoverage(data);
  }

  async function handleUpdate() {
    const entityToUpdate = tableData.find(
      (entity) => newCoverage.id === entity.id
    );
    const updatedCoverage = await editCoverage(entityToUpdate.id, {
      idProducto: productgetid(inputProducts, newCoverage.Producto),
      idPlan: plangetid(inputPlans, newCoverage.Plan),
      idGrupo: groupgetid(inputGroups, newCoverage.Grupo),
      idSubgrupo: subgroupgetid(inputSubGroups,newCoverage.SubGrupo),
      porcentaje: Number(newCoverage.Porcentaje),
      idPdss: newCoverage.IsPdss === "Si" ? true : false,
      fechaVencimiento: newCoverage.FechaVencimiento,
    }).then( 
      setTableData((prevValue) =>
        prevValue.map((coverage) =>
          coverage.id === entityToUpdate.id ? { ...newCoverage } : coverage
        )
      )
    );
    console.log(updatedCoverage);
  }

  function handleOpenDeleteModal(id) {
    DeleteEntityDialog.current.showModal();
    setId(id);
  }

  async function handleDelete() {
    const response = await deleteCoverage(id).then(
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
  const handlesubgroupFilter = (e) => setSubGroupFilter(e.target.value);

  return (
    <PageLayout
      pageMainTitle={t("coveragesPage.title")}
      pageMainbuttonDescription={t("coveragesPage.addButton")}
      pageMainbuttonIcon={<AddModeratorOutlinedIcon />}
      onAdd={() => AddEntityDialog.current.showModal()}
      handleSearch={handleSearch}
      options={[
        "Selecciona..",
        ...inputGroups.map((group) => group.descripcion),
      ]}
      options2={[
        "Selecciona..",
        ...inputSubGroups.map((subgroup) => subgroup.descripcion),
      ]}
      handleFilter={handleFilter}
      handleFilter2={handlesubgroupFilter}
      filterValue={typeFilter}
      filterValue2={subgroupFilter}
    >
      <AddEntityModal
        ref={AddEntityDialog}
        title={t("coveragesPage.addButton")}
      >
        <ModalComboBox
          title={t("coveragesPage.tableHeaderProduct")}
          options={[
            "Selecciona",
            ...inputProducts.map((product) => product.nombre),
          ]}
          value={newCoverage.Producto}
          name={"Producto"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t("coveragesPage.tableHeaderPlan")}
          options={[
            "Selecciona..",
            ...inputPlans.map((plan) => plan.descripcion),
          ]}
          value={newCoverage.Plan}
          name="Plan"
          onChange={handleInput}
        />
        <ModalComboBox
          title={t("coveragesPage.tableHeaderIsPdss")}
          options={["Selecciona", "Si", "No"]}
          value={newCoverage.IsPdss}
          name={"IsPdss"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t("coveragesPage.tableHeaderGroup")}
          options={[
            "Selecciona",
            ...inputGroups.map(group=> group.descripcion)
          ]}
          value={newCoverage.Grupo}
          name={"Grupo"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t("coveragesPage.tableHeaderSubGroup")}
          options={[
            "Selecciona",
            ...inputSubGroups.map(subgroup=> subgroup.descripcion),
          ]}
          value={newCoverage.SubGrupo}
          name={"SubGrupo"}
          onChange={handleInput}
        />
        <ModalInput
          label={t("coveragesPage.tableHeaderPercentage")}
          type={"number"}
          placeholder={t("coveragesPage.modalPlaceholderPercentage")}
          onChange={handleInput}
          name={"Porcentaje"}
          value={newCoverage.Porcentaje}
        />
        <ModalInput
          label={t("coveragesPage.tableHeaderExpireDate")}
          type={"date"}
          onChange={handleInput}
          name={"FechaVencimiento"}
          value={newCoverage.FechaVencimiento}
        />
        <ModalButtons onSave={handleSave} action={t("modalButton.save")} />
      </AddEntityModal>
      <EditEntityModal
        ref={EditEntityDialog}
        title={t("coveragesPage.editButton")}
      >
        <ModalComboBox
          title={t("coveragesPage.tableHeaderProduct")}
          options={[
            "Selecciona",
            ...inputProducts.map((product) => product.nombre),
          ]}
          value={newCoverage.Producto}
          name={"Producto"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t("coveragesPage.tableHeaderPlan")}
          options={[
            "Selecciona..",
            ...inputPlans.map((plan) => plan.descripcion),
          ]}
          value={newCoverage.Plan}
          name="Plan"
          onChange={handleInput}
        />
        <ModalComboBox
          title={t("coveragesPage.tableHeaderIsPdss")}
          options={["Selecciona", "Si", "No"]}
          value={newCoverage.IsPdss}
          name={"IsPdss"}
          onChange={handleInput}
        />
         <ModalComboBox
          title={t("coveragesPage.tableHeaderGroup")}
          options={[
            "Selecciona",
            ...inputGroups.map(group=> group.descripcion)
          ]}
          value={newCoverage.Grupo}
          name={"Grupo"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t("coveragesPage.tableHeaderSubGroup")}
          options={[
            "Selecciona",
            ...inputSubGroups.map(subgroup=> subgroup.descripcion),
          ]}
          value={newCoverage.SubGrupo}
          name={"SubGrupo"}
          onChange={handleInput}
        />
        <ModalInput
          label={t("coveragesPage.tableHeaderPercentage")}
          type={"number"}
          placeholder={t("coveragesPage.modalPlaceholderPercentage")}
          onChange={handleInput}
          name={"Porcentaje"}
          value={newCoverage.Porcentaje}
        />
        <ModalInput
          label={t("coveragesPage.tableHeaderExpireDate")}
          type={"date"}
          onChange={handleInput}
          name={"FechaVencimiento"}
          value={newCoverage.FechaVencimiento}
        />

        <ModalButtons onSave={handleUpdate} action={t("modalButton.edit")} />
      </EditEntityModal>
      <DeleteEntityModal ref={DeleteEntityDialog} onDelete={handleDelete} />
      <MainTable
        headers={[
          t("coveragesPage.tableHeaderProduct"),
          t("coveragesPage.tableHeaderPlan"),
          t("coveragesPage.tableHeaderGroup"),
          t("coveragesPage.tableHeaderSubGroup"),
          t("coveragesPage.tableHeaderPercentage"),
          t("coveragesPage.tableHeaderIsPdss"),
          t("coveragesPage.tableHeaderExpireDate"),
          t("coveragesPage.tableHeaderActions"),
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
