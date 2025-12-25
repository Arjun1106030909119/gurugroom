import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, ChevronRight, Check } from 'lucide-react';
import { SkillListing, User } from '../types';

interface Props {
  listing: SkillListing;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

const BookingModal: React.FC<Props> = ({ listing, onConfirm, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  // Generate next 14 days
  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    setAvailableDates(dates);
    setSelectedDate(dates[0]); // Default to tomorrow
  }, []);

  // Generate time slots (9 AM to 6 PM)
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const finalDate = new Date(selectedDate);
      finalDate.setHours(hours, minutes, 0, 0);
      onConfirm(finalDate);
    }
  };

  if (!selectedDate) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={onCancel}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          
          {/* Header */}
          <div className="bg-slate-50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-slate-200">
            <h3 className="text-lg leading-6 font-bold text-slate-900" id="modal-title">
              Book Session
            </h3>
            <button onClick={onCancel} className="text-slate-400 hover:text-slate-500">
              <X size={24} />
            </button>
          </div>

          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Listing Summary */}
            <div className="flex items-center gap-4 mb-6 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <img 
                src={listing.expert.avatar} 
                alt={listing.expert.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">{listing.skillName}</p>
                <p className="text-xs text-slate-600">with {listing.expert.name}</p>
                <p className="text-xs text-indigo-600 font-bold mt-1">{listing.creditCost} Credits / hr</p>
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <CalendarIcon size={16} /> Select Date
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {availableDates.map((date) => {
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center border transition-all
                        ${isSelected 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'}
                      `}
                    >
                      <span className="text-xs font-medium uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-xl font-bold">{date.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Clock size={16} /> Select Time
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`
                        py-2 px-3 rounded-lg text-sm font-medium border transition-all text-center
                        ${isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50'}
                      `}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-slate-500 text-center">
              Session duration is approx. 60 minutes.
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-200">
            <button
              type="button"
              disabled={!selectedDate || !selectedTime}
              onClick={handleConfirm}
              className={`
                w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-3 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm items-center gap-2
                ${(!selectedDate || !selectedTime) 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'}
              `}
            >
              Confirm Booking <Check size={16} />
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 w-full inline-flex justify-center rounded-xl border border-slate-300 shadow-sm px-4 py-3 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;