import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Link,
import { motion } from "framer-motion";
import {
  BookOpen,
  HandHeart,
  ShieldCheck,
  Lightbulb,
  Users,
  CreditCard,
  RefreshCcw,
  UserX,
  XCircle,
  LifeBuoy,
  UserCheck,
  Scale,
  Shield,
  Gavel,
  Calendar,
  ChevronDown,
  UserCircle2,
  GraduationCap,
} from "lucide-react";
// Facebook, Twitter, Instagram, Linkedin, removed ffrom above
// import image1 from '../assets/about_initial.png';
// import bg_head from "../assets/header_bg.jpg";
// import bg_img from "../assets/bg_main.jpeg";
// import about_us from "../assets/About_us1.png";
import our_story from "../assets/our_story.jpeg";
// import careers_img from "../assets/careers_img.jpeg";
// import { Nav, Container, Offcanvas, Button } from "react-bootstrap";
//  Navbar,  removed from above react-bootstrap
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
// import TeamSection from "../components/TeamSection";
import OurTeamMember from "../components/OurTeamMember";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AboutPage() {
  const location = useLocation();
  const [openHelpFaq, setOpenHelpFaq] = useState<number | null>(null);
  // const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
  });

  const [feedbackStatus, setFeedbackStatus] = useState<String | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);

  const valuesData = [
    {
      title: "Empowerment",
      description: "We believe in unlocking every learner's potential through opportunity and support.",
      icon: HandHeart,
    },
    {
      title: "Integrity",
      description: "We uphold transparency, fairness, and trust in everything we build and teach.",
      icon: ShieldCheck,
    },
    {
      title: "Innovation",
      description: "We constantly evolve through technology to make education smarter and more engaging.",
      icon: Lightbulb,
    },
    {
      title: "Community",
      description: "We foster a global network where learners and mentors uplift one another.",
      icon: Users,
    },
  ];

  const culture = [
    {
      title: "Innovation",
      description: "We've push boundaries to create the future of online education through experimentation and technology",
      icon: Lightbulb,
    },
    {
      title: "Inclusivity",
      description: "Building a platform where everyone feels they belong, regardless of their background or location",
      icon: UserCircle2,
    },
    {
      title: "Lifelong Learning",
      description: "We invest in our team's growht as much as our students, with dedicated budgets for development",
      icon: GraduationCap,
    },
  ]

  const navigate = useNavigate()
  const { user } = useAuth();

  const handleStartLearning = () => {
    if (!user) {
      navigate('/register');
    } else {
      // Role-based redirection logic
      switch (user?.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'trainer':
          navigate('/trainer');
          break;
        case 'student':
        default:
          navigate('/student');
          break;
      }
    }
  };

  // const hasMounted = React.useRef(false);

  useEffect(() => {
    // If there is no hash, do nothing (or scroll to top if you prefer)
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }

    // Attempt to find the element
    const el = document.querySelector(location.hash);

    if (el) {
      // slight delay ensures the DOM is fully ready
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]); // location.hash changes when URL hash changes


  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackStatus(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send feedback");
      }

      setFeedbackStatus("success");
      setFeedbackData({ name: "", email: "", category: "", message: "" });
    } catch (err: any) {
      console.error(err);
      setFeedbackStatus("error");
    }
  };


  return (
    <div className="min-h-screen font-inter  text-black ">
      <Navbar />

      {/* ABOUT -> Career SECTION */}
      {/* bg-[#dc8d33]  bg-[linear-gradient(185deg,#E6EEF9_0%,#FEF5E4_30%,#f7f1e6_70%,#e9f1fb_100%)]*/}
      <div className="">
        <section
          id="about"
          className="relative mb-12 pt-4 flex items-center justify-center"
        >
          <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

            <span className="flex flex-row justify-center items-center gap-4 mb-6">
              <h1 className="text-3xl md:text-[54px] mt-2 font-black text-[#273240]/93  -z-10 ">
                About{" "}
                <span className="inline-flex items-baseline  text-[#024aac] tracking-tight mx-2">
                  <span>LearniLMWorl</span>
                  <span className="relative inline-block">
                    <span>d</span>
                    <GraduationCap
                      className="absolute -top-4 -right-2 text-black rotate-12"
                      size={26}
                      strokeWidth={2}
                      fill="black"
                    />
                  </span>
                </span>
              </h1>

            </span>

            <div className="inline-flex items-center gap-2 px-6 py-2 mt-2 mb-8
          rounded-full bg-white text-[#5186cd] font-semibold 
          shadow-[0_4px_10px_rgba(0,0,0,0.1)] border border-gray-100"
            >
              🎓 Transforming Education Globally
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1a56ad] mb-6 tracking-tight">
              Empowering Learners Everywhere
            </h2>

            <p className="max-w-3xl mx-auto text-lg md:text-xl font-medium leading-relaxed mb-12 text-gray-600">
              We are on a mission to make quality education and{" "}
              <span className="font-bold text-[#1a56ad]">skill-building</span> accessible
              to everyone — through personalized, flexible, and affordable learning experiences.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-2">
              {[
                { icon: "🌍", text: "Global Community" },
                { icon: "🎓", text: "Quality Education" },
                { icon: "💡", text: "Accessible Learning" }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-6 py-3 rounded-full
              bg-white text-[#5186cd] font-bold shadow-[0_4px_15px_rgba(0,0,0,0.08)] 
              border border-gray-50 transition-transform hover:scale-105"
                >
                  <span>{feature.icon}</span> {feature.text}
                </div>
              ))}
            </div>

            {/* <button
              onClick={handleStartLearning}
              className="px-6 py-3 rounded-full bg-[#004aad] hover:bg-[#003a8a]
          transition-all duration-300 text-white text-2xl font-bold 
          shadow-[0_10px_20px_rgba(0,74,173,0.3)] flex items-center gap-3 mx-auto"
            >
              Start Learning Today <span className="text-3xl">→</span>
            </button> */}
          </div>
        </section>

        <OurTeamMember />

        {/* e0fa84 bg-gradient-to-b from-[#2D274B] to-[#1E1A3A] */}
        {/* OUR VISION & VALUES */}
        <section className=" pb-20 px-6 ">
          <div className="max-w-7xl mx-auto text-center">
            {/* Top Pill */}
            {/* <div className="inline-flex items-center px-6 py-2 rounded-full bg-white text-[#276dc9] font-bold shadow-md border border-[#5186cd]/20 mb-8">
            Our Vision & Values
          </div> */}

            {/* Main Heading */}
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-[#1f2937]">
              What We <span className="text-[#1a56ad]">Believe In</span>
            </h2>

            {/* Vision Text */}
            <p className="max-w-5xl mx-auto text-lg md:text-xl leading-relaxed text-gray-700 mb-16">
              <strong className="text-[#5186cd]">Our Vision:</strong> To create a
              world where learning is limitless, empowering individuals to
              explore, innovate, and grow without barriers — transforming
              education into a lifelong adventure.
            </p>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-4 gap-8 text-black text-left">
              {valuesData.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="bg-[#e9f1fb] rounded-tl-[40px] rounded-br-[40px] rounded-tr-xl rounded-bl-xl p-8 border-4 border-[#5186cd]/40"
                  >
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#cfe0f7] text-[#276dc9] mb-5 mx-auto">
                      <Icon size={28} strokeWidth={1.8} />
                    </div>

                    <h3 className="text-xl flex items-center justify-center text-center font-bold mb-3 text-[#1f2937]">
                      {item.title}
                    </h3>
                    <p className="text-base flex items-center justify-center text-center leading-relaxed text-gray-700">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* OUR STORY */}
        {/*e0fa84  bg-gradient-to-b from-[#dc8d33] to-[#f3b765] text-[#2D274B]  */}
        <section className="py-20 px-6 bg-transparent relative overflow-hidden">
          <div className="max-w-7xl mx-auto">

            {/* Top Pill - "Our Story" */}
            <div className="flex justify-center mb-12">
              {/* <div className="px-10 py-2 rounded-full bg-white text-[#1a56ad] font-bold shadow-[0_4px_10px_rgba(0,0,0,0.1)] border border-gray-100 text-2xl">
            Our Story
          </div> */}

              <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-[#1f2937]">Our <span className="text-[#1a56ad]">Story</span></h1>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16 mb-16">

              {/* LEFT SIDE */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="w-full md:w-1/2 flex justify-center"
              >
                <div className="relative p-2">
                  <img
                    src={our_story}
                    alt="LearniLM Story"
                    className="w-full max-w-lg rounded-[50px] border-[5px] border-[#5186cd]/30 shadow-2xl object-cover"
                  />
                </div>
              </motion.div>

              {/* RIGHT SIDE*/}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="w-full md:w-1/2 flex flex-col"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8">
                  <h2 className="text-3xl mt-2 md:text-5xl font-black text-[#1f2937] leading-tight">
                    How {" "}
                    <span className="inline-flex items-baseline  text-[#024aac] tracking-tight mx-2">
                      <span>LearniLMWorl</span>
                      <span className="relative inline-block">
                        <span>d</span>
                        <GraduationCap
                          className="absolute -top-2 -right-3 text-black rotate-12"
                          size={23}
                          strokeWidth={2}
                          fill="black"
                        />
                      </span>
                    </span>
                  </h2>

                  {/* <img
                    src={image1}
                    alt="LearniLM"
                    className="h-12 md:h-16 w-auto object-contain"
                  /> */}

                  <h2 className="text-4xl mt-2 md:text-5xl font-black text-[#1f2937] leading-tight">
                    Began
                  </h2>
                </div>

                <div className="space-y-6 text-gray-700 text-lg md:text-xl font-medium leading-relaxed">
                  <p>
                    What started as a simple idea — to make learning truly personal
                    — evolved into a global movement connecting passionate trainers
                    and eager learners across the world.
                  </p>

                  <p>
                    Through dedication, creativity, and a belief that knowledge
                    should have no limits, <span className="text-[#1a56ad] font-bold">LearniLMWorld</span> continues
                    to empower individuals to grow academically, professionally, and personally.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* BOTTOM QUOTE: Blue Pill as per image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="bg-[#004aad] px-6 py-6 rounded-full shadow-[0_10px_30px_rgba(0,74,173,0.3)] max-w-3xl text-center border-b-4 border-black/20">
                <p className="text-white text-lg md:text-xl font-bold  ">
                  "Every learner has a story. Ours is about making each one count."
                </p>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Our Culture */}
        <section className="p-20 pb-20 px-6 ">
          <div className="max-w-7xl mx-auto text-center">
            {/* Top Pill */}
            {/* <div className="inline-flex items-center px-6 py-2 rounded-full bg-white text-[#276dc9] font-bold shadow-md border border-[#5186cd]/20 mb-8">
            Our Vision & Values
          </div> */}

            {/* Main Heading */}
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-[#1f2937]">
              Our <span className="text-[#1a56ad]">Culture</span>
            </h2>

            {/* Vision Text */}
            <p className="max-w-5xl mx-auto text-lg md:text-xl leading-relaxed text-gray-700 mb-16">
              We're a remote-first company with a focus on results, empathy and continuous growth.
            </p>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-8 text-black text-left">
              {culture.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="bg-[#e9f1fb] rounded-tl-[40px] rounded-br-[40px] rounded-tr-xl rounded-bl-xl p-8 border-4 border-[#5186cd]/40"
                  >
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#cfe0f7] text-[#276dc9] mb-5 mx-auto">
                      <Icon size={28} strokeWidth={1.8} />
                    </div>

                    <h3 className="text-xl flex items-center justify-center text-center font-bold mb-3 text-[#1f2937]">
                      {item.title}
                    </h3>
                    <p className="text-base flex items-center justify-center text-center leading-relaxed text-gray-700">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>

      {/* POLICY & REFUND */}
      {/* e0fa84 CBE56A 2D274B */}
      <section id="policy-refund" className="py-28 px-6 bg-[#e9f1fb]">
        <div className="max-w-7xl mx-auto text-center">

          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#1f2937]">
            Policy & <span className="text-[#276dc9]">Refund</span>
          </h2>

          {/* SUBTEXT */}
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-16">
            We believe in transparency and fairness. Our policies are designed to
            protect learners, trainers, and ensure a smooth learning experience for
            everyone on LearniLMWorld.
          </p>

          {/* POLICY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CreditCard,
                title: "Payment Policy",
                text: "All payments on LearniLMWorld are processed securely through trusted payment partners. Once a session is successfully booked, you will receive a confirmation via email or dashboard notification.",
              },
              {
                icon: RefreshCcw,
                title: "Refund Eligibility",
                text: "Refunds are applicable if a session is cancelled within the allowed time window or if a trainer fails to attend a scheduled session. Eligible refunds are processed back to the original payment method.",
              },
              {
                icon: Calendar,
                title: "Cancellations & Rescheduling",
                text: "Learners can cancel or reschedule sessions from their dashboard as per the platform’s cancellation policy. Late cancellations may not qualify for a refund.",
              },
              {
                icon: UserX,
                title: "Trainer No-Show Policy",
                text: "If a trainer does not join a confirmed session without prior notice, learners are entitled to a full refund or a free reschedule, based on preference.",
              },
              {
                icon: XCircle,
                title: "Non-Refundable Cases",
                text: "Refunds are not applicable for completed sessions, partial attendance, or misuse of the platform. Any suspicious activity may lead to account review.",
              },
              {
                icon: LifeBuoy,
                title: "Support & Resolution",
                text: "If you face any issues related to payments or refunds, our support team is here to help and resolve refund-related queries within a reasonable timeframe.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl p-8 border-2 border-[#276dc9] shadow-md hover:shadow-lg transition"
                >
                  {/* ICON */}
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#d5e7fe] flex items-center justify-center text-[#276dc9] border border-[#276dc9]/30">
                    <Icon size={20} />
                  </div>

                  <h3 className="text-lg font-bold mb-3 text-[#1f2937]">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* FOOTER NOTE */}
          <div className="mt-16 bg-white rounded-xl px-6 py-4 max-w-4xl mx-auto border-2 border-[#276dc9] shadow-md">
            <p className="text-gray-700 text-sm">
              For detailed refund requests or payment-related concerns, please contact
              us at{" "}
              <span className="font-semibold text-[#276dc9]">
                support@learnilmworld.com
              </span>
              . We’re committed to making your learning experience safe, fair, and
              reliable.
            </p>
          </div>
        </div>
      </section>

      {/* TERMS & CONDITIONS */}
      {/* CBE56A 2D274B e0fa84*/}
      <section id="terms" className="py-28 px-6 bg-[#eef4fc]">
        <div className="max-w-7xl mx-auto text-center">

          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#1f2937]">
            Terms & <span className="text-[#276dc9]">Conditions</span>
          </h2>

          {/* SUBTEXT */}
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-16">
            By accessing or using LearniLM
            <span className="inline-block mx-1">🌎</span>
            World, you agree to our policies and terms. These ensure a safe,
            transparent, and fair learning environment for everyone.
          </p>

          {/* TERMS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: UserCheck,
                title: "User Responsibilities & Code of Conduct",
                text: "Users must provide accurate information, maintain account confidentiality, and uphold professionalism. Misuse, fraud, or inappropriate conduct may lead to suspension.",
              },
              {
                icon: CreditCard,
                title: "Booking, Payments & Cancellations",
                text: "All bookings depend on trainer availability. Payments are securely processed, and cancellations or reschedules must follow platform policies to qualify for refunds.",
              },
              {
                icon: BookOpen,
                title: "Intellectual Property Rights",
                text: "All content, materials, and trademarks on LearniLM World belong to LearniLM World or its partners. Unauthorized use or redistribution is prohibited.",
              },
              {
                icon: Scale,
                title: "Limitation of Liability",
                text: "LearniLM World is not liable for indirect or consequential losses arising from misuse of the platform. Services are provided “as is” within legal limits.",
              },
              {
                icon: Shield,
                title: "Privacy & Data Usage",
                text: "We respect your privacy. Data is collected only to improve learning experiences and platform functionality. Personal data is never sold or misused.",
              },
              {
                icon: Gavel,
                title: "Dispute Resolution & Governing Law",
                text: "Disputes will be resolved amicably where possible. If unresolved, they will be governed under applicable Indian law and jurisdiction.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl p-8 border-2 border-[#276dc9]/90 shadow-sm hover:shadow-md transition"
                >
                  {/* ICON */}
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#e9f1fb] flex items-center justify-center text-[#276dc9] border border-[#276dc9]/30">
                    <Icon size={20} />
                  </div>

                  <h3 className="text-lg font-bold mb-3 text-[#1f2937]">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* FOOTER NOTE */}
          <p className="mt-16 text-gray-700 text-sm max-w-3xl mx-auto">
            These terms may be updated periodically to reflect platform or legal
            changes. For queries, contact us at{" "}
            <span className="font-semibold text-[#276dc9]">
              support@learnilmworld.com
            </span>
            .
          </p>
        </div>
      </section>

      {/* HELP CENTRE */}
      {/* bg-[#2D274B] e0fa84 */}
      <section
        id="help"
        className="py-28 px-6 bg-gradient-to-r from-[#f7f3ea] via-[#eef2f6] to-[#cfdbe6] text-[#1f2937]"
      >

        <div className="max-w-4xl mx-auto text-center">
          {/* TOP PILL */}
          {/* <div className="inline-flex px-5 py-2 rounded-full bg-white text-[#276dc9] text-sm font-bold mb-6 shadow">
            SUPPORT
          </div> */}

          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#0b5ed7]">
            Support
          </h2>

          {/* SUBTEXT */}
          <p className="text-lg max-w-3xl mx-auto mb-14 text-gray-700">
            Need assistance? Find quick answers and guides to help both learners and
            mentors navigate{" "}
            <span className="font-semibold text-[#0b5ed7]">LearniLMWorld</span> with ease.
          </p>

          {/* FAQs */}
          <div className="mt-10 space-y-4 text-left">
            {[
              {
                q: "How do I book a learning session?",
                a: "Go to your dashboard, choose a course or mentor, and click 'Book Session'. You’ll receive a confirmation email instantly after booking.",
              },
              {
                q: "How can I become a trainer on LearniLM World?",
                a: "Submit your profile through the ‘Join as Trainer’ form. Once verified by our team, you’ll be able to create and manage your own sessions.",
              },
              {
                q: "What are your payment and refund policies?",
                a: "Payments are securely processed through our trusted partners. Refunds are available within 7 days for eligible cases under our learner protection policy.",
              },
              {
                q: "How do I manage my schedule or classes?",
                a: "You can update your availability, reschedule classes, or cancel sessions anytime under ‘My Schedule’ in your profile settings.",
              },
              {
                q: "I’m facing technical issues — what should I do?",
                a: "Try refreshing the page or clearing your browser cache first. If the issue persists, contact our support team for quick assistance.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              >
                {/* Question */}
                <button
                  onClick={() => setOpenHelpFaq(openHelpFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                  aria-expanded={openHelpFaq === i}
                  aria-controls={`help-faq-${i}`}
                >
                  <span className="font-semibold text-lg text-gray-800">
                    {faq.q}
                  </span>

                  {/* Arrow (exact style from reference) */}
                  <motion.div
                    animate={{ rotate: openHelpFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="ml-4 bg-blue-200 w-8 h-8 flex items-center justify-center rounded-full"
                  >
                    <ChevronDown className="text-[#276dc9]" />
                  </motion.div>
                </button>

                {/* Answer */}
                <motion.div
                  id={`help-faq-${i}`}
                  initial={false}
                  animate={{
                    height: openHelpFaq === i ? "auto" : 0,
                    opacity: openHelpFaq === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 bg-blue-200 text-gray-800 text-md leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* CONTACT LINE */}
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-gray-700">
              Still need help? Reach out to us anytime at{" "}
              <span className="font-semibold text-[#0b5ed7]">
                support@learnilmworld.com
              </span>
            </p>

            <button
              onClick={() => setShowFeedback(true)}
              className="mt-6 bg-white text-[#0b5ed7] px-6 py-3 rounded-full font-bold shadow hover:bg-gray-100 transition"
            >
              Give Feedback
            </button>

            {/* Feedback Form */}
            {showFeedback && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-[#fef5e4] text-[#1f2937] rounded-3xl p-8 w-[90%] max-w-lg relative shadow-xl"
                >
                  {/* Close */}
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="absolute top-4 right-4 text-3xl font-bold text-[#5186cd] hover:text-[#3f6fb0]"
                  >
                    ×
                  </button>

                  <h3 className="text-3xl font-extrabold mb-6 text-center text-[#5186cd]">
                    We Value Your Feedback 🌟
                  </h3>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={feedbackData.name}
                      onChange={(e) =>
                        setFeedbackData({
                          ...feedbackData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                      required
                    />

                    <input
                      type="email"
                      placeholder="Your Email"
                      value={feedbackData.email}
                      onChange={(e) =>
                        setFeedbackData({
                          ...feedbackData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                      required
                    />

                    <select
                      value={feedbackData.category}
                      onChange={(e) =>
                        setFeedbackData({
                          ...feedbackData,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>

                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      value={feedbackData.message}
                      onChange={(e) =>
                        setFeedbackData({
                          ...feedbackData,
                          message: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                      required
                    />

                    <button
                      type="submit"
                      className="w-full bg-[#5186cd] hover:bg-[#3f6fb0] text-white font-bold py-3 rounded-xl hover:scale-105 transition"
                    >
                      Submit Feedback
                    </button>
                  </form>

                  {feedbackStatus === "success" && (
                    <p className="text-[#5186cd] mt-4 text-center font-semibold">
                      ✅ Thank you! Your feedback has been submitted.
                    </p>
                  )}

                  {feedbackStatus === "error" && (
                    <p className="text-red-500 mt-4 text-center font-semibold">
                      ❌ Failed to send feedback. Please try again.
                    </p>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer - expanded */}
      <Footer />
    </div>
  );
}
