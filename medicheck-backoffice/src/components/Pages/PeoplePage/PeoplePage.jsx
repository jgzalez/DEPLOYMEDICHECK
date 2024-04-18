import React, { useContext, useEffect, useRef, useState } from "react";

import { PageLayout } from "../../UI/PayeLayout";
import { AddEntityModal } from "../../UI/AddEntityModal";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import {
  addPerson,
  addPersonPlan,
  deletePerson,
  editPerson,
  getDashboardStatistics,
  getInsurances,
  getPeople,
  getPersonPlanByid,
  getPlans,
  getPlansByInsurance,
} from "../../../services/apiService";
import { ModalInput } from "../../UI/ModalInput";
import { ModalComboBox } from "../../UI/ModalComboBox";
import { ModalButtons } from "../../UI/ModalButtons";
import { EditEntityModal } from "../../UI/EditEntityModal";
import { DeleteEntityModal } from "../../UI/DeleteEntityModal";
import { MainTable } from "../../UI/MainTable";
import { useTranslation } from "react-i18next";
import LocaleContext from "../../../LocaleContext";
import moment from "moment";

 export  const PeoplePage =  () => {
  const {t} = useTranslation();
  const {setCurrentPage} = useContext(LocaleContext)
  const AddEntityDialog = useRef();
  const EditEntityDialog = useRef();
  const DeleteEntityDialog = useRef();
  const initialState = {
    id: 0,
    noDocumento: "",
    tipoDocumento: "",
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",
    aseguradora:1,
    personaPlans: "",
  };
  const [id, setId] = useState();
  const [tableData, setTableData] = useState();
  const [newPerson, setNewPerson] = useState(initialState);
  const [inputPlan, setInputPlan] = useState([]);
  const [inputInsurance, setInputInsurance]= useState([]);
  const [page, setPage]=useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems,setTotalItems ] = useState(10);
  const [search, setSearch]=useState("");

  useEffect(() => {
    (async () => {
      setCurrentPage(t('sidebar.people'))
      const {totalPlanes, totalAseguradoras} = await getDashboardStatistics()
      const plans = await getPlans(1,totalPlanes,"","" );
      const people = await getPeople(page + 1,rowsPerPage, search );
      const insurances = await getInsurances(1, totalAseguradoras, "");
      setTotalItems(people.totalItems);
      console.log(people);
      setInputPlan(plans.data);
      setInputInsurance(insurances.data);
      
     
      setTableData(
        people.data.map((person) => {
        
          const fetchPerson =  {
            id: person.idPersona,
            noDocumento: person.noDocumento,
            tipoDocumento: person.tipoDocumento,
            nombre: person.nombre,
            apellidos: person.apellidos,
            fechaNacimiento: moment( person.fechaNacimiento).format("YYYY-MM-DD"),
            
            personaPlans:plangetName(plans.data, person.personaPlans[0].idPlan) ,
          
          };
          
        
          return fetchPerson
        })
      );
    })();
  }, [page, rowsPerPage, t, search]);

 async function personplanid(id){
  const person = await getPersonPlanByid(id).then(data=> data);
  return person[0]?.idPlan
 } 

  const plangetid = (entities, nombre) => {
    const objectFound = entities.find((entity) => nombre == entity.descripcion);
    return objectFound.idPlan;
  };
  const plangetName = (entities, id) => {
    const objectFound = entities.find((entity) => id == entity.idPlan);
    console.log(objectFound);
    return objectFound?.descripcion;
  };

  const insurancegetid=(entities, nombre)=>{
    const objectFound = entities.find((entity) => nombre == entity.nombre);
    return objectFound?.idAseguradora;
  }

  function handleInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    setNewPerson((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }
  async function handleSave() {
    const newData = {
      noDocumento: newPerson.noDocumento,
      tipoDocumento: newPerson.tipoDocumento,
      nombre: newPerson.nombre,
      apellidos: newPerson.apellidos,
      fechaNacimiento: newPerson.fechaNacimiento,
    };
    console.log(newData);
    // const finalPlans = await getPlansByInsurance(insurancegetid(inputInsurance, newPerson.aseguradora))
   
    // setFilteredPlans(finalPlans)
    const newPersonadded = await addPerson(newData);
    console.log(newPersonadded)

    const response = await addPersonPlan({
      idPersona: newPersonadded.idPersona,
      idPlan: plangetid(inputPlan, newPerson.personaPlans),
      fechaVencimiento: newPerson.fechaVencimientoPlan,
    }).then((data) =>
      setTableData((prevValue) => {
        return [
          ...prevValue,
          {
            ...newData,
            personaPlans: plangetName(inputPlan, data.idPlan),
          },
        ];
      })
    );

    setNewPerson(initialState);
  }
  function handleEdit(data) {
    EditEntityDialog.current.showModal();
    setNewPerson(data);
  }

  async function handleUpdate() {
    const entityToUpdate = tableData.find(
      (entity) => newPerson.id === entity.id
    );
    const updatedPerson = await editPerson(entityToUpdate.id, {
      ...newPerson,
      personaPlans: plangetid(inputPlan, newPerson.personaPlans),
    }).then(
      setTableData((prevValue) =>
        prevValue.map((person) =>
          person.id === entityToUpdate.id ? { ...newPerson } : person
        )
      )
    );
    console.log(updatedPerson);
  }
  function handleOpenDeleteModal(id) {
    DeleteEntityDialog.current.showModal();
    setId(id);
  }
  async function handleDelete() {
    const response = await deletePerson(id).then(
      setTableData(tableData.filter((data) => data.id != id))
    );
  }
  const handleNewPage = (e, newPage)=>{
    setPage(newPage)
  }

  const handlePageSize=(e)=>{
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }

  const handleSearch =(e)=>{
    setSearch(e.target.value);
  }

  return (
    <PageLayout
      pageMainTitle={t('peoplePage.title')}
      pageMainbuttonDescription={t('peoplePage.addButton')}
      pageMainbuttonIcon={<EmojiPeopleIcon />}
      onAdd={() => {
        setNewPerson(initialState);
        AddEntityDialog.current.showModal();
      }}
      handleSearch={handleSearch}
    >
      <AddEntityModal ref={AddEntityDialog} title={t('peoplePage.addButton')}>
        <ModalComboBox
          title={t('peoplePage.tableHeaderDocumentType')}
          options={["Selecciona..", "CEDULA"]}
          value={newPerson.tipoDocumento}
          name={"tipoDocumento"}
          onChange={handleInput}
        />
        <ModalInput
          label={t('peoplePage.tableHeaderDocumentNumber')}
          type={"text"}
          placeholder={t('peoplePage.modalPlaceholderDocumentNumber')}
          onChange={handleInput}
          name={"noDocumento"}
          value={newPerson.noDocumento}
        />
        <ModalInput
          label={t('peoplePage.tableHeaderName')}
          type={"text"}
          placeholder={t('peoplePage.modalPlaceholderName')}
          onChange={handleInput}
          name={"nombre"}
          value={newPerson.nombre}
        />
        <ModalInput
          label={t('peoplePage.tableHeaderLastNames')}
          type={"text"}
          placeholder={t('peoplePage.modalPlaceholderLastNames')}
          onChange={handleInput}
          name={"apellidos"}
          value={newPerson.apellidos}
        />
        <ModalInput
          label={t('peoplePage.tableHeaderBirthDate')}
          type={"date"}
          onChange={handleInput}
          name={"fechaNacimiento"}
          value={newPerson.fechaNacimiento}
        />
         <ModalComboBox
          title={t('peoplePage.tableHeaderInsurance')}
          options={[
            "Selecciona..",
            ...inputInsurance.map((insurance) => insurance.nombre),
          ]}
          value={newPerson.aseguradora}
          name={"aseguradora"}
          onChange={handleInput}
        />
        <ModalComboBox
          title={t('peoplePage.tableHeaderPlan')}
          options={[
            "Selecciona..",
           ...inputPlan.map((plan) => plan.descripcion),
          ]}
          value={newPerson.personaPlans}
          name={"personaPlans"}
          onChange={handleInput}
        />
        {/* <ModalInput
          label={"Fecha Vencimiento Plan"}
          type={"date"}
          onChange={handleInput}
          name={"fechaVencimiento"}
          value={newPerson.fechaVencimiento}
        /> */}

        <ModalButtons onSave={handleSave} action={t('modalButton.save')} />
      </AddEntityModal>
      <EditEntityModal ref={EditEntityDialog} title={t('peoplePage.editButton')}>
      <ModalComboBox
          title={t('peoplePage.tableHeaderDocumentType')}
          options={["Selecciona..", "CEDULA"]}
          value={newPerson.tipoDocumento}
          name={"tipoDocumento"}
          onChange={handleInput}
        />
        <ModalInput
          label={t('peoplePage.tableHeaderDocumentNumber')}
          type={"text"}
          placeholder={t('peoplePage.modalPlaceholderDocumentNumber')}
          onChange={handleInput}
          name={"noDocumento"}
          value={newPerson.noDocumento}
        />
        <ModalInput
          label={t('peoplePage.tableHeaderName')}
          type={"text"}
          placeholder={t('peoplePage.modalPlaceholderName')}
          onChange={handleInput}
          name={"nombre"}
          value={newPerson.nombre}
        />
        <ModalInput
          label={t('peoplePage.tableHeaderLastNames')}
          type={"text"}
          placeholder={t('peoplePage.modalPlaceholderLastNames')}
          onChange={handleInput}
          name={"apellidos"}
          value={newPerson.apellidos}
        />
        <ModalInput
          label={t('peoplePage.tableHeaderBirthDate')}
          type={"date"}
          onChange={handleInput}
          name={"fechaNacimiento"}
          value={newPerson.fechaNacimiento}
        />
         {/* <ModalComboBox
          title={t('peoplePage.tableHeaderInsurance')}
          options={[
            "Selecciona..",
            ...inputInsurance.map((insurance) => insurance.nombre),
          ]}
          value={newPerson.aseguradora}
          name={"aseguradora"}
          onChange={handleInput}
        /> */}
        <ModalComboBox
          title={t('peoplePage.tableHeaderPlan')}
          options={[
            "Selecciona..",
           ...inputPlan.map((plan) => plan.descripcion),
          ]}
          value={newPerson.personaPlans}
          name={"personaPlans"}
          onChange={handleInput}
        />
        {/* <ModalInput
          label={"Fecha Vencimiento Plan"}
          type={"date"}
          onChange={handleInput}
          name={"fechaVencimiento"}
          value={newPerson.fechaVencimiento}
        /> */}
        <ModalButtons onSave={handleUpdate} action={t('modalButton.edit')} />
      </EditEntityModal>

      <DeleteEntityModal ref={DeleteEntityDialog} onDelete={handleDelete} />
      <MainTable
        headers={[
          t('peoplePage.tableHeaderDocumentNumber'),
          t('peoplePage.tableHeaderDocumentType'),
          t('peoplePage.tableHeaderName'),
          t('peoplePage.tableHeaderLastNames'),
          t('peoplePage.tableHeaderBirthDate'),
          t('peoplePage.tableHeaderPlan'),
          t('peoplePage.tableHeaderActions'),
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
