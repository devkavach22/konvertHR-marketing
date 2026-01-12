import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import logo from "../../assets/img/konvertr hr-logo.png"; // ✅ adjust path
import { Link } from "react-router-dom";

// Custom X (Twitter) icon
const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialIcons = [
  { Icon: Facebook, label: "Facebook" },
  { Icon: Instagram, label: "Instagram" },
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: XIcon, label: "X" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden text-gray-700">
      {/* === Top CTA Section === */}
      <div className="bg-[#E42128] text-white py-14 px-6 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to <span className="text-white">Simplify HR</span> and Empower
            Your Workforce?
          </h2>
          <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
            Join hundreds of businesses already running seamless payroll and
            workforce automation with{" "}
            <span className="font-semibold">Konvert HR</span>.
          </p>
          {/* <button className="inline-flex items-center gap-2 bg-white text-[#E42128] px-6 py-3 rounded-full font-semibold hover:bg-[#ffe6e6] transition-all">
            Request a Free Demo <ArrowRight size={18} />
          </button> */}
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#E42128] px-6 py-3 rounded-full font-semibold hover:bg-[#ffe6e6] transition-all"
          >
            Request a Free Demo <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* === Main Footer === */}
      <div className="relative bg-gradient-to-b from-white to-[#FFF6F6] pt-20 pb-10 px-6">
        {/* Glow Backgrounds */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#E42128]/10 blur-3xl rounded-full -z-10"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#E42128]/10 blur-3xl rounded-full -z-10"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 border-b border-gray-200 pb-10">
          {/* === Brand === */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-5">
              <img src={logo} alt="Konvert HR Logo" className="h-10 w-auto" />
              {/* <h2 className="text-2xl font-bold text-[#E42128]">
                Konvert HR
              </h2> */}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-sm">
              Konvert HR is your all-in-one HR, Payroll, and Compliance
              automation suite — built for teams that value accuracy,
              efficiency, and growth.
            </p>

            <div className="flex space-x-4 mt-6">
              {socialIcons.map(({ Icon, label }, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={label}
                  className="p-2 rounded-full border border-gray-300 hover:bg-[#E42128] hover:text-white text-gray-700 transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* === Products === */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-[#E42128] transition">
                  Payroll Automation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#E42128] transition">
                  Attendance & Leave Mgmt
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#E42128] transition">
                  Employee Self Service (ESS)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#E42128] transition">
                  Performance Tracking
                </a>
              </li>
            </ul>
          </div>

          {/* === Company === */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-[#E42128] transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#E42128] transition">
                  Career Opportunities
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-[#E42128] transition">
                  Blog & Insights
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#E42128] transition">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* === Contact === */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-[#E42128] mt-1" />
                <span>
                  Cross Road, A-53, New York Tower-A, Sarkhej - Gandhinagar Hwy,
                  Thaltej, Ahmedabad, Gujarat 380054
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-[#E42128] mt-1" />
                {/* <span>+91 98765 43210</span> */}
                <span>+91 072288 88904</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-[#E42128] mt-1" />
                <span>support@konverthr.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* === Bottom Bar === */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-[#E42128] font-semibold">Konvert HR</span> —
            Empowering smarter workplaces.
          </p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <a href="#" className="hover:text-[#E42128] transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#E42128] transition">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
