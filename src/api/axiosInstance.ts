import axios from "axios";

// 1. Create the instance
const axiosInstance = axios.create({
  // baseURL: "http://192.168.11.150:4000/",
  // baseURL: "http://192.168.11.245:4000/",
  // baseURL: "https://konverthrnode.onrender.com/",
  // baseURL: "http://178.236.185.232/",
  // baseURL: "http://178.236.185.232:4001/",
  // baseURL: "https://www.api.konverthr.com/",
  baseURL: "https://staging.konverthr.com/",

  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Helper function to get a new token safely
// We use a separate 'axios' call here to avoid infinite loops
const getFreshToken = async () => {
  try {
    console.log("🔄 Token invalid or missing. Fetching a new one...");
    const response = await axios.post(
      // "http://192.168.11.150:4000/api/auth",
      // "http://192.168.11.245:4000/api/auth",
      // "http://178.236.185.232/api/auth",
      // "https://konverthrnode.onrender.com/api/auth",
      // "http://178.236.185.232:4001/api/auth",
      // "https://www.api.konverthr.com/api/auth",
      "https://staging.konverthr.com/api/auth",
      { user_name: "dhaval" },
      { headers: { "Content-Type": "application/json" } },
    );

    const newToken = response.data.token;

    if (newToken) {
      localStorage.setItem("token", newToken);
      console.log("✅ New token saved:", newToken);
      return newToken;
    }
  } catch (error) {
    console.error("❌ Failed to refresh token:", error);
  }
  return null;
};

// --- REQUEST INTERCEPTOR ---
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");

    // If no token exists locally, try to get one immediately
    if (!token || token === "undefined") {
      token = await getFreshToken();
    }

    // Attach the token if we have one
    if (token) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// --- RESPONSE INTERCEPTOR (THE FIX) ---
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 (Unauthorized) AND we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn("⚠️ 401 Auth Error detected. Retrying with fresh token...");

      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true;

      // 1. Clear the invalid token
      localStorage.removeItem("token");

      // 2. Get a new fresh token
      const newToken = await getFreshToken();

      if (newToken) {
        // 3. Update the header for the failed request
        originalRequest.headers.Authorization = `${newToken}`;

        // 4. Retry the original request with the new token
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

// ===============================================================================New Upadated code fornthe axios instance ============================================================
// import axios from "axios";

// const axiosInstance = axios.create({
//   // baseURL: "http://192.168.11.150:4000/",
//   // baseURL: "http://178.236.185.232:4000/",
//   // baseURL: "https://konverthrnode.onrender.com",
//   // baseURL: "https://konverthrnode.onrender.com",
//   // baseURL: "https://www.api.konverthr.com/",
//   baseURL: "https://staging.konverthr.com/",

//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// axiosInstance.interceptors.request.use(
//   async (config) => {
//     let token = localStorage.getItem("token");

//     // If no token → get a new one
//     if (!token || token === "undefined") {
//       try {
//         const response = await axios.post(
//           // "http://192.168.11.150:4000/api/auth",
//           //  "http://178.236.185.232/api/auth",
//           // "https://konverthrnode.onrender.com/api/auth",
//           // "https://www.api.konverthr.com/api/auth",
//           "https://staging.konverthr.com/api/auth",

//           { user_name: "dhaval" },
//           { headers: { "Content-Type": "application/json" } }, // prevent interceptor reuse
//         );

//         token = response.data.token;

//         if (token) {
//           localStorage.setItem("token", token);
//           console.log("🔑 Saved new token:", token);
//         } else {
//           console.error("❌ Token missing from response");
//         }
//       } catch (error) {
//         console.error("❌ Failed to get token:", error);
//       }
//     }

//     // Attach valid token
//     if (token && token !== "undefined") {
//       config.headers.Authorization = `${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// export default axiosInstance;

// ================================================================================================================================================================================================

// import axios from "axios";

// const axiosInstance = axios.create({
// baseURL: "http://192.168.10.251:4000/",
// headers: {
// "Content-Type": "application/json",
// },
// });

// // 🔐 Automatically add token before each request
// axiosInstance.interceptors.request.use(
// async (config) => {
// let token = localStorage.getItem("token") || null;

// if (!token) {
// try {
// const response = await axios.post(
// "http://192.168.10.251:4000/api/auth", // 👈 fixed URL
// { user_name: "dhaval" },
// { headers: { "Content-Type": "application/json" } } // prevent interceptor reuse
// );

// token = response.data.token;
// if (token) localStorage.setItem("token", token);

// console.log("🔑 Token fetched:", token);
// } catch (error) {
// console.error("❌ Failed to get token from /api/auth:", error);
// }
// }

// if (token && token !== "undefined") {
// config.headers.Authorization = `Bearer ${token}`;
// }

// return config;
// },
// (error) => Promise.reject(error)
// );

// export default axiosInstance;
