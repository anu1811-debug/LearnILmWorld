import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Play, CheckCircle, Sparkles, User, Target, Users, PlayCircle } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const topTrainers = [
  {
    _id: "68ef33d0cad95b62472f382a",
    name: "Shannet",
    role: "trainer",
    profile: {
      imageUrl: "trainers/profiles/1771824341270-pasted-image-1771824341267.jpg",
      languages: ["Spanish"],
      subjects: [],
      hobbies: [],
      experience: 14,
      education: "Master's in Human and Social Sciences",
      about: "Shanat Andrea Oliveros Avendaño is a language specialist with over 14 years of teaching experience and one year of professional translation, proficient in English, French, and Spanish, with a teaching approach based on international curricula."
    },
    pickRole: "language",
  },
  {
    _id: "691c5f3ca0cce9bf08c670da",
    name: "Sinqobile Mazibuko",
    role: "trainer",
    profile: {
      imageUrl: "trainers/profiles/1771824457678-pasted-image-1771824457675.jpg",
      languages: ["English"],
      subjects: [],
      hobbies: [],
      experience: 5,
      education: "Certified Online English Trainer",
      about: "Sinqobile Mazibuko is a dedicated and certified Online Teacher with five years of experience, specializing in English, IsiZulu, Mathematics, Science, and Technology, who is familiar with the Caps and IEB curriculum."
    },
    pickRole: "language",
  },
  {
    _id: "69a5595a3f85166805d591aa",
    name: "kar",
    role: "trainer",
    profile: {
      imageUrl: "", 
      languages: [],
      subjects: ["Maths"],
      hobbies: [],
      experience: 10,
      education: "Bachelor's in Maths",
      about: "Experienced mathematics instructor focusing on deep conceptual understanding and problem-solving strategies."
    },
    pickRole: "subject",
  },
];

const categories = ["All Subjects", "Languages", "Subject", "Hobbies"];

const teachingFeatures = [
  {
    icon: Target,
    title: "Personalized Learning",
    description: "Lessons adapted to your pace and learning style"
  },
  {
    icon: Users,
    title: "Expert Instructors",
    description: "Learn from certified educators with years of experience"
  },
  {
    icon: PlayCircle,
    title: "Interactive Content",
    description: "Engaging videos with quizzes and hands-on activities"
  },
  {
    icon: CheckCircle,
    title: "Proven Methods",
    description: "Teaching techniques backed by educational research"
  }
];

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Subjects");
  const [resolvedImages, setResolvedImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchImages = async () => {
      const newResolvedImages: Record<string, string> = {};

      for (const trainer of topTrainers) {
        const key = trainer.profile.imageUrl;

        if (!key) {
          newResolvedImages[trainer._id] = "";
          continue;
        }

        // If it's already a full URL or base64, use it directly
        if (key.startsWith('http') || key.startsWith('blob:') || key.startsWith('data:')) {
          newResolvedImages[trainer._id] = key;
          continue;
        }
        try {
          const { data } = await axios.post(`${API_BASE_URL}/api/upload/get-download-url`, {
            fileKey: key
          });
          newResolvedImages[trainer._id] = data.signedUrl;
        } catch (err) {
          console.error(`Failed to fetch image for ${trainer.name}:`, err);
          newResolvedImages[trainer._id] = "";
        }
      }

      setResolvedImages(newResolvedImages);
    };

    fetchImages();
  }, []);

  // Filter logic
  const filteredTrainers = topTrainers.filter(trainer => {
    if (activeCategory === "All Subjects") return true;
    if (activeCategory === "Languages" && trainer.pickRole === "language") return true;
    if (activeCategory === "Subject" && trainer.pickRole === "subject") return true;
    if (activeCategory === "Hobbies" && trainer.pickRole === "hobbies") return true;
    return false;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-[#6f9bd3] text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm text-sm font-medium px-4 py-1.5 rounded-full flex items-center gap-2 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" /> 100% Free Preview Lessons
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Experience Our Teaching Style
          </h1>
          
          <p className="text-lg md:text-xl text-blue-50 mb-8 max-w-2xl">
            Watch free Demo lessons from our expert instructors. No registration required, just click and learn!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm md:text-base font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Full-length preview lessons
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> No credit card needed
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Multiple teaching styles
            </div>
          </div>
        </div>
      </div>

      {/* Dotted Divider */}
      <div className="w-full border-b-4 border-dotted border-[#78A1CC] opacity-50"></div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Browse by Subject Filters */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse Our Top Trainers</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors border ${
                  activeCategory === category
                    ? "bg-[#6f9bd3] text-white border-[#78A1CC] shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#78A1CC] hover:text-[#78A1CC]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Dotted Divider */}
        <div className="w-full border-b-4 border-dotted border-[#78A1CC] opacity-50 mb-10"></div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrainers.length > 0 ? (
            filteredTrainers.map((trainer, index) => {
              const courseTitle = trainer.pickRole === "language" 
                ? `Learn ${trainer.profile.languages[0]}` 
                : trainer.pickRole === "subject" && trainer.profile.subjects.length > 0 
                  ? `Introduction to ${trainer.profile.subjects[0]}`
                  : "Expert Mentorship";

              const rating = 4.8 + (index % 3) * 0.1;
              const displayImage = resolvedImages[trainer._id];

              return (
                <div 
                  key={trainer._id} 
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col group duration-300"
                >
                  {/* Thumbnail Section */}
                  <div className="relative h-56 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={trainer.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-300" />
                    )}
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 left-3 bg-[#6f9bd3] text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-current text-yellow-300" /> {rating.toFixed(1)}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Instructor Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-100 shrink-0">
                        {displayImage ? (
                          <img 
                            src={displayImage} 
                            alt={trainer.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{courseTitle}</h3>
                        <p className="text-sm text-gray-500">{trainer.name}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[13px] text-gray-600 leading-relaxed overflow-y-auto no-scrollbar flex-1  ">
                      {trainer.profile.about }
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/trainer-profile/${trainer._id}`)}
                        className="flex-1 bg-gray-100 text-gray-800 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => navigate(`/trainer-profile/${trainer._id}`, { state: { scrollToDemo: true } })}
                        className="flex-1 bg-[#276dc9] hover:bg-[#2160b3] text-white py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                      >
                        <Play className="w-4 h-4 fill-current" /> Demo
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No trainers found for this category.
            </div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
            Why Students Love Our Teaching Style
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Discover what makes our lessons engaging, effective, and easy to follow
          </p>
        </div>

        {/* 4 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachingFeatures.map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-[2rem] p-8 text-center border border-gray-100 hover:scale-[1.02] transition-transform duration-300 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-[#F0F5FA] rounded-full flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-[#78A1CC]" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FeaturedSection;