
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <i className="fa-solid fa-feather-pointed text-white text-xl"></i>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Lumina</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
            Capture your thoughts, <br />
            <span className="text-indigo-600 italic font-serif">reflect</span> on your journey.
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Lumina is more than just a journal. It's a space for self-discovery, powered by gentle AI insights to help you understand your emotional patterns and growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto px-10 h-14 text-lg">Create Free Account</Button>
            </Link>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <i className="fa-solid fa-check text-green-500"></i>
              <span>No credit card required</span>
            </div>
          </div>

          <div className="mt-20 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-3xl blur-3xl opacity-50 -z-10"></div>
            <img 
              src="https://picsum.photos/seed/journal_app/1200/600" 
              alt="App Screenshot" 
              className="rounded-2xl shadow-2xl border border-slate-200 mx-auto"
            />
          </div>
        </div>

        {/* Features */}
        <div className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                  <i className="fa-solid fa-lock text-amber-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Privately Secured</h3>
                <p className="text-slate-600">Your thoughts are yours alone. We use secure storage to keep your entries safe and private.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <i className="fa-solid fa-sparkles text-indigo-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">AI Reflections</h3>
                <p className="text-slate-600">Get gentle, AI-generated reflections on your writing to help you see things from a new perspective.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <i className="fa-solid fa-calendar-days text-emerald-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Mood Tracking</h3>
                <p className="text-slate-600">Automatically track your emotional journey over time with built-in mood analysis tools.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-feather-pointed text-indigo-600 text-lg"></i>
            <span className="font-bold text-slate-900">Lumina Journal</span>
          </div>
          <p className="text-slate-500 text-sm">© 2024 Lumina. All rights reserved.</p>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-indigo-600"><i className="fa-brands fa-twitter"></i></a>
            <a href="#" className="hover:text-indigo-600"><i className="fa-brands fa-github"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};
