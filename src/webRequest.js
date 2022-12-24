import axios from "axios";

export const post = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    return console.error(error);
  }
};

export const get = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return console.error(error);
  }
};

export const DELETE = async (id) => {
  try {
    const response = await axios.delete(id);
    if (response.data.code === 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    return console.error(error);
  }
};

export const put = async (url, data) => {
  try {
    const response = await axios.put(url, data);
    if (response.data.code === 200) {
    } else {
    }
    return response;
  } catch (error) {
    return console.error(error);
  }
};
