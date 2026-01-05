import { motion } from "framer-motion";
import {
  Users,
  FileText,
  DollarSign,
  Clock,
  BarChart2,
  Settings,
} from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: (
        <Users className="w-8 h-8 text-white transition-colors duration-300 group-hover:text-[#E42128]" />
      ),
      title: "Employee Management",
      desc: "Manage employee profiles, departments, and attendance all in one place with ease and accuracy.",
      delay: 0.3,
    },
    {
      icon: (
        <DollarSign className="w-8 h-8 text-white transition-colors duration-300 group-hover:text-[#E42128]" />
      ),
      title: "Payroll Automation",
      desc: "Automate salary calculations, deductions, and reimbursements with complete accuracy and transparency.",
      delay: 0.6,
    },
    {
      icon: (
        <FileText className="w-8 h-8 text-white transition-colors duration-300 group-hover:text-[#E42128]" />
      ),
      title: "Tax & Compliance",
      desc: "Stay compliant with all tax laws including TDS, PF, ESI, and generate statutory reports instantly.",
      delay: 0.9,
    },
    {
      icon: (
        <Clock className="w-8 h-8 text-white transition-colors duration-300 group-hover:text-[#E42128]" />
      ),
      title: "Time & Attendance",
      desc: "Track attendance, leaves, and working hours effortlessly with biometric and digital integration.",
      delay: 1.2,
    },
    {
      icon: (
        <BarChart2 className="w-8 h-8 text-white transition-colors duration-300 group-hover:text-[#E42128]" />
      ),
      title: "Analytics & Reports",
      desc: "Get insightful HR and payroll analytics with visual dashboards and detailed reporting tools.",
      delay: 1.5,
    },
    {
      icon: (
        <Settings className="w-8 h-8 text-white transition-colors duration-300 group-hover:text-[#E42128]" />
      ),
      title: "Custom HR Settings",
      desc: "Configure company policies, salary structures, and approval workflows to match your organization.",
      delay: 1.8,
    },
  ];

  return (
    <section id="services" className="py-12 mt-12 bg-white section-padding">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-3xl font-arvo font-bold text-gray-900"
          >
            Our HR & Payroll Services
          </motion.h2>
          <motion.div
            className="w-20 h-1 bg-[#E42128] mx-auto mt-4 rounded"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          ></motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: service.delay }}
              className="bg-white shadow-md rounded-2xl p-8 hover:shadow-xl transition group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Icon wrapper with hover inversion */}
                <div className="p-4 bg-[#E42128] rounded-full border border-[#E42128] transition-all duration-300 group-hover:bg-white">
                  {service.icon}
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  <a
                    href="#"
                    className="hover:text-[#E42128] transition-colors"
                  >
                    {service.title}
                  </a>
                </h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
