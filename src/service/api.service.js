import { get, post } from "../webRequest";
import { ENDPOINTURL } from "./helper";

export const loginHandler = (body) => {
  return post(`${ENDPOINTURL}/employee/login`, body);
};

export const namehandler = (uuid) => {
  return get(`${ENDPOINTURL}/employee/emp?uuid=${uuid}`);
};
