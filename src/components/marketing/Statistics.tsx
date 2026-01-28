import { Link } from "react-router-dom";
import Statestic from "../../assets/img/img-1.png";

export default function StatisticsSection() {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-br from-[#E42128]/90 via-[#E42128]/80 to-[#8B0000] text-white">
      {/* Decorative Background Circles */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div data-aos="fade-right">
          <h5 className="text-white/80 font-semibold mb-2 uppercase tracking-wider">
            Advanced Insights
          </h5>

          <h2 className="text-5xl font-extrabold mb-6 leading-tight">
            Powerful <span className="text-yellow-300">HR Statistics</span>{" "}
            <br />
            for Smart Decisions
          </h2>

          <p className="text-white/90 mb-8 text-lg leading-relaxed">
            Unlock real-time HR insights with dynamic analytics. Get
            performance, payroll, and attendance stats in one dashboard —
            empowering your workforce with transparency and a data-driven
            strategy.
          </p>

          <Link to="/pricing">
            <button className="bg-white text-[#E42128] px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-all shadow-lg">
              Explore Insights
            </button>
          </Link>
        </div>

        {/* Right Illustration */}
        {/* <div
          data-aos="fade-left"
          className="flex justify-center md:justify-end relative"
        >
          <div className="relative bg-white rounded-3xl shadow-2xl p-4 md:p-6 transform hover:scale-105 transition-transform duration-300"> */}
        <img
          src={Statestic}
          alt="HR Analytics Dashboard"
          className="rounded-2xl w-full h-auto"
        />
        {/* Glow effect */}
        {/* <div className="absolute inset-0 bg-gradient-to-tr from-[#E42128]/20 via-transparent to-transparent rounded-2xl"></div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
