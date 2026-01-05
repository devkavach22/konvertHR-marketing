import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://192.168.11.150:4000/",
  baseURL: "http://178.236.185.232:4000/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");

    // If no token → get a new one
    if (!token || token === "undefined") {
      try {
        const response = await axios.post(
          // "http://192.168.11.150:4000/api/auth",
          "http://178.236.185.232:4000/api/auth",

          { user_name: "dhaval" },
          { headers: { "Content-Type": "application/json" } } // prevent interceptor reuse
        );

        token = response.data.token;

        if (token) {
          localStorage.setItem("token", token);
          console.log("🔑 Saved new token:", token);
        } else {
          console.error("❌ Token missing from response");
        }
      } catch (error) {
        console.error("❌ Failed to get token:", error);
      }
    }

    // Attach valid token
    if (token && token !== "undefined") {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://192.168.10.251:4000/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 🔐 Automatically add token before each request
// axiosInstance.interceptors.request.use(
//   async (config) => {
//     let token = localStorage.getItem("token") || null;

//     if (!token) {
//       try {
//         const response = await axios.post(
//           "http://192.168.10.251:4000/api/auth", // 👈 fixed URL
//           { user_name: "dhaval" },
//           { headers: { "Content-Type": "application/json" } } // prevent interceptor reuse
//         );

//         token = response.data.token;
//         if (token) localStorage.setItem("token", token);

//         console.log("🔑 Token fetched:", token);
//       } catch (error) {
//         console.error("❌ Failed to get token from /api/auth:", error);
//       }
//     }

//     if (token && token !== "undefined") {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;
