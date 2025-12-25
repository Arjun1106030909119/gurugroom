import React from 'react';
import { ArrowRight, Star, Shield, Users, Video } from 'lucide-react';
import { ViewState } from '../types';

interface Props {
  onGetStarted: () => void;
}

const Landing: React.FC<Props> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
            Master any skill,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              live with an expert.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-300 mb-10">
            Connect with verified professionals for 1-on-1 live video sessions. 
            From coding to cooking, learn faster with personalized guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg shadow-lg shadow-indigo-900/50 transition-all flex items-center justify-center gap-2"
            >
              Find an Expert <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-lg border border-slate-700 transition-all">
              Become a Mentor
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Vetted Experts</h3>
              <p className="text-slate-600">Every mentor is verified for their expertise and teaching ability.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Video className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">HD Video Sessions</h3>
              <p className="text-slate-600">Crystal clear WebRTC video calls with screen sharing and whiteboarding.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Payments</h3>
              <p className="text-slate-600">Credits system ensures safe transactions. Satisfaction guaranteed.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
