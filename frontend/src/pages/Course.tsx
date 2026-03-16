// import { useEffect, useState } from "react";
// import axios from "axios";
// import heroImage from "../assets/office_politics.png";
// import CourseCard from "../components/CourseCard";
// import { motion } from 'framer-motion'
// import { Link, useNavigate } from "react-router-dom";
// import { Target, ShieldCheck, Zap, BookOpen, Award, Clock, ChevronDown, ChevronUp } from "lucide-react";
// import Footer from "../components/Footer";
// import Navbar from "../components/Navbar";


// const SkeletonCard = () => (
//   <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
//     <div className="h-48 bg-gray-300"></div> {/* Image Placeholder */}
//     <div className="p-6 space-y-3">
//       <div className="h-6 bg-gray-300 rounded w-3/4"></div> {/* Title */}
//       <div className="h-4 bg-gray-200 rounded w-full"></div> {/* Desc */}
//       <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//       <div className="flex justify-between mt-4">
//         <div className="h-8 bg-gray-300 rounded w-20"></div> {/* Button */}
//       </div>
//     </div>
//   </div>
// );


// const Courses = () => {
  //   const navigate = useNavigate();
  // const [user, setUser] = useState(null);
  // const [showOffcanvas, setShowOffcanvas] = useState(false);
  // const [loading, setLoading] = useState(true);
  // const [courses, setCourses] = useState([]);
  // const [showAll, setShowAll] = useState(false);
  // const [activeAccordion, setActiveAccordion] = useState<number | null>(null);


  // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // const plans = [
  //   {
  //     title: "Plan 1",
  //     subtitle: "For individuals",
  //     price: "$19",
  //     features: ["Feature 1"],
  //     btnStyle: "secondary",
  //   },
  //   {
  //     title: "Plan 2",
  //     subtitle: "For medium teams",
  //     price: "$35",
  //     features: ["Feature 1", "Feature 2"],
  //     btnStyle: "primary",
  //   },
  //   {
  //     title: "Plan 3",
  //     subtitle: "For large teams",
  //     price: "$49",
  //     features: ["Feature 1", "Feature 2", "Feature 3"],
  //     btnStyle: "secondary",
  //   },
  // ];

  //Features
  // const features = [
  //   {
  //     title: "Research-Backed Methods",
  //     desc: "All strategies grounded in the latest psychology and organizational research.",
  //     icon: <Target className="w-6 h-6 text-[#276dc9]" />
  //   },
  //   {
  //     title: "100% Ethical Approach",
  //     desc: "Learn to succeed without compromising your values or integrity.",
  //     icon: <ShieldCheck className="w-6 h-6 text-[#276dc9]" />
  //   },
  //   {
  //     title: "Actionable Frameworks",
  //     desc: "Practical tools you can apply immediately in your workplace.",
  //     icon: <Zap className="w-6 h-6 text-[#276dc9]" />
  //   },
  //   {
  //     title: "Expert Instructors",
  //     desc: "Learn from professionals with decades of corporate experience.",
  //     icon: <BookOpen className="w-6 h-6 text-[#276dc9]" />
  //   },
  //   {
  //     title: "Certificate of Completion",
  //     desc: "Earn credentials to showcase your professional development.",
  //     icon: <Award className="w-6 h-6 text-[#276dc9]" />
  //   },
  //   {
  //     title: "Lifetime Access",
  //     desc: "Learn at your own pace with unlimited access to all materials.",
  //     icon: <Clock className="w-6 h-6 text-[#276dc9]" />
  //   },
  // ];


  //faq
  // const faqs = [
  //   { q: "Who are these courses designed for?", a: "These courses are designed for professionals at all levels who want to learn different languages." },
  //   { q: "Is this about manipulating people?", a: "Absolutely not. We focus on ethical influence, emotional intelligence, and constructive communication." },
  //   { q: "How long do I have access to the courses?", a: "You get the course for the limited time period." },
  //   { q: "Do you offer refunds?", a: "Yes, we offer a 30-day money-back guarantee if you are not satisfied." },
  //   { q: "Can I get a certificate upon completion?", a: "Yes, all our courses come with a verifiable certificate of completion." },
  //   { q: "Are the courses available in multiple languages?", a: "Yes, the courses are available in multiple languages." },
  // ];


  // useEffect(() => {
  //   setLoading(true)
  //   axios
  //     .get(`${API_BASE_URL}/api/courses`)
  //     .then((res) => {
  //       setCourses(res.data)
  //       setLoading(false)
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //       setLoading(false)
  //     });

  // }, []);


  // const displayedCourses = showAll ? courses : courses.slice(0, 3)
  // const toggleAccordion = (index: number) => {
  //   setActiveAccordion(activeAccordion === index ? null : index);
  // };

  // const fadeInUp = {
  //   hidden: { opacity: 0, y: 40 },
  //   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  // };

  // const staggerContainer = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.2
  //     }
  //   }
  // };

  // return (
  //   <div className="min-h-screen bg-[#fef5e4]">

  //     <Navbar />

  //     {/* --- HERO SECTION --- */}
  //     <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 overflow-hidden">
  //       <div className="flex flex-col md:flex-row items-center justify-between gap-12">

  //         <motion.div
  //           initial={{ opacity: 0, x: -50 }}
  //           whileInView={{ opacity: 1, x: 0 }}
  //           transition={{ duration: 0.8 }}
  //           viewport={{ once: true }}
  //           className="md:w-1/2 space-y-6"
  //         >
  //           <h1 className="text-4xl md:text-5xl font-extrabold leading-tight" style={{ color: "#5186cd" }}>
  //             Exclusive Courses <br /> offered by Us
  //           </h1>
  //           <p className="text-gray-600 text-lg max-w-md">
  //             Explore the courses that fit your needs and navigate the workplace with confidence.
  //           </p>
  //           <div className="flex flex-wrap gap-4 pt-2">
  //             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-[#276dc9] text-white rounded-lg font-semibold shadow hover:bg-[#205eb0] transition">
  //               Browse Courses
  //             </motion.button>
  //             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-[#f1ead6] border border-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition">
  //               Apply for Subscription
  //             </motion.button>
  //           </div>
  //         </motion.div>

  //         <motion.div
  //           initial={{ opacity: 0, x: 50 }}
  //           whileInView={{ opacity: 1, x: 0 }}
  //           transition={{ duration: 0.8 }}
  //           viewport={{ once: true }}
  //           className="md:w-1/2 relative"
  //         >
  //           <div className="bg-[#FFE4C4] absolute -top-4 -right-4 w-full h-full rounded-[7rem] -z-10 transform rotate-2"></div>
  //           <img src={heroImage} alt="Office Politics" className="w-full h-auto rounded-[7rem] shadow-xl border-4 border-white object-cover" />
  //         </motion.div>
  //       </div>
  //     </div>

      {/* --- COURSES GRID SECTION --- */}
      // <div className="max-w-7xl mx-auto px-6 py-12">
      //   <motion.div
      //     initial="hidden"
      //     whileInView="visible"
      //     viewport={{ once: true }}
      //     variants={fadeInUp}
      //     className="text-center mb-12"
      //   >
      //     <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#5186cd" }}>
      //       Workplace Mastery, The Office Winner's Playbooks
      //     </h2>
      //     <p className="text-gray-500 font-medium">Featured Best Selling Courses</p>
      //   </motion.div>

      //   {loading ? (
      //     <>
      //       <SkeletonCard />
      //       <SkeletonCard />
      //       <SkeletonCard />
      //     </>
      //   )
      //     : (
      //       <motion.div
      //         variants={staggerContainer}
      //         initial="hidden"
      //         whileInView="visible"
      //         viewport={{ once: true }}
      //         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      //       >

      //         {displayedCourses.length > 0 ? (
      //           displayedCourses.map((course: any) => (
      //             <motion.div key={course._id} variants={fadeInUp}>
      //               <CourseCard course={course} />
      //             </motion.div>
      //           ))
      //         ) : (
      //           <p className="text-center col-span-full text-gray-400">No courses...</p>

      //         )}
      //       </motion.div>
      //     )}

      //   {!loading && courses.length > 3 && (
      //     <div className="flex justify-center mt-12">
      //       <button
      //         onClick={() => setShowAll(!showAll)}
      //         className="px-8 py-3 rounded-full border-2 border-[#5186cd] text-[#276dc9] font-semibold hover:bg-[#205eb0] transition-colors duration-300"
      //       >
      //         {showAll ? "Show Less ↑" : "View More Courses ↓"}
      //       </button>
      //     </div>
      //   )}
      // </div>

      {/* --- PRICING SECTION --- */}
      // <div className="max-w-7xl mx-auto px-6 py-20 pb-32">
      //   <motion.div
      //     initial="hidden"
      //     whileInView="visible"
      //     viewport={{ once: true }}
      //     variants={staggerContainer}
      //     className="grid grid-cols-1 md:grid-cols-3 gap-8"
      //   >
      //     {plans.map((plan, index) => (
      //       <motion.div
      //         key={index}
      //         variants={fadeInUp}
      //         whileHover={{ y: -10 }}
      //         className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
      //       >
      //         <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
      //         <p className="text-sm text-gray-500 mb-6">{plan.subtitle}</p>
      //         <div className="flex items-baseline mb-6">
      //           <span className="text-4xl font-bold text-black">{plan.price}</span>
      //           <span className="text-gray-500 ml-1">/ month</span>
      //         </div>
      //         <ul className="space-y-3 mb-8 flex-grow">
      //           {plan.features.map((feature, i) => (
      //             <li key={i} className="flex items-center text-gray-700 text-sm">
      //               <span className="mr-2 text-black">✓</span> {feature}
      //             </li>
      //           ))}
      //         </ul>
      //         <button className={`w-full py-3 rounded-lg font-semibold transition ${plan.btnStyle === "primary" ? "bg-[#276dc9] text-white hover:bg-[#205eb0] shadow-md" : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"}`}>
      //           {plan.btnStyle === "primary" ? "Sign up" : "Sign up"}
      //         </button>
      //       </motion.div>
      //     ))}
      //   </motion.div>
      // </div>

      {/* --- FEATURES SECTION --- */}
      // <div className="py-20 px-6">
      //   <div className="max-w-7xl mx-auto">
      //     <motion.div
      //       initial={{ opacity: 0, y: 30 }}
      //       whileInView={{ opacity: 1, y: 0 }}
      //       viewport={{ once: true }}
      //       transition={{ duration: 0.6 }}
      //       className="text-center mb-16"
      //     >
      //       <span className="text-[#5186cd] font-semibold tracking-wider text-sm uppercase block mb-2">Why Choose Us</span>
      //       <h2 className="text-4xl font-bold text-[#111827] mb-4 ">The Premium Learning Experience</h2>
      //       <p className="text-gray-500 max-w-2xl mx-auto">We've designed our courses to deliver real results through proven methodologies and practical application.</p>
      //     </motion.div>

      //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      //       {features.map((item, index) => (
      //         <motion.div
      //           key={index}
      //           initial={{ opacity: 0, scale: 0.9 }}
      //           whileInView={{ opacity: 1, scale: 1 }}
      //           viewport={{ once: true }}
      //           transition={{ duration: 0.5, delay: index * 0.1 }}
      //           whileHover={{ scale: 1.05 }}
      //           className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      //         >
      //           <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
      //             {item.icon}
      //           </div>
      //           <h3 className="text-xl font-bold text-[#111827] mb-3 ">{item.title}</h3>
      //           <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
      //         </motion.div>
      //       ))}
      //     </div>
      //   </div>
      // </div>

      {/* --- FAQ SECTION --- */}
