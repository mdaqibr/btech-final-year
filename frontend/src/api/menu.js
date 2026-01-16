// src / api / menu.js;
import api from "./axios";

// Get floor foods
export const getFloorFoods = (floorId) =>
  api.get(`menu/floor-foods/${floorId}/`);

// Get or create DailyMenu for floor+day
export const getDailyMenu = (floorId, weekDay) =>
  api.get(`/menu/daily-menu/?floor=${floorId}&week_day=${weekDay}`);

// Save DailyMenuItem (create)
export const saveMenuItem = (payload) =>
  api.post("/menu/daily-menu-items/manage/", payload);

// Update DailyMenuItem
export const updateMenuItem = (id, payload) =>
  api.patch(`/menu/daily-menu-items/manage/${id}/`, payload);

// Delete DailyMenuItem
export const deleteDailyMenuItem = (id) =>
  api.delete(`/menu/daily-menu-items/${id}/delete/`);

// SPECIAL FOODS.
export const getSpecialFoods = (floorId) =>
  api.get(`/menu/special-food/?floor=${floorId}`);

export const addSpecialFood = (payload) =>
  api.post("/menu/special-food/", payload);

export const updateSpecialFood = (id, payload) =>
  api.patch(`/menu/special-food/${id}/`, payload);

export const deleteSpecialFood = (id) =>
  api.delete(`/menu/special-food/${id}/`);
