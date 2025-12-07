import React from 'react';
import { X } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ 
  children, variant = 'primary', className = '', ...props 
}) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-200",
    secondary: "bg-brand-100 text-brand-900 hover:bg-brand-200",
    outline: "border-2 border-brand-600 text-brand-600 hover:bg-brand-50"
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-xl shadow-sm border border-brand-100 p-4 hover:shadow-md transition-shadow ${className} ${onClick ? 'cursor-pointer' : ''}`}>
    {children}
  </div>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-brand-100">
          <h2 className="text-xl font-serif font-bold text-brand-900">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-brand-50 rounded-full text-brand-500"><X size={24} /></button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, className = '', ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-brand-700 mb-1">{label}</label>
    <input className={`w-full px-3 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${className}`} {...props} />
  </div>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-end mb-6">
    <div>
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-900">{title}</h2>
      {subtitle && <p className="text-brand-600 mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);