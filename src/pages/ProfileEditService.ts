// import axiosInstance from "../utils/axiosInstance";

// /* ================= TYPES ================= */

// export interface ProfileData {
//   user_id: number;
//   first_name: string;
//   last_name: string;
//   email: string;
//   mobile: string;
//   designation: string;
//   company_name: string;
//   gst_number: string;
//   company_address: string;
//   street: string;
//   street2?: string;
//   city: string;
//   state_id: number;
//   country_id: number;
//   pincode: string;
// }

// /* ================= GET PROFILE ================= */

// export const getUserProfile = async (): Promise<ProfileData> => {
//   const userId = localStorage.getItem("userId");

//   if (!userId) {
//     throw new Error("User ID not found");
//   }

//   const res = await axiosInstance.get("/api/user/getUserProfile", {
//     params: { user_id: userId },
//   });

//   return res.data?.data;
// };

// /* ================= UPDATE PROFILE ================= */
// /* Editable fields ONLY */

// export interface UpdateProfilePayload {
//   company_name: string;
//   company_address: string;
//   street: string;
//   street2?: string;
//   city: string;
//   state_id: number;
//   country_id: number;
//   pincode: string;
// }

// export const updateUserProfile = async (
//   payload: UpdateProfilePayload
// ): Promise<void> => {
//   const userId = localStorage.getItem("userId");

//   if (!userId) {
//     throw new Error("User ID not found");
//   }

//   await axiosInstance.post("/user/updateUserProfile", {
//     user_id: Number(userId),
//     ...payload,
//   });
// };

// /* ================= CHANGE PASSWORD ================= */

// export interface ChangePasswordPayload {
//   old_password: string;
//   new_password: string;
// }

// export const changeUserPassword = async (
//   payload: ChangePasswordPayload
// ): Promise<void> => {
//   const userId = localStorage.getItem("userId");

//   if (!userId) {
//     throw new Error("User ID not found");
//   }

//   await axiosInstance.post("/api/user/changePassword", {
//     user_id: Number(userId),
//     ...payload,
//   });
// };

import axiosInstance from "../api/axiosInstance";

export interface ProfilePayload {
  first_name: string;
  last_name: string;
  mobile: string;
  designation: string;
  company_name: string;
  gst_number: string;
  street: string;
  street2?: string;
  city: string;
  state_id: number;
  country_id: number;
  pincode: string;
  email: string;
}

// export const updateProfile = async (payload: ProfilePayload) => {
//   const res = await axiosInstance.put("/api/updateProfile", payload);
//   return res.data;
// };

export const updateProfile = async (payload: ProfilePayload) => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    throw new Error("User ID not found");
  }

  const res = await axiosInstance.put(
    "api/user/updateUserProfile", // ✅ MATCHES ROUTE
    payload,
    {
      params: { userId },
    }
  );

  return res.data;
};

