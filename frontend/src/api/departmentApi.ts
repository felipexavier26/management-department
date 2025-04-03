import axios from "axios";

const API_URL = "http://localhost:8000/api/departments";

export const getDepartments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createDepartment = async (data: { name: string; parent_department_id?: number }) => {
  return axios.post(API_URL, data);
};

export const updateDepartment = async (id: number, data: { name: string }) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const deleteDepartment = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};
