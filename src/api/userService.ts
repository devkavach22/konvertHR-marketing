import axiosInstance from "./axiosInstance";

export const getTestData = async () => {
  // Replace with any working endpoint on your Odoo server
  const response = await axiosInstance.get("/api/test");
  return response.data;
};
