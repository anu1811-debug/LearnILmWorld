import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, MapPin, Clock, ChevronDown, Mail, } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CareerApplicationForm from "../components/CareerApplicationForm";
import JobDetailsModal from "../components/JobDetailsModal";
import careers_img from "../assets/our_career.png";

export default function Careers() {
    const [activeTab, setActiveTab] = useState("All Jobs");
    const [showAll, setShowAll] = useState(false);
    const [selectedJob, setSelectedJob] = useState<any | null>(null);
    const [showCareerForm, setShowCareerForm] = useState(false);

    const jobs = [
        /*  ENGINEERING  */

        {
            id: 1,
            title: "Full Stack Developer Intern",
            roleKey: "FULL_STACK",
            category: "Engineering",
            department: "Engineering",
            location: "Remote",
            type: "Internship",
            isNew: true,
        },
        {
            id: 2,
            title: "QA Intern",
            roleKey: "QA",
            category: "Engineering",
            department: "Engineering",
            location: "Remote",
            type: "Internship",
            isNew: true,
        },

        /*  CONTENT  */

        {
            id: 3,
            title: "UI/UX Design Intern",
            roleKey: "UI_UX",
            category: "Content",
            department: "Content",
            location: "Remote",
            type: "Internship",
            isNew: false,
        },
        {
            id: 4,
            title: "Content Creator Intern",
            roleKey: "CONTENT_CREATOR",
            category: "Content",
            department: "Content",
            location: "Remote",
            type: "Internship",
            isNew: false,
        },

        /*  SALES / MARKETING  */

        {
            id: 5,
            title: "Digital Marketing Intern",
            roleKey: "DIGITAL_MARKETING",
            category: "Sales",
            department: "Sales",
            location: "Remote",
            type: "Internship",
            isNew: false,
        },

        /*  REGIONAL SALES  */

        {
            id: 6,
            title: "Sales Intern - India",
            roleKey: "SALES_INTERN",
            category: "Sales",
            department: "Sales",
            location: "India",
            type: "Internship",
            isNew: false,
        },
        {
            id: 7,
            title: "Sales Intern - Bahrain",
            roleKey: "SALES_INTERN",
            category: "Sales",
            department: "Sales",
            location: "Bahrain",
            type: "Internship",
            isNew: false,
        },
        {
            id: 8,
            title: "Sales Intern - Kuwait",
            roleKey: "SALES_INTERN",
            category: "Sales",
            department: "Sales",
            location: "Kuwait",
            type: "Internship",
            isNew: false,
        },
        {
            id: 9,
            title: "Sales Intern - Oman",
            roleKey: "SALES_INTERN",
            category: "Sales",
            department: "Sales",
            location: "Oman",
            type: "Internship",
            isNew: false,
        },
        {
            id: 10,
            title: "Sales Intern - Jordan",
            roleKey: "SALES_INTERN",
            category: "Sales",
            department: "Sales",
            location: "Jordan",
            type: "Internship",
            isNew: false,
        },
        {
            id: 11,
            title: "Sales Intern - Azerbaijan",
            roleKey: "SALES_INTERN",
            category: "Sales",
            department: "Sales",
            location: "Azerbaijan",
            type: "Internship",
            isNew: false,
        },
        {
            id: 12,
            title: "Sales Intern - Belarus",
            roleKey: "SALES_INTERN",
            category: "Sales",
            department: "Sales",
            location: "Belarus",
            type: "Internship",
            isNew: false,
        },
    ];

    const filteredJobs =
        activeTab === "All Jobs"
            ? jobs
            : jobs.filter((job) => job.category === activeTab);

    const visibleJobs = showAll
        ? filteredJobs
        : filteredJobs.slice(0, 4);

    const handleTabChange = (name: string) => {
        setActiveTab(name);
        setShowAll(false);
    };

    return (
        <>
            <Navbar />

            {/* CAREERS */}
            {/* e0fa84 CBE56A*/}
            <section id="careers" className="py-20 px-6 text-[#2D274B] ">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <Briefcase size={40} className="mx-auto mb-4 text-[#1a56ad]" />
                    </motion.div>

                    {/* <h2 className="text-4xl font-serif font-bold text-[#5186cd]">
            Careers at LearniLM🌎World
          </h2> */}
                    <div className="flex flex-wrap text-center justify-center items-center gap-x-4 gap-y-2 mb-8">
                        <h2 className="text-4xl mt-2 md:text-5xl font-black text-[#1f2937] leading-tight">
                            Careers at {" "}
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
                    </div>
                    {/* <p className="mt-4 text-lg max-w-3xl mx-auto text-[#2D274B]">
            Join a mission-driven team transforming education. Your ideas
            matter, your growth is supported, and your work makes a real impact.
          </p> */}

                    {/* BENEFITS PILLS */}
                    <div className="mt-10 mb-16 flex flex-wrap justify-center gap-6">
                        {[
                            "Flexible Work Environment",
                            "Learning & Development",
                            "Inclusive Culture",
                            "Competitive Compensation",
                        ].map((benefit, i) => (
                            <div
                                key={i}
                                className="px-6 py-3 rounded-2xl bg-[#CCE0F8] border-2 border-[#5186cd]/70 text-lg font-semibold"
                            >
                                {benefit}
                            </div>
                        ))}
                    </div>

                    {/* IMAGE + OPEN POSITIONS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* LEFT: Image Section */}
                        {/* 'h-full' aur 'object-cover' ensure karenge image box ko fill kare bina distort hue */}
                        <div className="w-full h-auto md:h-[550px] relative rounded-[40px] overflow-hidden shadow-lg">
                            <img
                                src={careers_img}
                                alt="Mission driven team"
                                className="w-full h-auto md:h-[550px] object-cover"
                            />
                        </div>

                        {/* RIGHT: Text Content Section */}
                        <div className="flex  flex-col justify-center text-left">
                            <h2 className="text-2xl sm:text-4xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-6 lg:text-left sm:text-center">
                                Join a mission-driven team{" "}<br className="hidden md:block" />
                                <span className="text-[#4F86D9] block md:inline whitespace-nowrap">
                                    transforming education
                                </span>
                            </h2>

                            <p className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                                Your ideas matter, your growth is supported, and your work makes a real impact.
                            </p>

                            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-10">
                                Be part of a global team dedicated to making world-class education
                                accessible to everyone, everywhere. We're building the future of
                                online education.
                            </p>
                        </div>

                    </div>

                    {/* APPLY BUTTON — ONLY BUTTON COLOR CHANGED */}
                    {/* <button
            onClick={() => setShowCareerForm(true)}
            className="mt-10 inline-block px-8 py-4 bg-[#276dc9] hover:bg-[#205eb0] text-white font-bold rounded-full hover:scale-105 transition"
          >
            Apply Now →
          </button> */}
                </div>

                {showCareerForm && (
                    <CareerApplicationForm onClose={() => setShowCareerForm(false)} />
                )}
            </section>

            {/* Open position */}
            <section className=" py-20 px-4 md:px-8 font-sans">
                <div className="max-w-5xl mx-auto">

                    {/* HEADER & TABS */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-2">Open Positions</h2>
                            <p className="text-gray-600">Find your next challenges among our new openings</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {['All Jobs', 'Engineering', 'Content', 'Sales'].map((name) => (
                                <button
                                    key={name}
                                    onClick={() => handleTabChange(name)}
                                    className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${activeTab === name
                                        ? 'bg-[#0052CC] text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* JOB CARDS LIST */}
                    <div className="space-y-4 transition-all duration-500 ease-in-out">
                        {visibleJobs.length > 0 ? (
                            visibleJobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                            {job.isNew && (
                                                <span className="bg-green-light text-green-700 text-xs font-bold px-2 py-0.5 rounded">
                                                    NEW
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                                            <span className="flex items-center gap-1.5"><Briefcase size={16} /> {job.department}</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={16} /> {job.type}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedJob(job)}
                                        className="border-2 border-[#5186cd] text-[#5186cd] px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap"
                                    >
                                        View Details
                                    </button>

                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                No open positions found in this category.
                            </div>
                        )}
                    </div>

                    {filteredJobs.length > 4 && !showAll && (
                        <div className="text-center mt-8 mb-16">
                            <button
                                onClick={() => setShowAll(true)}
                                className="bg-[#0052CC] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-flex items-center gap-2 transition-all"
                            >
                                View ({filteredJobs.length - 4} more) <ChevronDown size={18} />
                            </button>
                        </div>
                    )}

                    {showAll && filteredJobs.length > 4 && (
                        <div className="text-center mt-8 mb-16">
                            <button
                                onClick={() => setShowAll(false)}
                                className="text-[#0052CC] font-semibold hover:underline inline-flex items-center gap-2"
                            >
                                Show Less
                            </button>
                        </div>
                    )}

                    {selectedJob && (
                        <JobDetailsModal
                            job={selectedJob}
                            onClose={() => setSelectedJob(null)}
                            onApply={() => {
                                setSelectedJob(null);
                                setShowCareerForm(true);
                            }}
                        />
                    )}


                    {/* BOTTOM BANNER */}
                    <div className="bg-[#4A85D9] mt-16 rounded-[30px] p-10 text-center text-white relative overflow-hidden shadow-lg">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#4A85D9] to-[#3b75c9] opacity-50 z-0"></div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-4">Can’t find a suitable role?</h3>
                            <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
                                We’re always looking for talented individuals who share our passion for education.
                                Send us your CV and we’ll keep you in mind for future openings.
                            </p>
                            <button onClick={() => setShowCareerForm(true)} className="bg-[#0041a3] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#003482] transition-colors inline-flex items-center gap-2 shadow-lg">
                                <Mail size={18} /> Send General Application
                            </button>
                        </div>
                    </div>
                    {/* APPLY BUTTON */}
                    {/* <button
              onClick={() => setShowCareerForm(true)}
              className="mt-10 inline-block px-8 py-4 bg-[#276dc9] hover:bg-[#205eb0] text-white font-bold rounded-full hover:scale-105 transition"
            >
              Apply Now →
            </button> */}

                    {showCareerForm && (
                        <CareerApplicationForm onClose={() => setShowCareerForm(false)} />
                    )}

                </div>
            </section>

            <Footer />
        </>
    );
}
