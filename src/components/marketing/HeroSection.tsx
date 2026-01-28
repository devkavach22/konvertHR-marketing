import { Link } from "react-router-dom";
import heroSvg from "../../assets/img/hero-area.svg";
import heroImg from "../../assets/img/intro-mobile.png";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex flex-col md:flex-row items-center justify-between py-40 overflow-hidden w-full bg-white"
    >
      {/* SVG Background */}
      <img
        src={heroSvg}
        alt="Hero Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-90"
      />

      {/* Text Content */}
      <div className="relative px-6 text-left max-w-2xl space-y-6 z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight md:leading-[1.2]">
          Revolutionizing Payroll Services and HR Technology
          <br />
          <span className="mt-2 block text-primary">
            with <span className="text-[#E42128]">KonvertHR</span>
          </span>
        </h1>

        <p className="text-gray-700 text-base md:text-md">
          <span className="text-[#E42128]">
            Konvert<sub>hr</sub>
          </span>{" "}
          is a state-of-the-art payroll processing module that is user-friendly,
          highly secure, and compliant with legal and statutory norms. Our
          software is designed to minimize manual intervention and streamline
          payroll processes, saving time and resources for businesses of all
          sizes.
        </p>

        <div className="flex flex-wrap gap-4 mt-4">
          <Link to="/pricing">
          <button className="bg-[#E42128] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#c91b21] transition shadow-md">
            Get Started
          </button>
          </Link>
          {/* <button className="bg-white border border-primary text-[#E42128] px-6 py-3 rounded-lg font-medium hover:bg-grey hover:text-[#E42128] transition shadow-md">
            View Demo
          </button> */}
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative mt-10 md:mt-0 z-10 px-6 md:px-0">
        <img
          src={heroImg}
          alt="KonvertHR Dashboard"
          className="w-full md:w-[400px]"
        />
      </div>
    </section>
  );
}
