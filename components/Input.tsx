
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      <input 
        className={`px-4 py-2 bg-white border rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 ${error ? 'border-red-500' : 'border-slate-200 focus:border-indigo-500'}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
};
