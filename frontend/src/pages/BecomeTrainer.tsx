import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, BookOpen, Briefcase, CheckCircle, ChevronDown, ChevronRight, Clock, DollarSign, Globe, GraduationCap, Lightbulb, Megaphone, Users } from "lucide-react";
// import { Container, Nav, Offcanvas, Button } from "react-bootstrap";
// import logo from '../assets/LearnilmworldLogo.jpg'
import image1 from "../assets/become-trainer2.4.jpg";
import image2 from "../assets/become-trainer2.2.jpeg";
import image3 from "../assets/become-trainer2.3.jpeg";
import image4 from "../assets/become-trainer-img.png";
// import bg_img from '../assets/purple_gradient.jpg'
// import bg_img from '../assets/header_bg.jpg'
// import bg_main from '../assets/bg_trainer.jpeg'
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


const BecomeTrainer: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const categories = [
    {
      id: 1,
      title: "Working Professionals",
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      description: "Active professionals ready to guide others with real-world experience."
    },
    {
      id: 2,
      title: "Industry Experts",
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      description: "Specialists with deep knowledge in niche domains and technologies."
    },
    {
      id: 3,
      title: "Founders & Leaders",
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      description: "Visionaries willing to share their entrepreneurial journey and insights."
    },
    {
      id: 4,
      title: "Educators & Coaches",
      icon: <BookOpen className="w-8 h-8 text-emerald-600" />,
      description: "Passionate teachers dedicated to structuring and delivering knowledge."
    }
  ];

  const benefits = [
    {
      id: 1,
      title: "Earn Income",
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      description: "Generate revenue by sharing your expertise with motivated learners worldwide."
    },
    {
      id: 2,
      title: "Build Your Brand",
      icon: <Award className="w-8 h-8 text-purple-600" />,
      description: "Establish yourself as a thought leader and grow your professional reputation."
    },
    {
      id: 3,
      title: "Global Audience",
      icon: <Globe className="w-8 h-8 text-blue-500" />,
      description: "Reach learners across the world and make a lasting impact on their careers."
    },
    {
      id: 4,
      title: "Flexible Creation",
      icon: <Clock className="w-8 h-8 text-orange-500" />,
      description: "Create content at your own pace with full control over your teaching schedule."
    },
    {
      id: 5,
      title: "We Handle Marketing",
      icon: <Megaphone className="w-8 h-8 text-red-500" />,
      description: "Focus on teaching while we take care of marketing, distribution, and support."
    }
  ];

  return (
    <>
    
      <Navbar />
    <div className="min-h-screen overflow-x-hidden text-[#e0fa84]">
      {/* text-[#e0fa84] text-[#2D274B] */}

      {/* Hero Section */}
      <section className="pt-14">
        <div className="max-w-[1520px] mx-auto px-4">
          <div className="relative rounded-[40px] bg-[#6f9bd3] px-8 lg:px-16 pt-12 overflow-hidden pb-7">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={mounted ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7 flex flex-col space-y-6 pb-12 z-10 relative"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl  font-extrabold text-white leading-tight">
                  <span className="block lg:whitespace-nowrap">
                    🌟Empower Learners,{" "}
                  </span>
                  <span className="text-[#2D274B]">Inspire Growth</span>
                </h1>

                <div className="flex flex-col py-3">
                  <p className="text-xl lg:text-3xl font-bold text-white leading-relaxed">
                    Join
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
                    as a Trainer and help students achieve their goals while
                    growing your career in a flexible, rewarding environment.
                  </p>
                </div>

                <div className="translate-y-8">

                  <motion.button
                    onClick={() => navigate("/register?role=trainer")}
                    className="py-4 px-5 bg-[#276dc9] text-white font-semibold text-lg rounded-full w-fit   shadow-lg hover:bg-[#205eb0]"
                    whileHover={{ scale: 1.05 }}
                  >
                    Become a Trainer Today
                  </motion.button>
                </div>
              </motion.div>

              {/* RIGHT Img */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={mounted ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8 }}
                className="lg:col-span-5 relative flex justify-end items-end h-full self-end z-0"
              >
                {/* Dark Blue Div Behind Image */}
                <div className="absolute inset-0 flex justify-end items-end z-[-1]">
                  <div className="bg-[#0A1172] w-full h-4/5 rounded-tl-[120px] lg:rounded-tl-[160px]  rounded-br-[40px] translate-x-8 lg:translate-x-0 translate-y-12 lg:translate-y-7 "></div>
                </div>
                <img
                  src={image4}
                  alt="Learners"
                  className="w-full h-auto object-contain md:max-h-[400px] sm:max-h-[450px] lg:scale-125 origin-bottom z-10 relative left-4 lg:left-0 translate-y-7"
                  style={{ marginBottom: "-2px" }}
                />
              </motion.div>
            </div>
          </div>
        </div>

      </section>

      <section className="pt-16 px-6 md:px-16  flex flex-column  md:flex-row items-center gap-10 max-w-6xl mx-auto">
        <motion.div
          className="flex-1 space-y-6"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-5xl md:text-5xl font-bold text-[#5186cd] mx-auto">
              Teach, Inspire, and Make a Difference
            </h2>
          </div>

          <div>
            <p className="text-xl font-bold text-[#2D274B] leading-relaxed">
              At LearniLM World, we believe in empowering individuals through
              knowledge. As a trainer, you’ll help learners from diverse
              backgrounds gain confidence, improve communication, and unlock new
              opportunities in their lives.
            </p>
            <div className="flex flex-row gap-20">
              <div>
                <ul className="list-disc list-outside text-xl text-[#2D274B] font-bold space-y-2">
                  <li>Flexible working hours and teaching freedom</li>
                  <li>Access to a supportive and growing learning community</li>
                  <li>Opportunity to reach learners from around the world</li>
                </ul>
              </div>

              {/* <div>
                <button
                  onClick={() => navigate("/register?role=trainer")}
                  className="mt-6 px-8 py-3 bg-[#F64EBB] text-[white] rounded-full font-semibold hover:bg-[#f92eb2] transition-all"
                >
                  Become a Trainer Today
                </button>
              </div> */}
            </div>
          </div>
        </motion.div>

        {/* stretched image */}
        <div className="w-full px-4">
          <div className="max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-lg aspect-[7/2]">
            <motion.div
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={image3}
                alt="Trainer Relaxing Illustration"
                className=" w-full h-full object-cover object-center"
              />
            </motion.div>
          </div>
        </div>

        {/*Text Under Images */}
        <div>
          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ul className="gap-4 text-lg text-[#2D274B] font-bold grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <li className="flex items-start border-2 rounded-2xl border-blue-300 px-8 py-4 shadow-sm text-start bg-white/80 gap-3">
                <span className="text-[#5186cd] text-xl">✔</span>
                Continuous Flow of Learners —<br /> Reach motivated students
                from around the world.
              </li>
              <li className="flex items-start border-2 rounded-2xl border-blue-300 px-8 py-4 shadow-sm text-start bg-white/80 gap-3">
                <span className="text-[#5186cd] text-xl">✔</span>
                Smart Scheduling Tools —<br /> Manage your sessions effortlessly
                with our intuitive calendar.
              </li>
              <li className="flex items-start border-2 rounded-2xl border-blue-300 px-8 py-4 shadow-sm text-start bg-white/80 gap-3">
                <span className="text-[#5186cd] text-xl">✔</span>
                Interactive Virtual Classrooms —<br /> Engage your students with
                real-time learning tools.
              </li>
              <li className="flex items-start border-2 rounded-2xl border-blue-300 px-8 py-4 shadow-sm text-start bg-white/80 gap-3">
                <span className="text-[#5186cd] text-xl">✔</span>
                Secure & Flexible Payments —<br /> Get paid easily, wherever you
                are.
              </li>
              <li className="flex items-start border-2 rounded-2xl border-blue-300 px-8 py-4 shadow-sm text-start bg-white/80 gap-3">
                <span className="text-[#5186cd] text-xl">✔</span>
                Growth-Focused Training —<br /> Access exclusive webinars and
                teaching resources.
              </li>
              <li className="flex items-start border-2 rounded-2xl border-blue-300 px-8 py-4 shadow-sm text-start bg-white/80 gap-3">
                <span className="text-[#5186cd] text-xl">✔</span>
                Thriving Educator Community — <br /> Connect, share, and
                collaborate with fellow mentors.
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      {/* e0fa84 bg-[#2D274B] */}
      <section className="pt-16 px-6 md:px-16 ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5186cd] mb-4">
              Why Become a Trainer at {" "}
              <span className="inline-flex items-baseline  tracking-tight mx-2">
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
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a platform designed to help experts like you succeed.
            </p>
          </div>

          {/* Benefits Cards - Flex Wrap for 3-2 Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="bg-white rounded-xl p-8 shadow-sm border-2 border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left group"
              >
                <div className="p-3 bg-gray-50 rounded-full mb-6 group-hover:bg-blue-50 transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Who can apply section */}
      <section className="pt-16 px-6 md:px-16 ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5186cd] mb-4">
              Who Can Apply?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We welcome passionate experts ready to share their knowledge and shape the future of learners.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 mb-12">
            {categories.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-6 shadow-sm  border-2 border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="p-4 bg-gray-50 rounded-full mb-4 group-hover:bg-blue-50 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <p className="text-blue-900 font-medium">
                <span className="font-bold">Minimum requirement:</span> 2+ years of relevant experience in your field is mandatory.
              </p>
            </div>
          </div>

        </div>
      </section>
      {/* Testimonials Section - trainer review */}
      {/* bg-[#2D274B]  e0fa84*/}
      {/* <section className=" py-12 px-6 ">
        <h2 className="text-5xl md:text-4xl sm:text-3xl font-bold text-center mb-12 text-[#5186cd]">
          Straight from the Heart ❤️
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 ">
          {[
            {
              quote:
                "Teaching at LearnOsphere has given me the freedom to connect with passionate learners and grow my skills every day.",
              name: "Aarav Sharma",
              role: "IELTS Trainer",
            },
            {
              quote:
                "The best part is the flexibility — I can teach students globally from the comfort of my home.",
              name: "Neha Verma",
              role: "Spoken English Coach",
            },
            {
              quote:
                "LearnOsphere’s community of trainers is amazing. You always feel supported and valued.",
              name: "Ravi Kumar",
              role: "Communication Skills Trainer",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              className="bg-blue-50 rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-all hover:bg-[#e5f2b4] font-semibold"
              whileHover={{ scale: 1.02 }}
            >
              <p className="italic text-[#2D274B] mb-4">“{t.quote}”</p>
              <div className="font-bold text-blue-700">{t.name}</div>
              <div className="text-sm font-bold text-[#2D274B]">{t.role}</div>
            </motion.div>
          ))}
        </div>
      </section> */}

      {/*Image on Top + Then Trainer FAQs Section */}
      <section className="py-8 " aria-labelledby="trainer-faq">
        <motion.div
          className="w-full px-4 pb-5"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-lg aspect-[7/2]">
            <img
              src={image1}
              alt="Global teaching"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </motion.div>

        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2
              id="trainer-faq"
              className="text-4xl md:text-4xl font-extrabold text-[#5186cd]"
            >
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-[#2D274B] text-lg font-bold max-w-2xl mx-auto">
              Everything you need to know before starting your teaching journey
              with LEARNiLM🌎WORLD.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What kind of trainers do you look for?",
                a: "We welcome anyone passionate about teaching — no formal certification needed. If you love sharing knowledge, have good communication skills, and can personalize learning for global students, you’re a great fit.",
              },
              {
                q: "What subjects can I teach?",
                a: "You can teach from a wide range — from languages to academic and skill-based subjects. If you’re skilled in something, there’s likely a learner waiting for you!",
              },
              {
                q: "How do I become a trainer?",
                a: "Simply create your trainer profile, upload a photo, describe your teaching style, and record a short intro video. Once you complete these steps, our team reviews your profile within 2–3 business days.",
              },
              {
                q: "How can I get my profile approved quickly?",
                a: "Use a clear, real photo, add a short 1–2 minute video, and write an authentic description of your strengths. Avoid adding contact details or pricing in your profile to speed up approval.",
              },
              {
                q: "Why teach with LEARNiLM🌎WORLD?",
                a: "You earn while helping students learn, set your own schedule, reach learners globally, and receive secure payments. Plus, you get access to growth webinars, community support, and built-in teaching tools.",
              },
              {
                q: "How much can I earn?",
                a: "Top trainers earn between ₹15,000–₹65,000 ($180–$780) per month depending on your hourly rate, session count, and student retention. You can adjust your rates anytime.",
              },
              {
                q: "What equipment do I need?",
                a: "A laptop or desktop, stable internet, webcam, and microphone are all you need to teach effectively in our virtual classroom.",
              },
              {
                q: "Is there any joining cost?",
                a: "It’s completely free to create your profile and start teaching. LearniLMWorld only takes a small commission per lesson to maintain platform quality and marketing reach.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-${i}`}
                >
                  <span className="font-semibold text-lg text-gray-800">
                    {f.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="ml-4 bg-blue-100 text-blue-600 w-8 h-8 items-center justify-center flex rounded-full flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <motion.div
                  id={`faq-${i}`}
                  initial={false}
                  animate={{
                    height: openFaq === i ? "auto" : 0,
                    opacity: openFaq === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 bg-blue-50 pb-5 text-md leading-relaxed text-gray-700 border-t border-blue-100">
                    {f.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center py-20 px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold mb-6 text-[#2D274B]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Ready to Start Your Journey as a Trainer?
        </motion.h2>
        <motion.button
          onClick={() => navigate("/register?role=trainer")}
          className="px-10 py-4  bg-white  text-[#276dc9] font-semibold text-lg rounded-full shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
        >
          Get Started Now
        </motion.button>
      </section>

      <Footer />
    </div>
    </>
  );
};

export default BecomeTrainer;
