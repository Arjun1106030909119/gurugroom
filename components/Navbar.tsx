import React from 'react';
import { ViewState, User } from '../types';
import { Layout, Search, Video, User as UserIcon, LogOut, Zap, CreditCard, Mail } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView, user, onLogin, onLogout }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div 
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
              onClick={() => onChangeView('LANDING')}
            >
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">GuruGroom</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-4">
              <button
                onClick={() => onChangeView('MARKETPLACE')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'MARKETPLACE' 
                    ? 'bg-slate-100 text-indigo-600' 
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                Browse Skills
              </button>
              {user && (
                <>
                  <button
                    onClick={() => onChangeView('DASHBOARD')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'DASHBOARD' 
                        ? 'bg-slate-100 text-indigo-600' 
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => onChangeView('INBOX')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                      currentView === 'INBOX' 
                        ? 'bg-slate-100 text-indigo-600' 
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    <Mail size={16} /> Messages
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div 
                  onClick={() => onChangeView('DASHBOARD')}
                  className="hidden md:flex cursor-pointer items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 text-sm font-medium hover:bg-indigo-100 transition-colors"
                >
                  <CreditCard size={14} />
                  {user.credits} Credits
                </div>
                
                <div className="relative group">
                  <button className="flex items-center gap-2 focus:outline-none">
                    <img 
                      className="h-8 w-8 rounded-full border-2 border-white shadow-sm object-cover" 
                      src={user.avatar} 
                      alt={user.name} 
                    />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 hidden group-hover:block z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.title}</p>
                    </div>
                    <button 
                      onClick={() => onChangeView('PROFILE')}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Edit Profile
                    </button>
                    <button 
                      onClick={() => onChangeView('INBOX')}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Messages
                    </button>
                    <button 
                      onClick={() => onChangeView('DASHBOARD')}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={onLogin}
                  className="text-slate-600 hover:text-slate-900 font-medium text-sm"
                >
                  Log in
                </button>
                <button 
                  onClick={onLogin}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;