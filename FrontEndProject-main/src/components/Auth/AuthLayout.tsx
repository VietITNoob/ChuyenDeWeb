import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white bg-[radial-gradient(circle_at_50%_0%,rgba(0,113,227,0.03)_0%,transparent_50%)]">
      {/* Background động */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-apple-blue/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 mix-blend-multiply animate-[pulse-glow_8s_ease-in-out_infinite_alternate]"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#9b51e0]/5 rounded-full blur-[60px] mix-blend-multiply animate-[pulse-glow_10s_ease-in-out_infinite_alternate_reverse]"></div>
      </div>
      
      {/* Nội dung (Card) */}
      <div className="relative z-10 w-full max-w-[980px] mx-auto text-center px-[22px] mt-10 mb-[60px] grow flex flex-col justify-center animate-enter">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;