import React, { useContext, useEffect, useRef, useState } from "react";

import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import { MainTable } from "../../UI/MainTable";
import { PageLayout } from "../../UI/PayeLayout";
import { AddEntityModal } from "../../UI/AddEntityModal";
import { DeleteEntityModal } from "../../UI/DeleteEntityModal";
import { ModalButtons } from "../../UI/ModalButtons";
import { ModalTextArea } from "../../UI/ModalTextArea";
import { ModalComboBox } from "../../UI/ModalComboBox";
import {
  addPlans,
  deletePlans,
  editPlans,
  getDashboardStatistics,
  getInsurances,
  getPlans,
  getRegime,
} from "../../../services/apiService";
import { EditEntityModal } from "../../UI/EditEntityModal";
import { useTranslation } from "react-i18next";
import LocaleContext from "../../../LocaleContext";
export const PlansPage = () => {
  const {t} = useTranslation();
  const {setCurrentPage} = useContext(LocaleContext)
  const AddEntityDialog = useRef();
  const EditEntityDialog = useRef();
  const DeleteEntityDialog = useRef();
  const initialState = {
    id: 0,
    Descripcion: "",
    Aseguradora: "",
    Regimen:""
  };
  const [id, setId] = useState();
  const [tableData, setTableData] = useState();
  const [newPlan, setNewPlan] = useState(initialState);
  const [inputInsurance, setInputInsurance] = useState([]);
  const [inputRegimen, setInputRegimen] = useState([]);
  const [page, setPage]=useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems,setTotalItems ] = useState(10);
  const [regimeFilter, setRegimeFilter] = useState("Selecciona..");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setCurrentPage(t('sidebar.plans'))

      
      const {totalAseguradoras} = await getDashboardStatistics() 
      const insurances = await getInsurances(1, totalAseguradoras, "");
      const regimen = await getRegime();
      const plans = await getPlans(page+1, rowsPerPage, search, regimeFilter == "Selecciona.."?"":regimengetid(regimen, regimeFilter));
      setInputRegimen(regimen);
      setTotalItems(plans.totalItems)
      setInputInsurance(insurances.data);
      console.log(plans);
      setTableData(
        plans.data.map((plan) => {
          return {
            id: plan.idPlan,
            Descripcion: plan.descripcion,
            Aseguradora: insurancegetName(insurances.data, plan.idAseguradora),
            Regimen: regimengetName(regimen,plan.idRegimen)
          };
        })
      );
    })();
  }, [page, rowsPerPage, t, search, regimeFilter]);

  const insurancegetid = (entities, nombre) => {
    const objectFound = entities.find((entity) => nombre == entity.nombre);
    return objectFound.idAseguradora;
  };

  const insurancegetName = (entities, id) => {
    const objectFound = entities.find((entity) => id == entity.idAseguradora);
    return objectFound.nombre;
  };

  const regimengetid = (entities, nombre) => {
    const objectFound = entities.find((entity) => nombre == entity.descripcion);
    return objectFound.id;
  };

  const regimengetName = (entities, id) => {
    const objectFound = entities.find((entity) => id == entity.id);
    return objectFound.descripcion;
  };

  async function handleSave() {
    const newData = {
      descripcion: newPlan.Descripcion,
      idAseguradora: insurancegetid(inputInsurance, newPlan.Aseguradora),
      idRegimen:regimengetid(inputRegimen, newPlan.Regimen)
    };
    const response = await addPlans(newData).then(
      setTableData((prevValue) => [...prevValue, newPlan])
    );
    console.log(response);

    setNewPlan(initialState);
  }
  function handleInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    setNewPlan((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }
  function handleOpenDeleteModal(id) {
    DeleteEntityDialog.current.showModal();
    setId(id);
  }

  async function handleDelete() {
    const response = deletePlans(id).then(
      setTableData(tableData.filter((data) => data.id != id))
    );
  }

  function handleEdit(data) {
    EditEntityDialog.current.showModal();
    setNewPlan(data);
  }

  async function handleUpdate() {
    const entityToUpdate = tableData.find((entity) => newPlan.id === entity.id);
    const updatedPlan = await editPlans(entityToUpdate.id, {
      idAseguradora: insurancegetid(inputInsurance, newPlan.Aseguradora),
      descripcion: newPlan.Descripcion,
      idRegimen:regimengetid(inputRegimen, newPlan.Regimen)
    }).then( setTableData(prevValue=> prevValue.map(plan=> plan.id === entityToUpdate.id? {...newPlan}: plan)));
    console.log(updatedPlan);
  }
  const handleNewPage = (e, newPage)=>{
    setPage(newPage)
  }

  const handlePageSize=(e)=>{
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }
  const handleSearch = (e)=> setSearch(e.target.value);
  const handleRegimeFilter=(e)=> setRegimeFilter(e.target.value);

  return (
    <PageLayout
      pageMainTitle={t('plansPage.title')}
      pageMainbuttonDescription={t('plansPage.addButton')}
      pageMainbuttonIcon={<PostAddOutlinedIcon />}
      onAdd={() =>{
          setNewPlan(initialState);
          AddEntityDialog.current.showModal()
        }}
        handleSearch={handleSearch}
      options={["Selecciona..", ...inputRegimen.map(regime=> regime.descripcion)]}
      filterValue={regimeFilter}
      handleFilter={handleRegimeFilter}
    >
      <AddEntityModal ref={AddEntityDialog} title={t('modalButton.save')}>
        
        <ModalTextArea
          label={t('plansPage.tableHeaderDescription')}
          value={newPlan.Descripcion}
          placeholder={t('plansPage.modalPlaceholderDescription')}
          onChange={handleInput}
          name={"Descripcion"}
        ></ModalTextArea>
        <ModalComboBox
          title={t('plansPage.tableHeaderInsurance')}
          options={[
            "Selecciona..",
            ...inputInsurance.map((insurance) => insurance.nombre),
          ]}
          value={newPlan.Aseguradora}
          name={"Aseguradora"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t('plansPage.tableHeaderRegime')}
          options={[
            "Selecciona..",
             "CONTRIBUTIVO",
             "SUBSIDIADO",
            ,"COMPLEMENTARIO"
          ]}
          value={newPlan.Regimen}
          name={"Regimen"}
          onChange={handleInput}
        />
        <ModalButtons onSave={handleSave} action={t('modalButton.save')} />
      </AddEntityModal>
      <EditEntityModal ref={EditEntityDialog} title={t('plansPage.editButton')}>
      <ModalTextArea
          label={t('plansPage.tableHeaderDescription')}
          value={newPlan.Descripcion}
          placeholder={t('plansPage.modalPlaceholderDescription')}
          onChange={handleInput}
          name={"Descripcion"}
        ></ModalTextArea>
        <ModalComboBox
          title={t('plansPage.tableHeaderDescription')}
          options={[
            "Selecciona..",
            ...inputInsurance.map((insurance) => insurance.nombre),
          ]}
          value={newPlan.Aseguradora}
          name={"Aseguradora"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t('plansPage.tableHeaderRegime')}
          options={[
            "Selecciona..",
             "CONTRIBUTIVO",
             "SUBSIDIADO",
            ,"COMPLEMENTARIO"
          ]}
          value={newPlan.Regimen}
          name={"Regimen"}
          onChange={handleInput}
        />

        <ModalButtons onSave={handleUpdate} action={t('modalButton.edit')} />
      </EditEntityModal>

      <DeleteEntityModal ref={DeleteEntityDialog} onDelete={handleDelete} />
      <MainTable
        headers={[t('plansPage.tableHeaderDescription'), t('plansPage.tableHeaderInsurance'),t('plansPage.tableHeaderRegime'), t('plansPage.tableHeaderActions')]}
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
