import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Aarav Mehta",
      role: "Founder, TechNova",
      image: "https://randomuser.me/api/portraits/men/51.jpg",
      feedback:
        "Konvert HR has completely streamlined our HR operations. Payroll and attendance tracking are now effortless!",
    },
    {
      name: "Priya Sharma",
      role: "HR Manager, FinEdge",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      feedback:
        "The automation and analytics features are top-notch. Our team productivity has noticeably increased.",
    },
    {
      name: "Rohit Patel",
      role: "CEO, GrowWell",
      image: "https://randomuser.me/api/portraits/men/33.jpg",
      feedback:
        "Konvert HR’s platform gives us complete visibility into workforce performance. Worth every penny!",
    },
    {
      name: "Sneha Iyer",
      role: "Operations Head, WorkHub",
      image: "https://randomuser.me/api/portraits/women/42.jpg",
      feedback:
        "Amazing UI and smooth experience. Implementation was fast, and support is super responsive!",
    },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFEAEA] text-gray-800 text-center relative overflow-hidden">
      {/* soft glowing orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-72 h-72 bg-[#E42128]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-[#E42128]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Section Heading */}

        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          What Our <span className="text-[#E42128]">Clients</span> Say
        </h2>

        <div className="w-20 h-[3px] bg-[#E42128] mt-3 mx-auto rounded-full"></div>

        <p className="text-gray-700 mb-14 mt-6 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium tracking-wide text-center !text-center">
          Trusted by growing startups and established enterprises — hear what
          they have to say about
          <span className="text-[#E42128] font-semibold"> Konvert HR</span>.
        </p>

        {/* Swiper Slider */}
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          slidesPerView={1}
          spaceBetween={30}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12 mt-4"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="bg-white/80 backdrop-blur-lg border border-[#E42128]/20 shadow-lg hover:shadow-xl hover:border-[#E42128]/50 transition-all duration-500 rounded-2xl p-8 flex flex-col items-center text-center">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#E42128]/60 shadow-md mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  {t.name}
                </h3>
                <p className="text-sm text-[#E42128] font-medium mb-4">
                  {t.role}
                </p>
                <p className="text-gray-700 italic text-sm leading-relaxed">
                  “{t.feedback}”
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
