import HeroSection from "../components/marketing/HeroSection";
import Services from "../components/marketing/Services";
import Statistics from "../components/marketing/Statistics";
import Features from "../components/marketing/Features";
// import Team from "../components/marketing/Team";
import Pricing from "../components/marketing/Pricing";
import Testimonials from "../components/marketing/Testimonials";
import Contact from "../components/marketing/Contact";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Services />
      <Statistics />
      <Features />
      {/* <Team /> */}
      <Pricing />
      <Testimonials />
      <Contact />
    </>
  );
}
