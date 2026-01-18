// src/api/worker.js
import api from "./workerAxios";

export const fetchTodayOrders = async () => {
  const res = await api.get("today-orders/");
  return res.data;
};

export const updateOrderStatus = async (orderId) => {
  const res = await api.post(`update-status/${orderId}/`);
  return res.data;
};

export const fetchTodayMenu = async () => {
  const res = await api.get("today-menu/");
  return res.data;
};

export const toggleMenuAvailability = async (id) => {
  const res = await api.post(`menu-toggle/${id}/`);
  return res.data;
};
