// src / api / order.js;
import api from "./axios";

export const addToCart = (item_id, qty) =>
  api.post("/order/cart/add/", { item_id, qty });

export const getCart = () => api.get("/order/cart/");

export const removeFromCart = (cart_item_id) =>
  api.post("/order/cart/remove/", { cart_item_id });

export const updateCartQty = (cart_item_id, qty) =>
  api.post("/order/cart/update/", { cart_item_id, qty });

export const createOrder = (payload) => api.post("/order/create/", payload);
export const verifyPayment = (data) => api.post("/order/verify/", data);

export const getMyOrders = ({ page = 1, page_size = 5 } = {}) =>
  api.get("/order/my-orders/", { params: { page, page_size } });

export const cancelOrder = (orderId) =>
  api.post(`/order/cancel/${orderId}/`);

export const submitFeedback = (orderId, data) =>
  api.post(`/order/feedback/${orderId}/`, data);

export const getTodayFeedback = () => api.get("/order/today-feedback/");
export const getFoodFeedback = (foodId) =>
  api.get(`/order/food-feedback/${foodId}/`);