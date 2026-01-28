import { useEffect } from "react";
import { ArrowLeft, Shield, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-700">
      {/* === Header Section === */}
      <div className="relative bg-[#FFF6F6] py-16 md:py-24 px-6 overflow-hidden">
        {/* Background Glows (Matching Footer Theme) */}
        <div className="absolute top-0 left-10 w-64 h-64 bg-[#E42128]/5 blur-3xl rounded-full -z-10"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#E42128]/5 blur-3xl rounded-full -z-10"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link
            to="/"
            className="inline-flex items-center text-[#E42128] font-semibold mb-6 hover:underline"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            At <span className="text-[#E42128] font-semibold">KonvertHR</span>,
            we are committed to protecting your privacy and ensuring the
            security of your personal and organizational data.
          </p>
        </div>
      </div>

      {/* === Content Section === */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-12">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            1. Introduction
          </h2>
          <p className="leading-relaxed mb-4">
            Konverthr Services, (“Company” or “We”) respect your privacy and are
            committed to protecting it through our compliance with this policy.
            This policy describes the types of information we may collect from
            you or that you may provide when you visit the website
            http://konverthr.com (our “Website”) and our practices for
            collecting, using, maintaining, protecting, and disclosing that
            information.
          </p>
          <p className="leading-relaxed">
            Please read this policy carefully. If you do not agree with our
            policies and practices, your choice is not to use our Website. By
            accessing or using this Website, you agree to this privacy policy.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            2. Information We Collect About You
          </h2>
          <p className="leading-relaxed mb-4">
            We collect several types of information from and about users of our
            Website, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-[#E42128]">
            <li>
              <strong>Personal Information:</strong> Name, postal address, email
              address, telephone number, employment experience, educational
              history, skills, reference information, and login credentials.
            </li>
            <li>
              <strong>Usage Data:</strong> Information collected automatically
              as you navigate through the site, such as IP addresses, usage
              details, and cookies.
            </li>
          </ul>
        </section>

        {/* How We Collect */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            3. How We Collect Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                Information You Provide
              </h3>
              <p className="text-sm">
                This includes filling in forms, registering for our service,
                reporting problems, responding to surveys, or communicating with
                us via email.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                Automatic Collection
              </h3>
              <p className="text-sm">
                As you navigate our Website, we may use cookies, tracking
                pixels, and web beacons to collect details about your equipment,
                browsing actions, and patterns.
              </p>
            </div>
          </div>
        </section>

        {/* Use of Information */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            4. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2 marker:text-[#E42128]">
            <li>To present our Website and its contents to you.</li>
            <li>
              To provide you with employment opportunities and requested
              services.
            </li>
            <li>
              To send automated email messages regarding services and employment
              info.
            </li>
            <li>
              To notify you about changes to our Website or products/services.
            </li>
            <li>
              To improve our Website and deliver a better, more personalized
              service.
            </li>
          </ul>
        </section>

        {/* Mobile Background Tracking - Highlighted Section */}
        <section className="bg-red-50 border border-red-100 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Smartphone size={100} className="text-[#E42128]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Smartphone className="text-[#E42128]" /> 5. Background Tracking
            (Mobile Application)
          </h2>
          <p className="mb-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
            Important Compliance Information
          </p>
          <p className="leading-relaxed mb-4">
            In addition to standard data, our mobile application may collect and
            process location and activity-related data in the background, where
            permitted by your device settings and applicable law.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900">What We Collect:</h3>
              <p>
                Location data (GPS coordinates), timestamp/duration of activity,
                and movement status related to work/attendance.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Purpose:</h3>
              <p>
                Used solely for attendance management, work location
                verification, activity logging, and improving service accuracy.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">User Control:</h3>
              <p>
                Background tracking is only enabled with your{" "}
                <strong>explicit consent</strong>. You can disable this at any
                time in device settings.
              </p>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="text-[#E42128]" /> 6. Data Security
          </h2>
          <p className="leading-relaxed mb-4">
            We have implemented measures designed to secure your personal
            information from accidental loss and from unauthorized access, use,
            alteration, and disclosure. All information you provide to us is
            stored on our secure servers behind firewalls.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Where we have given you a password for
              access to certain parts of our Website, you are responsible for
              keeping this password confidential.
            </p>
          </div>
        </section>

        {/* Contact Us */}
        <section className="border-t border-gray-200 pt-8 mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Questions or Concerns?
          </h2>
          <p className="mb-4">
            If you have any questions about this privacy policy, please contact
            us:
          </p>
          <a
            href="mailto:support@konverthr.com"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#E42128] hover:bg-[#c91b21] transition shadow-md"
          >
            Contact Support
          </a>
        </section>
      </div>
    </div>
  );
}
