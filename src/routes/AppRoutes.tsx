import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Services from "../components/marketing/Services";
import Team from "../components/marketing/Team";
import Pricing from "../components/marketing/Pricing";
import Testimonials from "../components/marketing/Testimonials";
import Contact from "../components/marketing/Contact";
import NotFound from "../components/marketing/NotFound";
import Home from "../pages/Home";
import PaymentSuccess from "../components/marketing/PaymentSuccess";
import Checkout from "../components/marketing/Checkout";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ActivateAccount from "../pages/ActivateAccount";
import ProtectedRoute from "../components/ProtectedRoute";
import TestAPI from "../pages/TestAPI";
import { ToastProvider } from "../components/common/ToastContext";
import { AuthProvider } from "../context/AuthContext";
import ForgotPasswordEmail from "../pages/ForgotPasswordEmail";
import ResetPassword from "../pages/ResetPassword";
import GuestRoute from "./GuestRoute";
import SubscriptionHistory from "../pages/SubscriptionHistory";
import ProfileDashboard from "../pages/ProfileDashboard";
import SendOtp from "../pages/sendOtp";
import VerifyOtp from "../pages/VerifyOTP";
import UpdateContact from "../pages/UpdateContact";
import ScrollToTop from "../components/common/ScrollToTop"; // ✅ Import here

export default function AppRoutes() {
  return (
    <BrowserRouter>
      {/* ✅ Add ScrollToTop here so it runs on every route change */}
      <ScrollToTop />

      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* ALL routes are now nested inside MainLayout */}
            <Route element={<MainLayout />}>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/team" element={<Team />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/subscription" element={<SubscriptionHistory />} />
              <Route path="/profile" element={<ProfileDashboard />} />
              <Route path="/send-otp" element={<SendOtp />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/update-contact" element={<UpdateContact />} />

              {/* Auth-related routes */}
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
              />

              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <Register />
                  </GuestRoute>
                }
              />

              <Route
                path="/forgot-password"
                element={
                  <GuestRoute>
                    <ForgotPasswordEmail />
                  </GuestRoute>
                }
              />

              <Route
                path="/forgot-password/reset"
                element={
                  <GuestRoute>
                    <ResetPassword />
                  </GuestRoute>
                }
              />

              <Route path="/activate" element={<ActivateAccount />} />
              <Route path="/test" element={<TestAPI />} />

              {/* Protected routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-success"
                element={
                  <ProtectedRoute>
                    <PaymentSuccess />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import MainLayout from "../layouts/MainLayout";
// import Services from "../components/marketing/Services";
// import Team from "../components/marketing/Team";
// import Pricing from "../components/marketing/Pricing";
// import Testimonials from "../components/marketing/Testimonials";
// import Contact from "../components/marketing/Contact";
// import NotFound from "../components/marketing/NotFound";
// import Home from "../pages/Home";
// import PaymentSuccess from "../components/marketing/PaymentSuccess";
// import Checkout from "../components/marketing/Checkout";
// import Register from "../pages/Register";
// import Login from "../pages/Login";
// import ActivateAccount from "../pages/ActivateAccount";
// import ProtectedRoute from "../components/ProtectedRoute";
// import TestAPI from "../pages/TestAPI";
// import { ToastProvider } from "../components/common/ToastContext";
// import { AuthProvider } from "../context/AuthContext";
// // import ForgotPassword from "../pages/ForgotPassword";
// import ForgotPasswordEmail from "../pages/ForgotPasswordEmail";
// import ResetPassword from "../pages/ResetPassword";
// import GuestRoute from "./GuestRoute";
// import SubscriptionHistory from "../pages/SubscriptionHistory";
// import ProfileDashboard from "../pages/ProfileDashboard";
// import SendOtp from "../pages/sendOtp";
// import VerifyOtp from "../pages/VerifyOTP";
// import UpdateContact from "../pages/UpdateContact";

// export default function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <ToastProvider>
//           <Routes>
//             {/* ALL routes are now nested inside MainLayout */}
//             <Route element={<MainLayout />}>
//               {/* Public routes */}
//               <Route path="/" element={<Home />} />
//               <Route path="/services" element={<Services />} />
//               <Route path="/team" element={<Team />} />
//               <Route path="/pricing" element={<Pricing />} />
//               <Route path="/testimonials" element={<Testimonials />} />
//               <Route path="/contact" element={<Contact />} />
//               <Route path="/subscription" element={<SubscriptionHistory />} />
//               <Route path="/profile" element={<ProfileDashboard />} />
//               <Route path="/send-otp" element={<SendOtp />} />
// <Route path="/verify-otp" element={<VerifyOtp />} />
// <Route path="/update-contact" element={<UpdateContact />} />

//               {/* Auth-related routes */}
//               <Route
//                 path="/login"
//                 element={
//                   <GuestRoute>
//                     <Login />
//                   </GuestRoute>
//                 }
//               />

//               <Route
//                 path="/register"
//                 element={
//                   <GuestRoute>
//                     <Register />
//                   </GuestRoute>
//                 }
//               />

//               {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
//               <Route
//                 path="/forgot-password"
//                 element={
//                   <GuestRoute>
//                     <ForgotPasswordEmail />
//                   </GuestRoute>
//                 }
//               />

//               <Route
//                 path="/forgot-password/reset"
//                 element={
//                   <GuestRoute>
//                     <ResetPassword />
//                   </GuestRoute>
//                 }
//               />

//               <Route path="/activate" element={<ActivateAccount />} />
//               <Route path="/test" element={<TestAPI />} />

//               {/* Protected routes */}
//               <Route
//                 path="/checkout"
//                 element={
//                   <ProtectedRoute>
//                     <Checkout />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/payment-success"
//                 element={
//                   <ProtectedRoute>
//                     <PaymentSuccess />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route path="*" element={<NotFound />} />
//             </Route>
//           </Routes>
//         </ToastProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }
