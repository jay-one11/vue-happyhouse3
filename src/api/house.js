import { apiInstance, houseInstance } from "./index.js";

const api = apiInstance();
const house = houseInstance();

function sidoList(success, fail) {
  api.get(`/map/sido`).then(success).catch(fail);
}

function gugunList(params, success, fail) {
  api.get(`/map/gugun`, { params: params }).then(success).catch(fail);
}

function houseList(params, success, fail) {
  house.get(``, { params: params }).then(success).catch(fail);
}

function findStarbucks(params, success, fail) {
  api.get(`/map/starbucks`, { params: params }).then(success).catch(fail);
}

function coronaList(params, success, fail) {
  api.get(`/map/corona`, { params: params }).then(success).catch(fail);
}

export { sidoList, gugunList, houseList, findStarbucks, coronaList };
