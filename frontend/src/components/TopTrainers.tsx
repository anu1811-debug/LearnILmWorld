import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import trainer_profile from "../assets/trainer_profile.png";
import spanish from "../assets/Spanish_Trainer.png";
import german from "../assets/German_Trainer.jpeg";
import english from "../assets/English_Trainer.png";

import TrainerBackCard, { Trainer } from "../components/TrainerBackCard";
import { BookOpen, CheckCircle, Play, Star, Users } from "lucide-react";


// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Moved types in TrainerBackCard.tsx component
/* small helper for rendering label */
type PickRole = "language" | "subject" | "other";

export default function TopTrainers(): JSX.Element {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  // keep mapping of trainerId -> pick role for rendering
  const [pickRoleMap, setPickRoleMap] = useState<Record<string, PickRole>>({});

  const [activeTrainer, setActiveTrainer] = useState<Trainer | null>(null);

  //Card flipping control
  const [hoveredTrainerId, setHoveredTrainerId] = useState<string | null>(null);


  useEffect(() => {
    const top = [

      //  LANGUAGE TRAINERS 
      // -------------------------

      {
        _id: "68ef33d0cad95b62472f382a",
        name: "Shannet",
        role: "trainer",
        profile: {
          imageUrl: spanish,
          languages: ["Spanish"],
          subjects: [],
          experience: 14,
          education: "Master's in Human and Social Sciences ",
          about: "Shanat Andrea Oliveros Avendaño is a language specialist with over 14 years of teaching experience and one year of professional translation , proficient in English, French, and Spanish , with a teaching approach based on international curricula and methodologies like CLIL, IB, and Cambridge , and has successfully supported students of all ages. She holds a Master's in Human and Social Sciences - General and Comparative Literature from the University of Sorbonne Nouvelle (2020-2022) and a Bachelor's in Foreign Language Teaching from UPTC (2005-2011). She has extensive experience as a virtual Spanish instructor at multiple institutions"
        },
        pickRole: "language",
      },

      {
        _id: "691c5f3ca0cce9bf08c670da",
        name: "Sinqobile Mazibuko",
        role: "trainer",
        profile: {
          imageUrl: english,
          languages: ["English"],
          subjects: [],
          experience: 5,
          education: "Certified Online English Trainer",
          about: "Sinqobile Mazibuko is a dedicated and certified Online Teacher with five years of experience, specializing in English, IsiZulu, Mathematics, Science, and Technology, who is familiar with the Caps and IEB curriculum and teaches across the foundation, intermediate, and senior phases, offering services like home schooling, extra lessons, exam preparation, and adult ESL."
        },
        pickRole: "language",
      },

      {
        _id: "691c58dba0cce9bf08c670c0",
        name: "Esraa Mohamed",
        role: "trainer",
        profile: {
          imageUrl: german,
          languages: ["German"],
          subjects: [],
          experience: 10,
          education: "Bachelor's in German Language",
          about: "Esraa Mohamed is a motivated and energetic German Instructor with a background in designing meaningful lessons, providing positive mentoring, and enhancing student performance, and has experience in various educational institutions since 2014, and holds a Bachelor's degree in German Language from Ain Shams University, along with certifications like Goethe-Institute's B2 and several DLL (Deutsch Lehren Lernen) courses"
        },
        pickRole: "language",
      },


      // SUBJECT TRAINERS
      // -------------------------

      {
        _id: "690dc8cb64cc3e1c19580f24",
        name: "Alfa",
        role: "trainer",
        profile: {
          imageUrl: "",
          subjects: ["Economics", "History", "Science", "Social Studies"],
          languages: [],
          experience: 8,
          education: "Master's in Technology",
        },
        pickRole: "subject",
      },

      // {
      //   _id: "68ecb5fe64bc73d89ba43040",
      //   name: "Trainer 3",
      //   role: "trainer",
      //   profile: {
      //     imageUrl: "",
      //     subjects: ["Geography", "Political Science"],
      //     languages: [],
      //     experience: 7,
      //   },
      //   pickRole: "subject",
      // },
    ];

    setTrainers(top);

    // role map for badge + correct display
    const map: Record<string, "language" | "subject"> = {};
    top.forEach((t) => {
      map[t._id] = t.pickRole as "language" | "subject";
    });

    setPickRoleMap(map);
  }, []);

  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-[#276dc9] text-center"
        >
          Meet Our Top Trainers
        </motion.h2>

        <p className="text-center text-lg md:text-xl text-[#2D274B] mt-4 max-w-2xl mx-auto">
          Highly rated & verified mentors across languages and subjects.
        </p>

        {/* Trainer Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, idx) => {
            const id = trainer._id;

            return (
              <div
                key={id ?? idx}
                onClick={() => setActiveTrainer(trainer)}
                className="flex flex-col h-[600px]  border-blue-100 border-2 rounded-[2rem] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all"
              >
                <div className="relative w-full h-[200px] rounded-2xl overflow-hidden mb-4 shrink-0 bg-gray-50">
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-[#fcd574] text-[#1e293b] text-xs font-bold px-4 py-2 rounded-bl-xl shadow-sm">
                      Free Demo
                    </div>
                  </div>
                  <img
                    src={trainer.profile?.imageUrl || trainer_profile}
                    alt={trainer.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Name & Badge */}
                <div className="flex items-center gap-1.5 mb-2 shrink-0">
                  <h3 className="text-[20px] font-bold text-[#1e293b] truncate">
                    {trainer.name}
                  </h3>
                  <CheckCircle className="text-blue-400 fill-white text-blue-400" size={20} />
                </div>

                {/* about */}
                <p className="text-[13px] text-gray-700 leading-relaxed overflow-y-auto no-scrollbar flex-1 ">
                  {trainer.profile?.about}
                </p>

                {/* Ratings & Experience */}
                <div className="flex items-center gap-3 mb-4 mt-4 shrink-0 text-[13px]">
                  <div className="flex items-center gap-1 font-bold text-gray-900">
                    <Star className="w-4 h-4 text-[#fbbf24] fill-current" />
                    4.9
                  </div>
                  <div className="font-bold text-gray-900">
                    {trainer.profile?.experience ?? 0}+ Years Exp.
                  </div>
                </div>

                {/* Tags Section*/}
                <div className="shrink-0 mb-5">
                  {/* Expertise */}
                  {trainer.profile?.languages && trainer.profile.languages.length > 0 && (
                    <div className="mb-2.5">
                      <p className="text-[12px] text-gray-500 mb-1.5">Expertise</p>
                      <div className="flex flex-wrap gap-2">
                        {trainer.profile.languages.slice(0, 2).map((lang, i) => (
                          <span
                            key={i}
                            className="bg-purple-50/50 border border-purple-100 text-[#7186ce] text-[12px] px-3 py-1 rounded-lg"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Class */}
                  {trainer.profile?.subjects && trainer.profile.subjects.length > 0 && (
                    <div>
                      <p className="text-[12px] text-gray-500 mb-1.5">Subject</p>
                      <div className="flex flex-wrap gap-2">
                        {trainer.profile.subjects.slice(0, 2).map((sub, i) => (
                          <span
                            key={i}
                            className="bg-purple-50/50 border border-purple-100 text-[#7186ce] text-[12px] px-3 py-1 rounded-lg"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  to={`/trainer-profile/${trainer._id}`}
                  className="mt-auto block w-full text-center bg-[#276dc9] text-white py-2.5 rounded-2xl text-[15px] font-semibold  transition-colors shrink-0"
                >
                  View Profile
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Buttons */}
        <div className="flex justify-center gap-6 mt-14 w-full max-w-xl mx-auto">
          <Link
            to="/courses"
            className="flex-1 flex items-center justify-center gap-2 h-[57px] bg-[#276dc9] text-white font-semibold rounded-xl shadow-md border border-white hover:bg-[#205eb0] transition text-lg"
          >
            <BookOpen className="w-5 h-5" />
            Browse Courses
          </Link>

          {/* More Trainers */}
          <Link
            to="/main"
            className="flex-1 flex items-center justify-center gap-2 px-0.5 h-14 bg-[#276dc9] text-white font-semibold rounded-xl shadow-md border-white border hover:bg-[#205eb0] transition text-lg"
          >
            <Users className="w-5 h-5" />
            More Trainers
          </Link>

        </div>

      </div>

      {activeTrainer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
          onClick={() => setActiveTrainer(null)} // Bahar click karne pe modal band ho jayega
        >
          <div onClick={(e) => e.stopPropagation()}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TrainerBackCard
                trainer={activeTrainer}
                displayList={
                  activeTrainer.profile?.languages?.length
                    ? activeTrainer.profile.languages
                    : activeTrainer.profile?.subjects ?? []
                }
                variant="modal"
              />
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );

}
