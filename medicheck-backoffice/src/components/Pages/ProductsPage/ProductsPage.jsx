import React, { useContext, useEffect, useRef, useState } from "react";

import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { MainTable } from "../../UI/MainTable";
import { PageLayout } from "../../UI/PayeLayout";
import { ModalButtons } from "../../UI/ModalButtons";
import { AddEntityModal } from "../../UI/AddEntityModal";
import { DeleteEntityModal } from "../../UI/DeleteEntityModal";
import { ModalInput } from "../../UI/ModalInput";
import { ModalComboBox } from "../../UI/ModalComboBox";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getCoverageType,
  getProducts,
} from "../../../services/apiService";
import { EditEntityModal } from "../../UI/EditEntityModal";
import { useTranslation } from "react-i18next";
import LocaleContext from "../../../LocaleContext";
import moment from "moment";
export const ProductsPage = () => {
  const { t } = useTranslation();
  const { setCurrentPage } = useContext(LocaleContext);
  const AddEntityDialog = useRef();
  const EditEntityDialog = useRef();
  const DeleteEntityDialog = useRef();
  const initialState = {
    id: 0,
    Nombre: "",
    FechaRegistro: "",
    Cups: "",
    Tipo: "",
    IsPdss: false,
  };
  const [id, setId] = useState();
  const [tableData, setTableData] = useState();
  const [newProduct, setNewProduct] = useState(initialState);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(10);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Selecciona..");
  const [inputCoverageTypes, setInputCoverageTypes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setCurrentPage(t("sidebar.products"));

        const coverageTypes = await getCoverageType();
        setInputCoverageTypes(coverageTypes);
        const products = await getProducts(
          page + 1,
          rowsPerPage,
          search,
          typeFilter == "Selecciona.."
            ? ""
            : typetgetId(coverageTypes, typeFilter)
        );

        setTotalItems(products.totalItems);
        console.log(products);
        setTableData(
          products.data.map((product) => {
            return {
              id: product.idProducto,
              Nombre: product.nombre,
              FechaRegistro: moment(product.fechaRegistro).format("YYYY-MM-DD"),
              Cups: product.cups,
              Tipo: typegetname(coverageTypes, product.idTipo),
              IsPdss: product.isPdss ? "Si" : "No",
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, [page, rowsPerPage, t, search, typeFilter]);

  const typegetname = (entities, id) => {
    const objectFound = entities.find((entity) => id == entity.id);
    return objectFound?.descripcion;
  };

  const typetgetId = (entities, nombre) => {
    const objectFound = entities.find((entity) => nombre == entity.descripcion);
    return objectFound.id;
  };

  async function handleSave() {
    const newData = {
      ...newProduct,
      Tipo: typetgetId(inputCoverageTypes, newProduct.Tipo),
      IsPdss: newProduct.IsPdss == "Si" ? true : false,
    };
    const response = await addProduct(newData).then(
      setTableData((prevData) => [...prevData, {...newData, Tipo: typegetname(inputCoverageTypes, newData.Tipo)}])
    );
    setNewProduct(initialState);
  }
  function handleInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    setNewProduct((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }
  function handleEdit(data) {
    EditEntityDialog.current.showModal();
    setNewProduct(data);
  }
  async function handleUpdate() {
    const entityToUpdate = tableData.find(
      (entity) => newProduct.id === entity.id
    );
    const updatedproduct = await editProduct(entityToUpdate.id, {
      nombre: newProduct.Nombre,
      fechaRegistro: moment( newProduct.FechaRegistro).format("YYYY-MM-DD"),
      cups: newProduct.Cups,
      idTipo: typetgetId(inputCoverageTypes, newProduct.Tipo),
      isPdss: newProduct.IsPdss == "Si" ? true : false,
    }).then(
      setTableData((prevValue) =>
        prevValue.map((product) =>
          product.id === entityToUpdate.id ? { ...newProduct } : product
        )
      )
    );
  }

  function handleOpenDeleteModal(id) {
    DeleteEntityDialog.current.showModal();
    setId(id);
  }

  async function handleDelete() {
    const response = await deleteProduct(id).then(
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
  const handleTypeFilter = (e) => setTypeFilter(e.target.value);


  return (
    <PageLayout
      pageMainTitle={t("productsPage.title")}
      pageMainbuttonDescription={t("productsPage.addButton")}
      pageMainbuttonIcon={<AddShoppingCartOutlinedIcon />}
      onAdd={() => AddEntityDialog.current.showModal()}
      handleSearch={handleSearch}
      filterValue={typeFilter}
      handleFilter={handleTypeFilter}
      options={[
        "Selecciona..",
        ...inputCoverageTypes.map((coverageType) => coverageType.descripcion),
      ]}
    >
      <AddEntityModal ref={AddEntityDialog} title={t("productsPage.addButton")}>
        <ModalInput
          label={t("productsPage.tableHeaderName")}
          type={"text"}
          placeholder={t("productsPage.modalPlaceholderName")}
          onChange={handleInput}
          name={"Nombre"}
          value={newProduct.Nombre}
        />
        <ModalInput
          label={t("productsPage.tableHeaderRegisterDate")}
          type={"date"}
          onChange={handleInput}
          name={"FechaRegistro"}
          value={newProduct.FechaRegistro}
        />

        <ModalInput
          label={t("productsPage.tableHeaderCups")}
          type={"text"}
          onChange={handleInput}
          name={"Cups"}
          value={newProduct.Cups}
        />
        <ModalComboBox
          title={t("productsPage.tableHeaderType")}
          options={[
            "Selecciona..",
            ...inputCoverageTypes.map(
              (coverageType) => coverageType.descripcion
            ),
          ]}
          value={newProduct.Tipo}
          name={"Tipo"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t("productsPage.tableHeaderIsPdss")}
          options={["Selecciona..", "No", "Si"]}
          value={newProduct.IsPdss}
          name={"IsPdss"}
          onChange={handleInput}
        />
        {/* <ModalComboBox
          title={t('productsPage.tableHeaderCategory')}
          options={[
            "Selecciona..",
            "CARDIOLOGIA",
            "ODONTOLOGIA",
            "DERMATOLOGIA",
            "EMERGENCIA",
            "ORTOPEDIA",
            "CIRUGIA",
            "GASTROENTEROLOGIA",
            "HEMATOLOGIA",
            "INFECTOLOGIA",
          ]}
          value={newProduct.Categoria}
          name={"Categoria"}
          onChange={handleInput}
        /> */}
        <ModalButtons onSave={handleSave} action={t("modalButton.save")} />
      </AddEntityModal>
      <EditEntityModal
        ref={EditEntityDialog}
        title={t("productsPage.editButton")}
      >
        <ModalInput
          label={t("productsPage.tableHeaderName")}
          type={"text"}
          placeholder={t("productsPage.modalPlaceholderName")}
          onChange={handleInput}
          name={"Nombre"}
          value={newProduct.Nombre}
        />
        <ModalInput
          label={t("productsPage.tableHeaderRegisterDate")}
          type={"date"}
          onChange={handleInput}
          name={"FechaRegistro"}
          value={newProduct.FechaRegistro}
        />

        <ModalInput
          label={t("productsPage.tableHeaderCups")}
          type={"text"}
          onChange={handleInput}
          name={"Cups"}
          value={newProduct.Cups}
        />
        <ModalComboBox
          title={t("productsPage.tableHeaderType")}
          options={[
            "Selecciona..",
            ...inputCoverageTypes.map(
              (coverageType) => coverageType.descripcion
            ),
          ]}
          value={newProduct.Tipo}
          name={"Tipo"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t("productsPage.tableHeaderIsPdss")}
          options={["Selecciona..", "No", "Si"]}
          value={newProduct.IsPdss}
          name={"IsPdss"}
          onChange={handleInput}
        />
        <ModalButtons onSave={handleUpdate} action={"Editar"} />
      </EditEntityModal>
      <DeleteEntityModal ref={DeleteEntityDialog} onDelete={handleDelete} />
      <MainTable
        headers={[
          t("productsPage.tableHeaderName"),
          t("productsPage.tableHeaderRegisterDate"),
          t("productsPage.tableHeaderCups"),
          t("productsPage.tableHeaderType"),
          t("productsPage.tableHeaderIsPdss"),
          t("productsPage.tableHeaderActions"),
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
