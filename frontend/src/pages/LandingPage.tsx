import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
//  Facebook,Twitter,Instagram,Linkedin,Mail, Globe,
// import { Nav, Container, Offcanvas, Button } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext";
import {
  BookOpen,
  Play,
  Mic,
  Headphones,
  Calendar,
  Users,
  Award,
  Clock,
  Star,
  MessageSquare,
  ChevronDown,
  User,
} from "lucide-react";
// Navbar, ChevronRight, ArrowRight,from above
// import logo from "../assets/LearnilmworldLogo.jpg";
// import russian_student from '../assets/russian_student.png'
import "bootstrap/dist/css/bootstrap.min.css";

import french_st from "../assets/French_student1.jpeg";
import german_st from "../assets/German_student1.jpeg";
import british_st from "../assets/British_student1.jpeg";
import spanish_st from "../assets/Spanish_student1.jpeg";
import japanese_st from "../assets/Japanese_student1.jpeg";
import arab_student from "../assets/arabian_student1.jpeg";
import indian_st from "../assets/Indian_student1.jpeg";
// import chi_student from '../assets/chinese_student.png'

import spain_flag from "../assets/Spain_flag.jpeg";
import france_flag from "../assets/france_flag.jpeg";
import jap_flag from "../assets/Jap_flag.jpeg";
import ind_flag from "../assets/Indian_flag.jpeg";
import ger_flag from "../assets/German_flag.jpeg";
import brit_flag from "../assets/brit_flag.jpeg";
import arab_flag from "../assets/arab_flag.jpeg";

// import heroImage1 from '../assets/Hero_image1.png'
// import heroImage2 from '../assets/Hero_image2.jpg'

import heroImage3 from "../assets/together child1.png";

import math from "../assets/Maths_new.jpeg";
import hist from "../assets/History_new.png";
import geo from "../assets/Geography_new.jpeg";
import phy from "../assets/Physics_new.jpeg";
import chem from "../assets/Chemistry_new.jpeg";
import bio from "../assets/Biology_new.jpeg";
import cs from "../assets/ComputerScience_new.png";
import Footer from "../components/Footer";
import TopTrainers from "../components/TopTrainers";
// import { LanguageCard } from '../components/LanguageCard'
import Navbar from "../components/Navbar";
// import MoreLanguages from '../components/MoreLanguages'

