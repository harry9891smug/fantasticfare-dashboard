import axios from 'axios';

const API_URL = 'http://3.110.136.78:8000/api'; // Change to your API base URL

export const getPackages = async (token: string) => {
  return axios.get(`${API_URL}/list-packages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createPackage = async (data: object, token: string) => {
  return axios.post(`${API_URL}/createAndUpdate-package`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createAddon = async (data: object, token: string) => {
  return axios.post(`${API_URL}/create-addon`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createItinerary = async (data: object, token: string) => {
  return axios.post(`${API_URL}/createAndUpdate-itinerary`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createActivity = async (data: object, token: string) => {
  return axios.post(`${API_URL}/createAndUpdate-activity`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createStay = async (data: object, token: string) => {
  return axios.post(`${API_URL}/createAndUpdate-stays`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createInclusion = async (data: object, token: string) => {
  return axios.post(`${API_URL}/createAndUpdate-inclusions`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createFAQ = async (data: object, token: string) => {
  return axios.post(`${API_URL}/createAndUpdate-faq`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
