import React from "react";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-6 md:p-12 overflow-hidden">
      <div className="max-w-md text-center px-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="text-base-content/60 max-w-xs mx-auto">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;