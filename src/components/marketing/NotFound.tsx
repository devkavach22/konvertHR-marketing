import { NavLink } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-pink-600 mb-4">404</h1>
      <p className="text-gray-600 mb-6">Oops! Page not found.</p>
      <NavLink
        to="/"
        className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
      >
        Go Home
      </NavLink>
    </div>
  );
}
