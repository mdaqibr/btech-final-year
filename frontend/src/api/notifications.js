import api from "./axios";

export const fetchNotifications = async () => {
  const res = await api.get("/notifications/my/");
  return res.data;
};

export const markAsRead = async (id) => {
  return api.post(`/notifications/read/${id}/`);
};