// LinguaNest — Enhanced Landing Page (single-file React component)
// Adjusted image positions: hero image lifted up slightly and the three overlapping
// cards have been moved upwards for a stronger visual overlap and nicer composition.
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LandingPageAlt() {
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // const [showOffcanvas, setShowOffcanvas] = useState(false)
  const [activeFaq, setActiveFaq] = useState("learner");

  const [activeCategory, setActiveCategory] = useState<"popular" | "asian" | "euro" | "africa" | "more">("popular");

  const [showMore, setShowMore] = useState(false);
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);
  const [showMoreHobbies, setShowMoreHobbies] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const PHRASES: string[] = [
    "Welcome to LearniLMWorld",           // English
    "LearniLMWorld में आपका स्वागत है",   // Hindi
    "LearniLMWorld-এ স্বাগতম",           // Bengali
    "Bienvenue à LearniLMWorld",          // French
    "Willkommen bei LearniLMWorld",        // German
    "LearnilmWorldへようこそ",            //Japanese
  ];


  const [currentText, setCurrentText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseBeforeDelete = 2000;
    const pauseBeforeType = 500;

    const handleTyping = () => {
      const fullPhrase = PHRASES[currentIndex];

      if (!isDeleting) {
        setCurrentText(fullPhrase.substring(0, currentText.length + 1));

        // If the word is completely typed, pause and then start deleting
        if (currentText === fullPhrase) {
          setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
          return;
        }
      } else {
        // Deleting phase
        setCurrentText(fullPhrase.substring(0, currentText.length - 1));

        // If the word is completely deleted, move to the next language
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % PHRASES.length);

          // Pause slightly before typing the next phrase
          return;
        }
      }
    };

    // Determine the current speed based on the action
    const timerSpeed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(handleTyping, currentText === "" && !isDeleting ? pauseBeforeType : timerSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentIndex]);

  // languages
  const handleLanguageClick = async (language: any) => {
    const trainerMap: Record<string, string> = {
      German: "trainer_id_for_german",
      French: "trainer_id_for_french",
      Japanese: "trainer_id_for_japanese",
      Spanish: "trainer_id_for_spanish",
      English: "68ef33d0cad95b62472f382a",
      Sanskrit: "trainer_id_for_sanskrit",
      Russian: "",
      Arabic: "68ef33d0cad95b62472f382a",
      Mandarin: "",
    };

    const trainerId = trainerMap[language];

    if (!trainerId)
      return alert(
        "We are currently finalizing a top-tier expert for this Language. We believe in providing the best quality education, so we are taking a little extra time to find the perfect instructor.",
      );

    if (!user) {
      // Save the clicked language temporarily for redirect after login
      localStorage.setItem(
        "redirectAfterLogin",
        `/main?type=language&language=${encodeURIComponent(language)}`,
      );
      navigate("/login");
    } else {
      navigate(`/main?type=language&language=${encodeURIComponent(language)}`);
    }
  };

  const handleMoreLanguageClick = (languageName: any) => {
    const languageTrainerMap: Record<string, string> = {
      Sanskrit: "68f244c9e88b2371b4194d2c",
      Russian: "68f244c9e88b2371b4194d2c",
      Mandarin: "trainer_id_for_mandarin",
      Thai: "trainer_id_for_thai",
      Bengali: "trainer_id_for_bengali",
      Swahili: "trainer_id_for_swahili",
      Italian: "trainer_id_for_italian",
      Portuguese: "trainer_id_for_portuguese",
      Korean: "trainer_id_for_korean",
    };

    const trainerId = languageTrainerMap[languageName];

    if (!trainerId) {
      alert("Trainer not found !");
      setShowMoreLanguages(false);
      return;
    }

    if (!user) {
      localStorage.setItem(
        "redirectAfterLogin",
        `/main?type=language&language=${encodeURIComponent(languageName)}`,
      );
      navigate("/login");
    } else {
      navigate(`/main?type=language&language=${encodeURIComponent(languageName)}`);
    }

    setShowMoreLanguages(false);
  };

  // Hobbies
  const handleHobbyClick = (hobby: any) => {
    if (hobby.isMore) {
      setShowMoreHobbies(true);
      return;
    }

    const hobbyTrainerMap: Record<string, string> = {
      Painting: "trainer_id_painting",
      Dancing: "trainer_id_dancing",
      Cooking: "trainer_id_cooking",
      Photography: "68ef33d0cad95b62472f382a",
      Singing: "68ef33d0cad95b62472f382a",
      Fitness: "",
    };

    const trainerId = hobbyTrainerMap[hobby.name];

    if (!trainerId)
      return alert(
        "We are currently finalizing a creative expert for this passion. We believe learning a new skill should be inspiring, so we are taking a little extra time to find the perfect mentor to guide you.",
      );

    if (!user) {
      localStorage.setItem(
        "redirectAfterLogin",
        `/main?type=hobby&hobby=${encodeURIComponent(hobby.name)}`,
      );
      navigate("/login");
    } else {
      navigate(`/main?type=hobby&hobby=${encodeURIComponent(hobby.name)}`);
    }
  };

  const handleMoreHobbyClick = (hobbyName: string) => {
    const trainerMap: Record<string, string> = {
      Yoga: "68f244c9e88b2371b4194d2c",
      Calligraphy: "68f244c9e88b2371b4194d2c",
      Gardening: "",
      Knitting: "",
    };

    const trainerId = trainerMap[hobbyName];

    if (!trainerId) {
      alert(
        "We are currently finalizing a creative expert for this passion. We believe learning a new skill should be inspiring, so we are taking a little extra time to find the perfect mentor to guide you.",
      );
      setShowMoreHobbies(false);
      return;
    }

    if (!user) {
      localStorage.setItem(
        "redirectAfterLogin",
        `/main?type=hobby&hobby=${encodeURIComponent(hobbyName)}`,
      );
      navigate("/login");
    } else {
      navigate(`/main?type=hobby&hobby=${encodeURIComponent(hobbyName)}`);
    }

    setShowMoreHobbies(false);
  };
  // subjects
  const handleSubjectClick = (subject: any) => {
    if (subject.isMore) {
      setShowMore(true);
      return;
    }

    const subjectTrainerMap: Record<string, string> = {
      History: "trainer_id_for_history",
      Geography: "trainer_id_for_geography",
      Physics: "690dc8cb64cc3e1c19580f24",
      Chemistry: "690dc8cb64cc3e1c19580f24",
      Mathematics: "690dc8cb64cc3e1c19580f24",
      Biology: "trainer_id_for_biology",
      "Computer Science": "trainer_id_for_computer_science",
      Economics: "trainer_id_for_economics",
      Hindi: "trainer_id_for_hindi",
      Bengali: "trainer_id_for_bengali",
      Psychology: "trainer_id_for_psychology",
      Philosophy: "690dc8cb64cc3e1c19580f24",
      EVS: "trainer_id_for_evs",
      "Accounts & Finance": "trainer_id_for_accounts_finance",
    };

    const trainerId = subjectTrainerMap[subject.name];

    if (!trainerId) {
      alert(
        "We are currently finalizing a top-tier expert for this subject. We believe in providing the best quality education, so we are taking a little extra time to find the perfect instructor.",
      );
      return;
    }

    if (!user) {
      // Store redirect path for after login
      localStorage.setItem(
        "redirectAfterLogin",
        `/main?type=subject&subject=${encodeURIComponent(subject.name)}`,
      );
      navigate("/login");
    } else {
      navigate(`/main?type=subject&subject=${encodeURIComponent(subject.name)}`);
    }
  };

  const handleMoreSubjectClick = (subjectName: string) => {
    const subjectTrainerMap: Record<string, string> = {
      Economics: "trainer_id_for_economics",
      Hindi: "690dc8cb64cc3e1c19580f24",
      Bengali: "690dc8cb64cc3e1c19580f24",
      Psychology: "trainer_id_for_psychology",
      Philosophy: "690dc8cb64cc3e1c19580f24",
      EVS: "trainer_id_for_evs",
      "Accounts & Finance": "trainer_id_for_accounts_finance",
    };

    const trainerId = subjectTrainerMap[subjectName];

    if (!trainerId) {
      alert(
        "We are currently finalizing a top-tier expert for this subject. We believe in providing the best quality education, so we are taking a little extra time to find the perfect instructor.",
      );
      setShowMore(false);
      return;
    }

    if (!user) {
      localStorage.setItem(
        "redirectAfterLogin",
        `/main?type=subject&subject=${encodeURIComponent(subjectName)}`,
      );
      navigate("/login");
    } else {
      navigate(`/main?type=subject&subject=${encodeURIComponent(subjectName)}`)
    }

    setShowMore(false);
  };

  useEffect(() => setMounted(true), []);

  const languages = [
    {
      lang: "English",
      flag: "gb",
      bg: brit_flag,
      hoverBg: british_st,
      pattern: "Cambridge English",
      headline: "Master English for Real-World Communication",
      subtitle: "Build confidence for global conversations",
      levels: [
        "A2 — Understand daily expressions & common conversations",
        "B1 — Participate in detailed discussions with confidence",
        "B2 — Communicate fluently in academic & professional settings",
      ],
      idealFor: "🌍 Ideal for work, travel, study & global opportunities",
    },
    {
      lang: "Spanish",
      flag: "es",
      bg: spain_flag,
      hoverBg: spanish_st,
      pattern: "DELE Pattern",
      headline: "Learn Spanish for Everyday Life & Global Communication",
      subtitle: "Speak confidently in real-world situations",
      levels: [
        "A1 — Everyday vocabulary & essential phrases",
        "A2 — Converse confidently about daily life",
        "B1 — Express opinions, travel & work conversations",
      ],
      idealFor: "🌍 Ideal for students, travelers & career growth",
    },
    {
      lang: "Japanese",
      flag: "jp",
      bg: jap_flag,
      hoverBg: japanese_st,
      pattern: "JLPT / Japan Foundation",
      headline: "Learn Japanese the Right Way",
      subtitle: "From basics to real Japanese understanding",
      levels: [
        "N5 — Basic greetings & essential phrases",
        "N4 — Daily conversation & reading practice",
        "N3 — Understand news, articles & real content",
      ],
      idealFor: "🎌 Ideal for exams, anime lovers & Japan aspirants",
    },
    {
      lang: "German",
      flag: "de",
      bg: ger_flag,
      hoverBg: german_st,
      pattern: "MMB Pattern",
      headline: "Learn German with Confidence — Step by Step",
      subtitle: "Structured learning for life, work & study",
      levels: [
        "A1 — Basic introductions & everyday phrases",
        "A2 — Travel, shopping & daily conversations",
        "B1 — Speak confidently for work, study & life",
      ],
      idealFor:
        "🌍 Perfect for students, professionals & study-abroad aspirants",
    },
    {
      lang: "French",
      flag: "fr",
      bg: france_flag,
      hoverBg: french_st,
      pattern: "DELF Pattern",
      headline: "Master French for Real Conversations",
      subtitle: "Learn French the natural, practical way",
      levels: [
        "A1 — Greetings & simple interactions",
        "A2 — Conversations on daily topics",
        "B1 — Fluent discussions, media & opinions",
      ],
      idealFor: "✨ Learn French for culture, travel & communication",
    },
    {
      lang: "Arabic",
      flag: "sa",
      bg: arab_flag,
      hoverBg: arab_student,
      pattern: "ALPT / Arabic Language Proficiency Test",
      headline: "Master Arabic from Basics to Fluent Understanding",
      subtitle: "Build strong foundations in Modern Arabic",
      levels: [
        "A1 — Learn alphabets, pronunciation & greetings",
        "A2 — Daily conversation & short texts",
        "B1 — Understand media, formal speech & writing",
      ],
      idealFor: "🌙 Ideal for work, travel, education & cultural learning",
    },
    {
      lang: "Sanskrit",
      flag: "in",
      bg: ind_flag,
      hoverBg: indian_st,
      pattern: "Yoga, Mantras & Ancient Texts",
      headline: "Unlock the Wisdom of Sanskrit",
      subtitle: "Connect with India’s ancient knowledge system",
      levels: [
        "A1 — Read & understand basic Sanskrit letters and words",
        "A2 — Chant and understand traditional mantras",
        "B1 — Comprehend ancient texts, shlokas & scriptures",
      ],
      idealFor: "🌿 Ideal for culture, spirituality, yoga & heritage learners",
    },
  ];

  const pop_lang = [
    { lang: "English", code: "gb" },
    { lang: "French", code: "fr" },
    { lang: "German", code: "de" },
    { lang: "Spanish", code: "es" },
    { lang: "Portuguese", code: "pt" },
    { lang: "Korean", code: "kr" },
    { lang: "Italian", code: "it" },
    { lang: "Japanese", code: "jp" },
  ];

  const asian_lang = [
    { lang: "Bengali", code: "in" },
    { lang: "Japanese", code: "jp" },
    { lang: "Sanskrit", code: "in" },
    { lang: "Mandarin", code: "cn" },
    { lang: "Hindi", code: "in" },
    { lang: "Korean", code: "kr" },
    { lang: "Thai", code: "th" },
    { lang: "Marathi", code: "in" },
  ];

  const euro_usa_lang = [
    { lang: "English", code: "gb" },
    { lang: "German", code: "de" },
    { lang: "French", code: "fr" },
    { lang: "Russian", code: "ru" },
  ];

  const africa_mid_east_lang = [
    { lang: "Arabic", code: "sa" },
    // { lang: "Swahili", code: "ke" },
  ];

  const languageGroups: Record<string, { lang: string; code: string }[]> = {
    popular: pop_lang,
    asian: asian_lang,
    euro: euro_usa_lang,
    africa: africa_mid_east_lang,
  };

  const steps = [
    {
      ind: "01",
      icon: Users,
      title: "Find your trainer",
      desc: "Smart filters: language, accent, price, availability and student ratings.",
    },
    {
      ind: "02",
      icon: BookOpen,
      title: "Book a session",
      desc: "One-click booking, instant calendar sync and secure payments.",
    },
    {
      ind: "03",
      icon: Play,
      title: "Practice & improve",
      desc: "Live lessons, role-plays, recordings and tailored homework.",
    },
    {
      ind: "04",
      icon: Award,
      title: "Track progress",
      desc: "Personal dashboard, streaks, and certificates.",
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "Flexible Hours",
      text: "Lessons at any time — morning, night or weekends.",
    },
    {
      icon: MessageSquare,
      title: "Expert Trainers",
      text: "Certified tutors with real teaching experience.",
    },
    {
      icon: Star,
      title: "Real outcomes",
      text: "Our curriculum is outcome-focused so you can see measurable improvement",
    },
  ];

  const learnerFaqs = [
    {
      q: "How do I choose a trainer?",
      a: "Use filters (experience, rating, price) and send a short message to get a feel. Look for video intros and student reviews.",
    },
    {
      q: "What languages are available?",
      a: "20+ languages including Spanish, French, German, Chinese, Japanese, Arabic and many dialects.",
    },
    {
      q: "How do payments work?",
      a: "We use Stripe for secure checkout. Cards and Apple/Google Pay are accepted where available.",
    },
    {
      q: "Can I reschedule or cancel?",
      a: "Reschedule up to 24 hours before a session. Some trainers may have different policies — check their profile.",
    },
    {
      q: "Do trainers provide materials?",
      a: "Many trainers include PDFs, flashcards or audio.",
    },
    {
      q: "Is there a mobile app?",
      a: "Coming soon — our PWA works great on mobile and can be installed to your home screen.",
    },
  ];

  const tutorFaqs = [
    {
      q: "What is the procedure to become a tutor at LearniLM🌍World?",
      a: "Becoming a tutor involves a few simple steps — from applying to onboarding. Here’s how you can start your journey with us:",
    },
    {
      q: "Step 1: How do I submit my application?",
      a: "Begin by submitting your application through our official LearniLM🌍World website. Make sure your details are accurate and complete.",
    },
    {
      q: "Step 2: What happens after I apply?",
      a: "Our recruitment team will carefully review your application within 7 working days. You’ll receive an update about your application status via email.",
    },
    {
      q: "Step 3: What is the interview and evaluation process?",
      a: "If your profile meets our criteria, you’ll be invited for an interview and assessment. This step evaluates your communication and conversational teaching skills.",
    },
    {
      q: "Step 4: What happens after the evaluation?",
      a: "After successfully completing the evaluation, our team provides personalized feedback and necessary training to align your teaching with our methods.",
    },
    {
      q: "Step 5: How does onboarding work?",
      a: "Once you complete the required steps and training, you officially join LearniLM🌍World as a tutor — ready to empower learners with improved spoken English skills.",
    },
  ];

  const faqs = activeFaq === "learner" ? learnerFaqs : tutorFaqs;

  const reviews = [
    {
      name: "Sarath",

      text: "The trainers are excellent — practical and patient. After a month I was comfortable conducting client calls in Spanish. The homework and recorded sessions were invaluable.",
      rating: 5,
    },
    {
      name: "Murali",
      text: "Lessons are structured but flexible. My speaking confidence improved rapidly. The trainer recommended focused listening tasks that really helped.",
      rating: 4,
    },
    {
      name: "Akhil",
      text: "The cultural mini-lessons helped me with real conversations while traveling. The trainer prepared a short phrase sheet for my trip — super useful!",
      rating: 5,
    },
    {
      name: "Neha",
      text: "Easy scheduling and consistent progress checks. I love the micro-lessons between full sessions.",
      rating: 4,
    },
  ];

  return (
    // bg-[linear-gradient(145deg,#E6EEF9_0%,#FEF5E4_30%,#f7f1e6_70%,#E6EEF9_100%)]
    <div
      className="min-h-screen font-inter text-[#2D274B] transition-colors duration-500 "
    // #fef5e4
    >
      {/* 2D274B  text- #dc8d33*/}
      {/* bg-[#6B48AF]/95 backdrop-blur-sm border-b border-white/30 text-white */}
      <Navbar />

      <main className="pt-14">
        {/* HERO SECTION */}
        <div className="max-w-[1520px] mx-auto px-4">
          <div className="relative rounded-[40px] bg-[#6f9bd3] px-8  lg:px-16 pt-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={mounted ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7 flex flex-col space-y-6 pb-12 z-10 relative"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl  font-extrabold text-white leading-tight">
                  <span className="block lg:whitespace-nowrap">
                    Helping learners grow,
                  </span>
                  <span className="text-[#2D274B]">
                    emotionally <span className="text-white">& </span>
                    <br /> intellectually
                  </span>
                </h1>

                <div className="mt-4">
                  <div className="inline-block rounded-xl border-2 border-[#0A1172] px-4  py-2">
                    <p className="text-xl lg:text-3xl font-semibold text-white  min-h-[40px] flex items-center">
                      <span>{currentText}</span>
                      {/* Clarity comes with the{" "}
                      <span className="text-[#2D274B]">Right Mentors</span> */}
                    </p>
                  </div>
                </div>

                <p className="text-xl lg:text-2xl font-bold text-white">
                  Learn from natives.{" "}
                  <span className="text-[#2D274B]">Speak like natives</span>
                </p>

                <div className="flex flex-wrap gap-4 pt-2">

                  {/* Book Demo */}
                  <Link
                    to="/demo"
                    className="inline-flex items-center gap-3 px-8 py-3 bg-[#024AAC] text-white font-bold rounded-2xl border-2 border-white shadow-md hover:scale-105 transition-transform"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Book a FREE Demo
                  </Link>

                  <Link
                    to="/become-trainer"
                    className="inline-flex items-center gap-3 px-8 py-3 bg-white text-[#024AAC] font-bold rounded-2xl border-2 border-[#024AAC] shadow-md hover:bg-gray-50 hover:scale-105 transition-colors"
                  >
                    <User className="w-5 h-5 fill-current stroke-0" />Become a Trainer
                  </Link>
                </div>
              </motion.div>

              {/* RIGHT */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={mounted ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8 }}
                className="lg:col-span-5 relative flex justify-end items-end h-full self-end z-0"
              >
                {/* Dark Blue Div Behind Image */}
                <div className="absolute inset-0 flex justify-end items-end z-[-1]">
                  <div className="bg-[#0A1172] w-full h-4/5 rounded-tl-[120px] lg:rounded-tl-[160px]  rounded-br-[40px] translate-x-8 lg:translate-x-0 translate-y-12 lg:translate-y-0"></div>
                </div>
                <img
                  src={heroImage3}
                  alt="Learners"
                  className="w-full h-auto object-contain max-h-[450px] lg:scale-125 origin-bottom z-10 relative left-4 lg:left-0"
                  style={{ marginBottom: "-2px" }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom features after grid*/}
        <div className="py-10 mt-10 px-6">

          <div className="max-w-md mx-auto grid grid-cols-1 md:grid-cols-3 md:max-w-5xl gap-y-8  justify-center">

            {/* Item 1 */}
            <div className="flex items-center gap-5 w-full max-w-[280px] mx-auto md:mx-0">
              <div className="flex-shrink-0 p-3 bg-white rounded-full text-[#4f88f2] shadow-lg">
                <Mic className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-2xl text-[#2D274B]">Native</p>
                <p className="text-base text-gray-500 ">Mentor + real accent</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center md:gap-0 gap-5 w-full max-w-[280px] mx-auto md:mx-0">
              <div className="flex-shrink-0 p-3 bg-white rounded-full text-[#4f88f2] shadow-lg">
                <Headphones className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-2xl text-[#2D274B]">Speaking</p>
                <p className="text-base text-gray-500 whitespace-nowrap">Focused practice</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center md:gap-0 gap-5 w-full max-w-[280px] mx-auto md:mx-0">
              <div className="flex-shrink-0 p-3 bg-white rounded-full text-[#4f88f2] shadow-lg">
                <Calendar className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-2xl text-[#2D274B]">Flexible</p>
                <p className="text-base text-gray-500 ">
                  Weekday / weekend batches
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Language Levels Explanation */}
      {/*  bg-[#2D274B] */}
      <section
        className="relative py-12 md:py-20 text-[#dc8d33]"
        aria-labelledby="sdil-courses"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Heading */}
          <motion.h2
            id="sdil-courses"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-[#5186cd] tracking-tight"
          >
            Languages That Open Doors
            <span className="block text-[#5186cd] mt-2 md:mt-1 text-2xl md:text-5xl">
              Speak to the World with Confidence
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-5 text-base md:text-xl text-[#2D274B] font-bold max-w-3xl mx-auto"
          >
            Explore world languages guided by international certification standards.
            Learn from certified trainers across every level.
          </motion.p>

          {/* Tag */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border text-xs md:text-sm font-medium text-[#4B437C] shadow-sm">
              🌍 Languages & Levels
            </div>
          </div>

          {/* CATEGORY OPTIONS */}
          <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-2 md:gap-4">
            {[
              { key: "popular", label: "Popular" },
              { key: "asian", label: "Asian Languages" },
              { key: "euro", label: "Europe & USA" },
              { key: "africa", label: "Middle East" },
              { key: "more", label: "More" },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key as any)}
                className={`
            px-4 py-2 md:px-6 md:py-2 rounded-full font-bold transition text-sm md:text-base
            ${activeCategory === cat.key
                    ? "bg-[#5186cd] text-white shadow-md"
                    : "bg-white text-[#2D274B] border hover:bg-[#eef4ff]"
                  }
          `}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Responsive Grid with Flags */}
          {/* LANGUAGE GRID (REPLACED CONTENT) */}
          <div className="mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 justify-center">
            {(activeCategory === "more"
              ? [
                { lang: "Thai", code: "th" },
                // { lang: "Bengali", code: "in" },
                { lang: "Russian", code: "ru" },
                { lang: "Mandarin", code: "cn" },
                // { lang: "Swahili", code: "ke" },
                { lang: "Italian", code: "it" },
                { lang: "Portuguese", code: "pt" },
                { lang: "Korean", code: "kr" },
              ]
              : languageGroups[activeCategory]
            )?.map((lang, idx) => (
              <div
                key={idx}
                onClick={() => handleLanguageClick(lang.lang)}
                className="
            cursor-pointer
            flex items-center gap-2 md:gap-3
            px-3 py-2 md:px-5 md:py-3
            rounded-full
            bg-white
            shadow-[0_4px_10px_rgba(0,0,0,0.12)]
            hover:shadow-[0_8px_18px_rgba(0,0,0,0.18)]
            hover:-translate-y-0.5
            transition-all duration-300
          "
              >
                <img
                  src={`https://flagcdn.com/w40/${lang.code}.png`}
                  alt={lang.lang}
                  className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                />

                <span className="font-semibold text-[#2f6fd3] text-sm md:text-base truncate">
                  {lang.lang}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Modal for More Languages */}
        {showMoreLanguages && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4"
            onClick={() => setShowMoreLanguages(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="
          rounded-3xl p-6 md:p-10 max-w-3xl w-full relative 
          shadow-2xl
          bg-gradient-to-br from-[#ffffff] via-[#f0f6ff] to-[#dceaff]
          border border-white/40
          max-h-[85vh] overflow-y-auto
        "
            >
              {/* Close Button */}
              <button
                onClick={() => setShowMoreLanguages(false)}
                className="absolute top-4 right-4 text-[#2D274B] hover:text-black text-xl md:text-2xl z-10"
              >
                ✕
              </button>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-bold text-[#2D274B] mb-6 pr-8">
                Explore More Languages
              </h3>

              {/* Languages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 mt-6">
                {[
                  { name: "Thai", flag: "th" },
                  // { name: "Bengali", flag: "in" },
                  { name: "Russian", flag: "ru" },
                  { name: "Mandarin", flag: "cn" },
                  // { name: "Swahili", flag: "ke" },
                  { name: "Italian", flag: "it" },
                  { name: "Portuguese", flag: "pt" },
                  { name: "Korean", flag: "kr" },
                ].map((lang, i) => (
                  <div
                    key={i}
                    onClick={() => handleMoreLanguageClick(lang.name)}
                    className="
                group cursor-pointer 
                h-28 md:h-32 rounded-2xl 
                bg-white 
                shadow-md hover:shadow-xl 
                border border-slate-200
                transition-all duration-300 
                flex flex-col items-center justify-center
                hover:-translate-y-1 hover:scale-[1.05]
              "
                  >
                    <img
                      src={`https://flagcdn.com/${lang.flag}.svg`}
                      alt={lang.name}
                      className="w-10 h-10 md:w-12 md:h-12 mb-2 rounded-md shadow-sm"
                    />
                    <div className="text-[#2D274B] text-base md:text-lg font-semibold text-center">
                      {lang.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Explore subjects section */}
      {/* bg-[#dc8d33] */}
      <section className="relative py-12" aria-labelledby="sdil-subjects">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          {/* Heading */}
          <motion.h2
            id="sdil-subjects"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-5xl md:text-5xl tracking-tight font-extrabold text-[#5186cd]"
          >
            Subjects You Can Explore
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-5 text-2xl text-[#2D274B] font-semibold max-w-2xl mx-auto"
          >
            Comprehensive courses across academic and <br /> professional
            subjects for holistic learning.
          </motion.p>

          {/* Grid Subjects */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.3, delayChildren: 0.3 },
              },
            }}
            className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {[
              { name: "Maths", img: math },
              { name: "Physics", img: phy },
              { name: "Chemistry", img: chem },
              { name: "Computer Science", img: cs },
              { name: "History", img: hist },
              { name: "Geography", img: geo },
              { name: "Biology", img: bio },
              {
                name: "More",
                img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=100",
                isMore: true,
              },
            ].map((subject, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                // Updated styling to match Hobbies: h-56, rounded-xl, overflow-hidden
                className="group relative h-56 rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                style={{
                  backgroundImage: `url(${subject.img})`,
                  backgroundSize: "100% 100%",
                  //backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => handleSubjectClick(subject)}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300"></div>

                {/* Subject Name */}
                <div
                  className={`absolute top-3 left-3 ${subject.isMore
                    ? "bg-[#5186cd] text-white"
                    : "bg-white/90 text-[#2D274B]"
                    } px-3 py-1 rounded-md font-bold text-lg shadow`}
                >
                  {subject.name}
                </div>

                {/* More Overlay (Consistent with Hobbies) */}
                {subject.isMore && (
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    Explore More →
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Modal for More Subjects */}
        {showMore && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            onClick={() => setShowMore(false)}
          >
            <div
              className="rounded-3xl p-10 max-w-4xl w-[90%] relative shadow-2xl bg-gradient-to-br from-[#ffffff] via-[#f8f1ff] to-[#e9d8ff] border border-white/40"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              <button
                onClick={() => setShowMore(false)}
                className="absolute top-4 right-4 text-[#2D274B] hover:text-black text-2xl"
              >
                ✕
              </button>

              <h3 className="text-3xl font-bold text-[#2D274B] mb-6">
                Explore More Subjects
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {[
                  { name: "Economics", icon: "📊" },
                  { name: "Hindi", icon: "📝" },
                  { name: "Bengali", icon: "📚" },
                  { name: "Psychology", icon: "🧠" },
                  { name: "Philosophy", icon: "⚖️" },
                  { name: "Environmental Science", icon: "🌿" },
                  { name: "Accounts & Finance", icon: "💰" },
                ].map((subj, i) => (
                  <div
                    key={i}
                    onClick={() => handleMoreSubjectClick(subj.name)}
                    className="group cursor-pointer h-36 rounded-2xl bg-white shadow-md hover:shadow-xl border border-slate-200 transition-all duration-300 flex flex-col items-center justify-center hover:-translate-y-1 hover:scale-[1.05]"
                  >
                    <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">
                      {subj.icon}
                    </div>
                    <div className="text-[#593C9F] text-lg font-semibold text-center group-hover:text-[#2D1B69] transition-colors">
                      {subj.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Explore Hobbies Section */}
      {/* bg-[#2D274B] */}
      <section className="relative py-12 " aria-labelledby="sdil-hobbies">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          {/* Heading */}
          <motion.h2
            id="sdil-hobbies"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-5xl md:text-5xl  tracking-tight font-extrabold text-[#5186cd]"
          >
            Beyond Academics, Your Passion Awaits
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-5 text-2xl text-[#2D274B] font-semibold max-w-2xl mx-auto"
          >
            Build creativity and skills with professional <br />
            Hobby / Passion trainers.
          </motion.p>

          {/* Grid Hobbies */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.3, delayChildren: 0.3 },
              },
            }}
            className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {[
              {
                name: "Dancing",
                img: "https://images.unsplash.com/photo-1500336624523-d727130c3328?auto=format&fit=crop&w=1200&q=100",
              },
              {
                name: "Fitness",
                img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=1200&q=100",
              },
              {
                name: "Cooking",
                img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=100",
              },
              {
                name: "Singing",
                img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=100",
              },
              {
                name: "Painting",
                img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXJ0fGVufDB8fDB8fHww",
              },
              {
                name: "Photography",
                img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D",
              },
              {
                name: "Calligraphy",
                img: "https://plus.unsplash.com/premium_photo-1661887864467-ae3ca94f7ffa?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
              {
                name: "More",
                img: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=100",
                isMore: true,
              },
            ].map((hobby, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative h-56 rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                style={{
                  backgroundImage: `url(${hobby.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => handleHobbyClick(hobby)}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300"></div>

                {/* Hobby Name */}
                <div
                  className={`absolute top-3 left-3 ${hobby.isMore
                    ? "bg-[#5186cd] text-white"
                    : "bg-white/90 text-[#2D274B]"
                    } px-3 py-1 rounded-md font-bold text-lg shadow`}
                >
                  {hobby.name}
                </div>

                {/* More Overlay */}
                {hobby.isMore && (
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    Explore More →
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Modal for More Hobbies */}
        {showMoreHobbies && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            onClick={() => setShowMoreHobbies(false)}
          >
            <div
              className="
                rounded-3xl p-10 max-w-4xl w-[90%] relative 
                shadow-2xl
                bg-gradient-to-br from-[#ffffff] via-[#f1fff8] to-[#d8ffe7]
                border border-white/40
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowMoreHobbies(false)}
                className="absolute top-4 right-4 text-[#2D274B] hover:text-black text-2xl"
              >
                ✕
              </button>

              {/* Title */}
              <h3 className="text-3xl font-bold text-[#2D274B] mb-6">
                Explore More Hobbies
              </h3>

              {/* Hobbies Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {[
                  { name: "Yoga", icon: "🧘‍♀️" },
                  { name: "Knitting", icon: "🧶" },

                  { name: "Guitar", icon: "🎸" },
                  { name: "Piano (Theory)", icon: "🎹" },
                  { name: "Chess", icon: "♟️" },
                  { name: "Public Speaking", icon: "🎙️" },

                  { name: "Meditation", icon: "🕉️" },
                  { name: "Creative Writing", icon: "📖" },
                ].map((hb, i) => (
                  <div
                    key={i}
                    onClick={() => handleMoreHobbyClick(hb.name)}
                    className="
                      group cursor-pointer 
                      h-36 rounded-2xl 
                      bg-white 
                      shadow-md hover:shadow-xl 
                      border border-slate-200
                      transition-all duration-300 
                      flex flex-col items-center justify-center
                      hover:-translate-y-1 hover:scale-[1.05]
                    "
                  >
                    <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">
                      {hb.icon}
                    </div>

                    <div
                      className="
                        text-[#1C6B4A] text-lg font-semibold 
                        text-center 
                        group-hover:text-[#0d4a32]
                        transition-colors
                      "
                    >
                      {hb.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* top trainer section */}
      <TopTrainers />

      {/* Why learners love us section */}
      {/* bg-[#2D274B] */}
      <section className="py-24 ">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* HEADING */}
          <div className="text-center">
            <h3 className="text-4xl lg:text-5xl font-extrabold text-[#173b86]">
              Why Learners love LearniLM🌍World
            </h3>

            {/* SUBTITLE */}
            <div className="mt-6 inline-block bg-gradient-to-r from-[#5b78b8] to-[#3a5aa5] text-white px-10 py-4 rounded-xl shadow-lg max-w-3xl">
              <p className="text-base lg:text-lg font-semibold">
                Short lessons, lots of speaking time and tutors focused on practical
                outcome. Learn phrases you’ll use the very next day.
              </p>
            </div>
          </div>

          {/* FEATURE CARDS */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">

            {features.map((f, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-b from-[#8aa0cc] to-[#193c87] text-white 
          rounded-tl-[40px] rounded-br-[40px]
          p-8 shadow-xl hover:scale-[1.04] transition-transform duration-300"
              >

                {/* ICON */}
                <div className="w-12 h-12 flex items-center justify-center mb-3 bg-white/10 rounded-full backdrop-blur-sm">
                  <f.icon
                    className={`w-8 h-8 text-white ${f.icon === Clock ? "stroke-[2.5]" : "fill-white stroke-none"
                      }`}
                  />
                </div>

                {/* TITLE */}
                <h4 className="text-xl font-bold mb-3">
                  {f.title}
                </h4>

                {/* TEXT */}
                <p className="text-lg opacity-90 leading-relaxed">
                  {f.text}
                </p>

              </div>
            ))}

          </div>

          {/* BOTTOM BUTTON TAGS */}
          <div className="mt-16 flex flex-col sm:flex-row justify-center gap-10">

            <div className="bg-[#3e5fa8] text-white px-16 py-4 rounded-full text-lg font-semibold shadow-lg text-center hover:scale-105 transition">
              Quick lessons
            </div>

            <div className="bg-[#3e5fa8] text-white px-16 py-4 rounded-full text-lg font-semibold shadow-lg text-center hover:scale-105 transition">
              Excellent Material
            </div>

          </div>

        </div>
      </section>

      {/* Highlights Section */}
      <section
        className="relative py-24  text-white"
        aria-labelledby="sdil-highlights"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Heading */}
          <motion.h2
            id="sdil-highlights"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl  text-[#5186cd] tracking-tight text-center"
          >
            Highlights of LearniLM 🌎 World
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-5 text-xl font-bold text-[#2D274B] max-w-2xl mx-auto text-center"
          >
            Our approach ensures effective learning, flexibility, and
            comprehensive support.
          </motion.p>

          {/* Image + Icon Highlights */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img
                src="https://tse1.mm.bing.net/th/id/OIP.wDczP_2HXmI-762eR-rEoQHaHa?w=612&h=612&rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="Learning Highlights"
                className="rounded-2xl shadow-md max-w-sm w-full object-cover"
              />
            </motion.div>

            {/* Right Icons Grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-8 text-center "
            >
              {[
                {
                  icon: "🎯",
                  title: "Flexible Timings",
                  desc: "Learn at your own pace with live and recorded sessions.",
                },
                {
                  icon: "💻",
                  title: "Online Batches",
                  desc: "Join collaborative learning groups from anywhere in the world.",
                },
                {
                  icon: "📜",
                  title: "Certified Courses",
                  desc: "Earn certificates that enhance your professional credibility.",
                },
                {
                  icon: "👨‍🏫",
                  title: "Expert Faculty",
                  desc: "Gain insights from top mentors and experienced trainers.",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-[#5186cd] rounded-2xl border border-white/20 hover:border-[#dc8d33] transition"
                >
                  <div className="text-5xl mb-3">{feature.icon}</div>
                  <h4 className="text-lg font-semibold text-[#e0fa84]">
                    {feature.title}
                  </h4>
                  <p className="mt-2 text-white text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Closing Line */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-lg text-center text-[#2D274B] font-bold max-w-3xl mx-auto"
          >
            Personalized support and guidance ensure every learner’s success at{" "}
            <br /> LearniLM 🌎 World.
          </motion.p>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-1" aria-labelledby="how-it-works">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              id="how-it-works"
              className="text-4xl font-bold md:text-4xl  text-[#5186cd]"
            >
              How it works — in 4 simple steps
            </h2>
            <p className="mt-3 text-[#2D274B] text-lg font-bold max-w-2xl mx-auto">
              Designed to get you speaking fast: pick, book, practice and track.
            </p>
          </div>

          <div className="grid px-3 lg:grid-cols-4 md:grid-cols-2 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="bg-gradient-to-b from-[#f0fdf4] to-white rounded-3xl px-6 relative py-12 border-2 border-sky-800 shadow hover:shadow-xl transition overflow-hidden"
                role="article"
              >
                <div className="absolute  w-28 h-28 -top-9 -left-9 ">
                  <div className=" w-28  h-28 rounded-full bg-[#5186cd] text-white text-4xl flex items-center justify-center font-bold   border-black border-2 ">
                    <span className="translate-x-3 translate-y-3">{s.ind}</span>
                  </div>
                </div>
                <div className="w-14 h-14 mx-auto rounded-lg  flex items-center justify-center mb-4 text-center">
                  <s.icon className="text-[#5186cd] size-12" aria-hidden />
                </div>
                <h3 className="font-semibold text-lg flex justify-center items-center text-center">
                  {s.title}
                </h3>
                <p className="text-sm text-[#4B437C] mt-2 flex justify-center items-center text-center">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Removed Reviews section */}
      {/* FAQ */}
      <section className="py-16" aria-labelledby="faq-heading">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">

          <h3 id="faq-heading" className="text-4xl text-center font-extrabold">
            <span>Frequently Asked</span>
            <span className="text-[#5186cd]"> Questions</span>
          </h3>

          <p className="mt-4 text-center text-gray-600">
            Getting ready to apply? Check out the FAQ for answers to your questions.
          </p>

          {/* Toggle Buttons */}
          <div className="flex justify-center mt-6">
            <div className="bg-gray-100 rounded-full p-1 flex gap-1">

              <button
                onClick={() => {
                  setActiveFaq("learner");
                  setOpenFaq(null);
                }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${activeFaq === "learner"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500"
                  }`}
              >
                Learner FAQs
              </button>

              <button
                onClick={() => {
                  setActiveFaq("tutor");
                  setOpenFaq(null);
                }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${activeFaq === "tutor"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500"
                  }`}
              >
                Tutor FAQs
              </button>

            </div>
          </div>

          {/* FAQ LIST */}
          <div className="mt-8 space-y-4">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md border border-gray-100"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-${i}`}
                >
                  <span className="font-semibold text-lg text-gray-800">
                    {f.q}
                  </span>

                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="ml-4 bg-blue-200 w-8 h-8 items-center justify-center flex rounded-full"
                  >
                    <ChevronDown />
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
                  <div className="px-4 py-3 bg-blue-200 pb-4 text-md leading-relaxed">
                    {f.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* text-[#e0fa84] text-[#2D274B] */}
      {/* CTA  bg-gradient-to-r from-[#9787F3]/10 to-[#f97316]/8*/}
      {/* <section className="py-12 ">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h4 className="text-4xl font-extrabold text-[#5186cd] ">Master Your Skills, Confidently</h4>
          {/* <p className="text-[#2D274B] text-xl font-bold mt-2">Sign up to Claim Your Free Trial Session. Get a Personalized 7-Day Learning Path After Your First Session.</p>
          2D274B */}{" "}
      {/*
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/main" className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-[#276dc9] text-[white] hover:bg-[#205eb0]">Browse trainers <ChevronRight /></Link>
            <Link to="/become-trainer" className="inline-flex items-center gap-3 px-6 py-3 rounded-lg border bg-[#276dc9] border-[#CBE56A] text-[white] hover:bg-[#205eb0]">Become a trainer</Link>
          </div>
        </div>
      </section> */}
      {/* Footer - expanded */}
      <Footer />
    </div>
  );
}
