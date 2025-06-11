import instance from "../instance.js";

//get all
const getAll = async (endpoint) => {
  try {
    let response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    return error;
  }
};

//get by id
const getOne = async (endpoint, id) => {
  try {
    let response = await instance.get(endpoint + `/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

//post
const post = async (endpoint, newData) => {
  try {
    let response = await instance.post(endpoint, newData);
    return response;
  } catch (error) {
    return error;
  }
};

//delete
const deleteData = async (endpoint, id) => {
  try {
    let response = await instance.delete(endpoint + `/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

//update - patch
const patch = async (endpoint, id, updatedData) => {
  try {
    let response = await instance.patch(endpoint + `/${id}`, updatedData);
    return response;
  } catch (error) {
    return error;
  }
};

const controller = {
  getAll: getAll,
  getOne: getOne,
  post: post,
  delete: deleteData,
  update: patch,
};

export default controller;
