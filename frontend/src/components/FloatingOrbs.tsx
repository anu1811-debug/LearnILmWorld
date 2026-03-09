import React from "react";
// This was used in Registration at first, currently is not used anywhere but storing it here for future useCases.
type Props = {
  className?: string;
};

const FloatingOrbs: React.FC<Props> = ({ className = "" }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full" style={{ background: '#fff7e1', opacity: 0.32, animation: 'floaty 6s ease-in-out infinite' }} />
      <div className="absolute top-44 right-20 w-24 h-24 rounded-full" style={{ background: '#fff7e1', opacity: 0.36, animation: 'floaty 6s ease-in-out infinite', animationDelay: '1.8s' }} />
      <div className="absolute bottom-24 left-1/4 w-40 h-40 rounded-full" style={{ background: '#fff7e1', opacity: 0.44, animation: 'floaty 6s ease-in-out infinite', animationDelay: '3.2s' }} />
      <div className="absolute bottom-44 right-44 w-40 h-40 rounded-full" style={{ background: '#fff7e1', opacity: 0.44, animation: 'floaty 6s ease-in-out infinite', animationDelay: '1.8s' }} />
    </div>
  );
};

export default FloatingOrbs;