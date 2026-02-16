// import React from 'react';
// import { User } from 'lucide-react';
import img1 from '../assets/ourteam1.jpeg'
import img2 from '../assets/ourteam2.png'
import img3 from '../assets/ourteam3.jpeg'
import img4 from '../assets/ourteam4.jpeg'
const teamMembers = [
  {
    id: 1,
    name: "Debojyoti Das",
    role: "FOUNDER",
    bio: "Leads the company's vision and strategy to make quality education accessible to students.",
    imageUrl: img1,
  },
  {
    id: 2,
    name: "Prateek Patil",
    role: "Head of Product",
    bio: "Oversees platform development and ensures smooth technical performance.",
    imageUrl: img2,
  },
  {
    id: 3,
    name: "Abhinav",
    role: "Advisor",
    bio: "Improves platform features to create a better student experience.",
    imageUrl: img3,
  },
  {
    id: 4,
    name: "Team Members",
    role: "BUILDING LearniLM🌍World",
    bio: "Dedicated to perfecting the student journey, ensuring every tool we build makes learning more seamless and engaging.",
    imageUrl: img4,
  },

];

const OurTeamMember = () => {
  return (
    <section className="py-20 px-2">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <h2 className="text-5xl font-extrabold text-center text-blue-800 mb-16">
          Meet Our Team
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col items-center w-full max-w-[350px]"
            >
              {/* Image Container */}
              <div className="w-full h-60 overflow-hidden relative">
                <img
                  src={member.imageUrl}
                  alt={member.role}
                  className={`w-full h-full ${member.id === 4
                    ? "object-contain bg-white p-2"
                    : "object-cover object-top"
                    }`}
                />
              </div>

              {/* Text Content */}
              <div className="p-8 text-center flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className={`text-blue-500 font-bold text-sm ${member.id !== 4
                  ? "uppercase" : ""} tracking-wider mb-4`}>
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeamMember;