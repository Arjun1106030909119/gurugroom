import React from 'react';
import { Search, Filter, Star, Clock, MessageSquare } from 'lucide-react';
import { SkillListing } from '../types';

interface Props {
  listings: SkillListing[];
  onBook: (listing: SkillListing) => void;
  onMessage: (expertId: string, expertName: string) => void;
}

const Marketplace: React.FC<Props> = ({ listings, onBook, onMessage }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Search */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore Skills</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for Python, Guitar, Marketing..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 flex items-center gap-2 hover:bg-slate-50">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={listing.imageUrl} 
                alt={listing.skillName}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-900">
                {listing.level}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{listing.skillName}</h3>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                  <Star size={14} fill="currentColor" />
                  {listing.expert.rating}
                </div>
              </div>
              
              <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                {listing.description}
              </p>

              <div className="flex items-center gap-3 mb-4">
                <img src={listing.expert.avatar} alt={listing.expert.name} className="w-8 h-8 rounded-full" />
                <div className="text-sm">
                  <p className="font-medium text-slate-900">{listing.expert.name}</p>
                  <p className="text-slate-500 text-xs">{listing.expert.title}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-2">
                <div className="text-sm font-medium text-slate-600 mr-auto">
                  <span className="text-indigo-600 font-bold text-lg">{listing.creditCost}</span> Credits / hr
                </div>
                
                <button 
                  onClick={() => onMessage(listing.expert.id, listing.expert.name)}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200"
                  title="Message Expert"
                >
                    <MessageSquare size={20} />
                </button>
                
                <button 
                  onClick={() => onBook(listing)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Book Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;