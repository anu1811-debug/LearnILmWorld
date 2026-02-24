import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import trainer_profile from "../assets/trainer_profile.png";
import spanish from "../assets/Spanish_Trainer.png";
import german from "../assets/German_Trainer.jpeg";
import english from "../assets/English_Trainer.png";

import TrainerBackCard, { Trainer } from "../components/TrainerBackCard";
import { Play, Users } from "lucide-react";


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
    <section className="py-14 ">
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
            const role = id ? pickRoleMap[id] ?? "other" : "other";

            const showLangs =
              role === "language" && trainer.profile?.languages?.length;
            const showSubs =
              role === "subject" && trainer.profile?.subjects?.length;

            const displayList =
              showLangs
                ? trainer.profile!.languages!
                : showSubs
                  ? trainer.profile!.subjects!
                  : trainer.profile?.languages?.length
                    ? trainer.profile.languages
                    : trainer.profile?.subjects || [];

            return (
              <div
                key={id ?? idx}
                className="group [perspective:1200px]"
                onMouseEnter={() => setHoveredTrainerId(id)}
                onMouseLeave={() => setHoveredTrainerId(null)}
                onClick={() => setActiveTrainer(trainer)}
              >
                <div
                  className={`
                  relative h-[420px]
                  transition-transform duration-700
                  [transform-style:preserve-3d]
                  ${hoveredTrainerId === id
                      ? "[transform:rotateY(180deg)]"
                      : ""
                    }
                `}
                >
                  {/* FRONT */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl [backface-visibility:hidden]">
                    <img
                      src={trainer.profile?.imageUrl || trainer_profile}
                      alt={trainer.name}
                      className="h-full w-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                    {/* Info Card */}
                    <div className="absolute bottom-5 left-5 right-5">
                      <div
                        className="
      rounded-2xl
      bg-white/55
      backdrop-blur-lg
      p-4
      shadow-sm
      transition-all duration-300
      group-hover:bg-white/75
      group-hover:shadow-md
    "
                      >
                        <h3 className="text-base font-semibold text-[#1e293b] truncate">
                          {trainer.name}
                        </h3>

                        <p className="text-xs font-medium text-[#276dc9] mt-0.5 line-clamp-1">
                          {displayList.slice(0, 2).join(", ")}
                        </p>

                        <p className="mt-1 text-xs text-gray-700">
                          <span className="font-semibold">
                            {trainer.profile?.experience ?? 0} yrs+
                          </span>{" "}
                          experience
                        </p>

                        <Link
                          to={`/trainer-profile/${trainer._id}`}
                          className="
        mt-3 block text-center
        bg-[#276dc9]/90
        text-white
        py-1.5
        rounded-md
        text-sm
        font-semibold
        hover:bg-[#205eb0]
        transition
      "
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>

                  </div>

                  {/* BACK */}
                  <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <TrainerBackCard
                      trainer={trainer}
                      displayList={displayList}
                      className="h-full"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center gap-6 mt-14 w-full max-w-xl mx-auto">

          {/* Book Demo */}
          <Link
            to="/demo"
            className="flex-1 flex items-center justify-center gap-2 h-[57px] bg-[#276dc9] text-white font-semibold rounded-xl shadow-md border border-white hover:bg-[#205eb0] transition text-lg"
          >
            <Play className="w-5 h-5 fill-current" />
            Book a FREE Demo
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

      {/* MODAL */}
      {activeTrainer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
          onClick={() => setActiveTrainer(null)}
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
