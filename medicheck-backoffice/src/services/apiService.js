import axios from "axios";
import { API_BASE_URL, LOGIN_ENDPOINT } from "../constants/apiEndpoints";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (credentials) => {
  try {
    const payload = {
      noDocumento: credentials.noDocumento,
      tipoDocumento: credentials.tipoDocumento,
      clave: credentials.clave,
    };

    const response = await axiosInstance.post(LOGIN_ENDPOINT, payload);
    return response.data; // Contains accessToken and other response data
  } catch (error) {
    // Handle or throw error as needed
    throw error;
  }
};

export const getInsurances = async (pageIndex, pageSize, search) => {
  const token = localStorage.getItem("token");
  const parameters = pageIndex
    ? `?pageIndex=${pageIndex}&pageSize=${
        pageSize || undefined
      }&search=${search}`
    : "";
  try {
    const response = await axiosInstance.get(`/aseguradoras${parameters}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const editInsurances = async (id, newObject) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.put(`/aseguradoras/${id}`, newObject, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteInsurances = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.delete(`/aseguradoras/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addInsurance = async (insuranceData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.post("/aseguradoras", insuranceData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // O manejar la respuesta como prefieras
  } catch (error) {
    console.error("Hubo un error al guardar la aseguradora: ", error);
    // Aquí puedes manejar el error, mostrar un mensaje al usuario, etc.
  }
};

export const getProducts = async (pageIndex, pageSize, search, tipo) => {
  console.log(tipo);
  console.log(search);
  const token = localStorage.getItem("token");
  const parameters =
    pageIndex
      ? `?pageIndex=${pageIndex}&pageSize=${
          pageSize || undefined
        }&search=${search}`
      : "";

  const filter = tipo && `&idTipo=${tipo}`
  try {
    const response = await axiosInstance.get(`/productos${parameters}${filter}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addProduct = async (productData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.post("/productos", productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.delete(`/productos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const editProduct = async (id, newObject) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.put(`/productos/${id}`, newObject, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getEstablishment = async (pageIndex, pageSize, search, type) => {
  const token = localStorage.getItem("token");
  const parameters = pageIndex
    ? `?pageIndex=${pageIndex}&pageSize=${
        pageSize || undefined
      }&search=${search}&tipo=${type}`
    : "";
  try {
    const response = await axiosInstance.get(`/establecimientos${parameters}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getEstablishmentById = async (id) => {
  const token = localStorage.getItem("token");
 
  try {
    const response = await axiosInstance.get(`/establecimientos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addEstablishment = async (establishmentData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.post(
      "/establecimientos",
      establishmentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const editEstablishment = async (id, newObject) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.put(
      `/establecimientos/${id}`,
      newObject,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteEstablishment = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.delete(`/establecimientos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async (pageIndex, pageSize, search, rol) => {
  const token = localStorage.getItem("token");
  const parameters = pageIndex
    ? `?pageIndex=${pageIndex}&pageSize=${
        pageSize || undefined
      }&search=${search}&rol=${rol}`
    : "";
  try {
    const response = await axiosInstance.get(`/usuarios${parameters}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserByid = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.get(`/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addUser = async (userData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.post("/usuarios", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const editUser = async (id, newObject) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.put(`/usuarios/${id}`, newObject, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteUser = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.delete(`/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPeople = async (pageIndex, pageSize, search) => {
  const token = localStorage.getItem("token");
  const parameters = pageIndex
    ? `?pageIndex=${pageIndex}&pageSize=${
        pageSize || undefined
      }&search=${search}`
    : "";
  try {
    const response = await axiosInstance.get(`/personas${parameters}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addPerson = async (personData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.post("/personas", personData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const editPerson = async (id, newObject) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.put(`/personas/${id}`, newObject, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPersonPlanByid = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.get(`/personaplan/persona/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addPersonPlan = async (personPlanData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.post("/personaplan", personPlanData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deletePerson = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.delete(`/personas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// export const getUsersPlan = async ()=>{
//   const token = localStorage.getItem("token");

// }

export const getCoverages = async (
  pageIndex,
  pageSize,
  search,
  grupo,
  subgrupo
) => {
  const token = localStorage.getItem("token");

  const parameters =
    pageIndex 
      ? `?pageIndex=${pageIndex}&pageSize=${
          pageSize || undefined
        }&search=${search}`
      : "";
  const grupoFilter = grupo? `&idGrupo=${grupo}`: "";
  const subGrupoFilter = subgrupo? `&idSubgrupo=${subgrupo}`: "";
  try {
    const response = await axiosInstance.get(`/coberturas${parameters}${grupoFilter}${subGrupoFilter}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const addCoverages = async (coverageData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.post("/coberturas", coverageData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const editCoverage = async (id, newObject) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.put(`/coberturas/${id}`, newObject, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCoverage = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.delete(`/coberturas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPlans = async (pageIndex, pageSize, search, regimen) => {
  const token = localStorage.getItem("token");
  const parameters = pageIndex
    ? `?pageIndex=${pageIndex}&pageSize=${
        pageSize || undefined
      }&search=${search}`
    : "";
  const filter = regimen && `&idRegimen=${regimen}`
  console.log(regimen)
  try {
    const response = await axiosInstance.get(`/planes${parameters}${filter}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getPlansByInsurance = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.get(`/planes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addPlans = async (plansData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.post("/planes", plansData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const editPlans = async (id, newObject) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.put(`/planes/${id}`, newObject, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deletePlans = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.delete(`/planes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getIncidents = async (
  pageIndex,
  pageSize,
  search,
  statusFilter
) => {
  const token = localStorage.getItem("token");
  const parameters = pageIndex
    ? `?pageIndex=${pageIndex}&pageSize=${
        pageSize || undefined
      }&search=${search}&estado=${statusFilter}`
    : "";
  try {
    const response = await axiosInstance.get(
      `/reportesincidentes${parameters}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addIncidents = async (incidentsData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.post(
      "/reportesincidentes",
      incidentsData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const editIncidents = async (id, newObject) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.put(
      `/reportesincidentes/${id}`,
      newObject,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteIncidents = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.delete(`/reportesincidentes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getDashboardStatistics = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.get("/dashboard/statistics", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const sendOtpEmail = async (email) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axiosInstance.get(
      `/otp-send-email?emailAddress=${email}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const validateOtpCode = async (email, otpCode) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axiosInstance.get(
      `/otp-validate?emailAdress=${email}&token=${otpCode}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const resetPasswordOtp = async (email, otpCode, newPassword) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axiosInstance.patch(
      `/otp-reset-password?emailAddress=${email}&token=${otpCode}&newPassword=${newPassword}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getCoverageType = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.get("/tipocobertura", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getGroups = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.get("/grupos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getSubGroups = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.get("/subgrupos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getRegime = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.get("/regimen", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};