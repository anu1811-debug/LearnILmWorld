import React from "react";

/* Lightweight UI building blocks used by the requested Home screen */

/* ---------------- ServiceCard ---------------- */
const ServiceCard: React.FC<{
  icon: React.ReactNode;
  bg?: string;
  title: string;
  desc: string;
  color: string;
}> = ({
  icon,
  bg = 'bg-gradient-to-br from-emerald-500 to-emerald-600',
  title,
  desc,
}) => (
    <div className="p-8  bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col items-center text-center gap-2" style={{ boxShadow: '4px 4px 12px rgba(0,0,0,0.12)' , borderRadius: '20px 2px 20px 2px'}}>
      {/* Icon Section */}
      <div className="mb-2">
        {icon}
      </div>

      {/* Title - dark and clear */}
      <h4 className="font-semibold text-xl text-[#2D274B]">
        {title}
      </h4>

      {/* Description */}
      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
        {desc}
      </p>
    </div>
  )

export default ServiceCard