//       <div className="py-20 px-6">
//         <div className="max-w-4xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-center mb-12"
//           >
//             <span className="text-[#5186cd] font-semibold tracking-wider text-sm uppercase block mb-2">FAQ</span>
//             <h2 className="text-4xl font-bold text-[#111827] mb-4 ">Frequently Asked Questions</h2>
//             <p className="text-gray-500">Have questions? We've got answers.</p>
//           </motion.div>

//           <div className="space-y-4">
//             {faqs.map((faq, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, x: -20 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
//               >
//                 <button onClick={() => toggleAccordion(index)} className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none">
//                   <span className="text-lg font-semibold text-[#111827]">{faq.q}</span>
//                   {activeAccordion === index ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
//                 </button>
//                 <div className={`px-6 text-gray-500 transition-all duration-300 ease-in-out overflow-hidden ${activeAccordion === index ? "max-h-40 py-4 pb-6" : "max-h-0"}`}>
//                   {faq.a}
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- CALL TO ACTION --- */}
//       <div className="py-20 px-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95, y: 50 }}
//           whileInView={{ opacity: 1, scale: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="max-w-4xl mx-auto bg-[#5186cd] rounded-[2.5rem] py-10 px-6 md:px-16 text-center text-white shadow-2xl relative overflow-hidden"
//         >
//           <div className="relative z-10">
//             <h2 className="text-2xl md:text-4xl  font-bold mb-6 text-white leading-tight">Ready to Transform Your Career?</h2>
//             <p className="text-gray-300 text-base mb-10 max-w-2xl mx-auto">Join thousands of professionals who have mastered the art of ethical office politics. Start your journey to career success today.</p>
//             <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
//               <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-4  text-[#276dc9] bg-white rounded-lg font-bold  transition flex items-center justify-center shadow-lg">
//                 Get Started Now <span className="ml-2">→</span>
//               </motion.button>
//               <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-4 bg-transparent border border-gray-600 text-white rounded-lg font-bold hover:bg-gray-800 transition shadow-lg">
//                 View All Courses
//               </motion.button>
//             </div>
//             <div className="w-full h-px bg-gray-800 mb-8 max-w-3xl mx-auto"></div>
//             <div className="flex flex-col md:flex-row justify-center gap-y-4 gap-x-8 text-sm text-gray-300">
//               <span className="flex items-center justify-center gap-2"><span className="text-white">✓</span> 30-Day Money-Back Guarantee</span>
//               <span className="flex items-center justify-center gap-2"><span className="text-white">✓</span> Lifetime Access</span>
//               <span className="flex items-center justify-center gap-2"><span className="text-white">✓</span> Certificate Included</span>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Courses;


import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Dot, User } from 'lucide-react';
import logo from '../assets/CommingSoon.png';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Courses = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      {/* --- TOP SECTION --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-grow flex flex-col items-center justify-center px-4 pt-16 pb-12"
      >
        {/* Launching Soon Pill */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center  text-blue-500 justify-center w-auto bg-white border border-gray-100 shadow-sm px-4 py-1.5 rounded-full mb-8"
        >
          <Dot className="w-6 h-6 " />
          <span className="font-semibold text-sm">Launching Soon</span>
        </motion.div>

        {/* Illustration */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 w-48 h-auto"
        >
          <img src={logo} alt="Illustration of person at desk" className="w-full object-contain" />
        </motion.div>

        {/* Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center"
        >
          Courses Are <span className="text-blue-500">Coming Soon 🚀</span>
        </motion.h1>

        {/* Paragraph text */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-gray-500 text-center max-w-2xl text-base md:text-lg mb-8"
        >
          We're preparing high-quality courses with native trainers to help you learn
          languages and subjects effectively. Stay tuned for exciting learning experiences.
        </motion.p>
      </motion.div>

      {/* --- BOTTOM TRAINER CARD SECTION --- */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full flex justify-center px-4 py-16"
      >
        <div className="bg-[#E4EDFA] rounded-3xl p-8 md:p-10 flex flex-col items-center text-center max-w-3xl w-full">
          {/* Trainer Icon/Emoji */}
          <div className="text-4xl mb-3">🧑‍🏫</div>
          
          <p className="text-blue-600 font-semibold mb-2">Don't wait</p>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Connect with Expert Trainers Now
          </h3>
          <p className="text-blue-400 max-w-xl mb-8">
            While courses are being prepared, you can still connect with our expert trainers for 1-on-1 sessions and Group sessions.
          </p>
          
          <Link to='/main'>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 bg-[#024aac] hover:bg-[#033e91] text-white px-8 py-3 rounded-full font-medium transition-colors shadow-sm"
            >
            <User className="w-5 h-5" /> Browse Trainers
          </motion.button>
            </Link>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Courses;
