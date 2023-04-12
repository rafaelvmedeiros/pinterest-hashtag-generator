import { Axios } from "axios";

const api = new Axios({
  timeout: 600000,
  baseURL: "https://api.vackao.com/v1/api/",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
