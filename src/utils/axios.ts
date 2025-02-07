import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const normalAxios = axios.create();
const mockAxios = axios.create();

export const mockAdapter = new AxiosMockAdapter(mockAxios, {
  delayResponse: 750,
});

export default import.meta.env.MODE === "development" ? mockAxios : normalAxios;
