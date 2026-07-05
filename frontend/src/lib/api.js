import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const createQuotation = async (payload) => {
  const { data } = await api.post("/quotations", payload);
  return data;
};

export const listQuotations = async () => {
  const { data } = await api.get("/quotations");
  return data;
};

export const getQuotation = async (id) => {
  const { data } = await api.get(`/quotations/${id}`);
  return data;
};

export const deleteQuotation = async (id) => {
  const { data } = await api.delete(`/quotations/${id}`);
  return data;
};
