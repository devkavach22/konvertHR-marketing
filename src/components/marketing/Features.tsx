import {
  Clock,
  FileText,
  ShieldCheck,
  UserCog,
  Cloud,
  TrendingUp,
} from "lucide-react";
import CenterImage from "../../assets/img/CoreFeatures.png";

export default function CoreFeatures() {
  const leftFeatures = [
    {
      title: "Real-time Payroll Processing",
      desc: "Process salaries instantly with automatic tax, PF, and ESI compliance — always accurate and on time.",
      icon: <Clock className="w-7 h-7 text-[#E42128]" />,
    },
    {
      title: "Digital Employee Records",
      desc: "Centralized cloud-based employee profiles with quick access to documents, attendance, and history.",
      icon: <FileText className="w-7 h-7 text-[#E42128]" />,
    },
    {
      title: "Advanced Data Security",
      desc: "Your HR data stays encrypted and secure, ensuring compliance with GDPR and local labor laws.",
      icon: <ShieldCheck className="w-7 h-7 text-[#E42128]" />,
    },
  ];

  const rightFeatures = [
    {
      title: "Smart Role Management",
      desc: "Assign HR, manager, or admin roles with granular access control to sensitive payroll and HR data.",
      icon: <UserCog className="w-7 h-7 text-[#E42128]" />,
    },
    {
      title: "Cloud-Based Accessibility",
      desc: "Access payroll and employee data anytime, anywhere with secure cloud infrastructure.",
      icon: <Cloud className="w-7 h-7 text-[#E42128]" />,
    },
    {
      title: "Performance Analytics",
      desc: "Visual dashboards that show HR performance, salary trends, and productivity insights in real time.",
      icon: <TrendingUp className="w-7 h-7 text-[#E42128]" />,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-[#fff] via-[#FFF5F5] to-[#FFEAEA]">
      <div className="container mx-auto px-6 text-center">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Core <span className="text-[#E42128]">Features</span>
          </h2>
          <div className="w-20 h-[3px] bg-[#E42128] mt-3 rounded-full"></div>
        </div>

        {/* Features with Center Image */}
        <div className="grid md:grid-cols-3 mt-4 gap-10 items-center">
          {/* Left Column */}
          <div className="flex flex-col space-y-8 text-right">
            {leftFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-2xl p-6 flex items-center justify-end gap-4 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-[#E42128] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
                <div className="p-3 bg-[#E42128]/10 rounded-full">
                  {feature.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Center Image */}
          <div className="flex justify-center">
            <img
              src={CenterImage}
              alt="App Mockup"
              className="w-[320px] md:w-[400px] mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-8 text-left">
            {rightFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition-all duration-300"
              >
                <div className="p-3 bg-[#E42128]/10 rounded-full">
                  {feature.icon}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-[#E42128] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
