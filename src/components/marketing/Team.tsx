export default function Team() {
  const members = [
    {
      name: "Alice Johnson",
      role: "Chief Executive Officer",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Bob Smith",
      role: "Lead Developer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Sophie Ray",
      role: "Creative Designer",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-[#FFF5F5] to-[#FFEAEA] relative overflow-hidden">
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Meet Our <span className="text-[#E42128]">Team</span>
          </h2>
          <div className="w-20 h-[3px] bg-[#E42128] mt-3 rounded-full"></div>
          <p className="text-gray-700 mt-6  max-w-3xl mx-auto text-center leading-relaxed text-lg md:text-xl font-medium tracking-wide !text-center">
            Our passionate and talented professionals drive innovation and
            ensure success for every client through collaboration and expertise.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {members.map((m, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 p-8 flex flex-col items-center text-center border border-transparent hover:border-[#E42128]/30 hover:-translate-y-2"
            >
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-[#E42128]/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Name and Role */}
              <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-[#E42128] transition-colors duration-300">
                {m.name}
              </h3>
              <p className="text-gray-500">{m.role}</p>

              {/* Decorative Accent */}
              <div className="mt-4 w-12 h-[3px] bg-[#E42128]/60 rounded-full group-hover:w-16 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#E42128]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E42128]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
    </section>
  );
}
