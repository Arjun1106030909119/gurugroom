import React, { useState } from 'react';
import { User, Session } from '../types';
import { Clock, Video, CreditCard, Edit2, Loader2, Plus, X, ArrowRightLeft, Smartphone, ShieldCheck } from 'lucide-react';

interface Props {
  user: User;
  sessions: Session[];
  onJoinSession: (sessionId: string) => void;
  onAddCredits: (amount: number, cost: number) => void;
  onTransferCredits: (email: string, amount: number) => Promise<void>;
  onCreateListing: (data: any) => void;
  isProcessing: boolean;
  onEditProfile: () => void;
}

type ModalType = 'NONE' | 'TOPUP' | 'TRANSFER' | 'LISTING';
type PaymentMethod = 'CARD' | 'UPI';

const Dashboard: React.FC<Props> = ({ 
  user, 
  sessions, 
  onJoinSession, 
  onAddCredits, 
  onTransferCredits,
  onCreateListing, 
  isProcessing, 
  onEditProfile 
}) => {
  const [activeModal, setActiveModal] = useState<ModalType>('NONE');
  
  // Payment State
  const [selectedPackage, setSelectedPackage] = useState<{amount: number, cost: number} | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');

  // Transfer State
  const [transferData, setTransferData] = useState({ email: '', amount: '' });
  const [transferStatus, setTransferStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [transferError, setTransferError] = useState('');

  // Listing Form State
  const [listingForm, setListingForm] = useState({
      skillName: '',
      description: '',
      creditCost: 1,
      level: 'Beginner',
      tags: '',
      imageUrl: ''
  });

  // --- Handlers ---

  const handleCreateSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onCreateListing(listingForm);
      setActiveModal('NONE');
      setListingForm({ skillName: '', description: '', creditCost: 1, level: 'Beginner', tags: '', imageUrl: '' });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPackage) {
      // In a real app, we would tokenize card/verify UPI here
      onAddCredits(selectedPackage.amount, selectedPackage.cost);
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(transferData.amount);
    if (!amount || amount <= 0) {
      setTransferError("Please enter a valid amount");
      return;
    }
    if (amount > user.credits) {
      setTransferError("Insufficient balance");
      return;
    }

    setTransferStatus('PROCESSING');
    setTransferError('');
    
    try {
      await onTransferCredits(transferData.email, amount);
      setTransferStatus('SUCCESS');
      setTimeout(() => {
        setActiveModal('NONE');
        setTransferStatus('IDLE');
        setTransferData({ email: '', amount: '' });
      }, 2000);
    } catch (err: any) {
      setTransferStatus('ERROR');
      setTransferError(err.message || "Transfer failed");
    }
  };

  const openPaymentModal = () => {
    setSelectedPackage({ amount: 10, cost: 10 }); // Default
    setActiveModal('TOPUP');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name}</h1>
          <p className="text-slate-500">Manage your learning journey and upcoming sessions.</p>
        </div>
        <div className="flex gap-2">
            <button 
            onClick={() => setActiveModal('LISTING')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm"
            >
            <Plus size={16} /> Create Listing
            </button>
            <button 
            onClick={onEditProfile}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
            >
            <Edit2 size={16} /> Edit Profile
            </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content: Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-800">Upcoming Sessions</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View Calendar</button>
            </div>
            
            <div className="divide-y divide-slate-100">
              {sessions.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No scheduled sessions.</div>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex flex-col items-center justify-center font-bold">
                        <span>{new Date(session.scheduledAt).getDate()}</span>
                        <span className="text-xs uppercase">{new Date(session.scheduledAt).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide 
                          ${session.status === 'live' ? 'bg-red-100 text-red-600 animate-pulse' : 
                            session.status === 'completed' ? 'bg-green-100 text-green-600' :
                            'bg-slate-100 text-slate-500'}`}>
                          {session.status}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={12} /> {session.durationMinutes} mins
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900">{session.topic}</h3>
                      <p className="text-sm text-slate-500">with {session.expert.name}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {session.status === 'live' ? (
                        <button 
                          onClick={() => onJoinSession(session.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm"
                        >
                          <Video size={16} /> Join Now
                        </button>
                      ) : session.status === 'scheduled' ? (
                        <button 
                          disabled
                          className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg font-medium text-sm cursor-not-allowed"
                        >
                          Join Session
                        </button>
                      ) : (
                         <button 
                          disabled
                          className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg font-medium text-sm"
                        >
                          Completed
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Stats & Payments */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-8 -mt-8"></div>
            <h3 className="font-semibold text-slate-800 mb-4 relative">Credit Balance</h3>
            <div className="flex items-center justify-between mb-6 relative">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-indigo-600">{user.credits}</span>
                <span className="text-slate-500 font-medium">credits</span>
              </div>
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                <CreditCard size={20} />
              </div>
            </div>
            
            <div className="space-y-3 relative z-10">
              <button 
                onClick={openPaymentModal}
                className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex justify-center items-center gap-2 shadow-sm"
              >
                <Plus size={16} /> Top Up Credits
              </button>
              <button 
                onClick={() => setActiveModal('TRANSFER')}
                className="w-full py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"
              >
                <ArrowRightLeft size={16} /> Transfer Funds
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Your Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
              <button 
                onClick={onEditProfile}
                className="px-3 py-1 border border-dashed border-slate-300 text-slate-400 rounded-full text-sm hover:border-slate-400 hover:text-slate-600"
              >
                + Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Payment Gateway Modal */}
      {activeModal === 'TOPUP' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-slate-900 opacity-75" onClick={() => setActiveModal('NONE')}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full">
              <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-indigo-600" size={24} />
                  <h3 className="text-lg font-bold text-slate-900">Secure Checkout</h3>
                </div>
                <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-500">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row h-full">
                {/* Left: Package Selection */}
                <div className="w-full md:w-1/3 bg-slate-50 p-6 border-r border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Select Amount</h4>
                  <div className="space-y-3">
                    {[
                      { amount: 10, cost: 10 },
                      { amount: 50, cost: 45, save: '10%' },
                      { amount: 100, cost: 85, save: '15%' }
                    ].map((pkg) => (
                      <button
                        key={pkg.amount}
                        onClick={() => setSelectedPackage({ amount: pkg.amount, cost: pkg.cost })}
                        className={`w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden
                          ${selectedPackage?.amount === pkg.amount 
                            ? 'bg-white border-indigo-600 ring-1 ring-indigo-600 shadow-sm' 
                            : 'bg-white border-slate-200 hover:border-slate-300'}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-900">{pkg.amount} Credits</span>
                          {pkg.save && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Save {pkg.save}</span>}
                        </div>
                        <div className="text-sm text-slate-500">${pkg.cost.toFixed(2)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Payment Method */}
                <div className="w-full md:w-2/3 p-6">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Payment Method</h4>
                  
                  {/* Tabs */}
                  <div className="flex gap-4 mb-6 border-b border-slate-200">
                    <button 
                      onClick={() => setPaymentMethod('CARD')}
                      className={`pb-2 text-sm font-medium transition-colors border-b-2 ${paymentMethod === 'CARD' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      Credit/Debit Card
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('UPI')}
                      className={`pb-2 text-sm font-medium transition-colors border-b-2 ${paymentMethod === 'UPI' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      UPI
                    </button>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    {paymentMethod === 'CARD' ? (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Card Number</label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input 
                              type="text" 
                              placeholder="0000 0000 0000 0000" 
                              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Expiry</label>
                            <input 
                              type="text" 
                              placeholder="MM/YY" 
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">CVV</label>
                            <input 
                              type="password" 
                              placeholder="123" 
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Cardholder Name</label>
                            <input 
                              type="text" 
                              placeholder="John Doe" 
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                              value={cardDetails.name}
                              onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                              required
                            />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">UPI ID</label>
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input 
                            type="text" 
                            placeholder="username@okbank" 
                            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            required
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Open your UPI app to approve the request.</p>
                      </div>
                    )}

                    <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={isProcessing}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
                      >
                        {isProcessing ? <Loader2 className="animate-spin" size={20} /> : `Pay $${selectedPackage?.cost.toFixed(2)}`}
                      </button>
                      <p className="text-center text-[10px] text-slate-400 mt-2">Payments processed securely. Non-refundable.</p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Transfer Modal */}
      {activeModal === 'TRANSFER' && (
         <div className="fixed inset-0 z-50 overflow-y-auto">
         <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
           <div className="fixed inset-0 transition-opacity" aria-hidden="true">
             <div className="absolute inset-0 bg-slate-900 opacity-75" onClick={() => setActiveModal('NONE')}></div>
           </div>
           <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
           
           <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full">
             <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-200">
               <h3 className="text-lg font-bold text-slate-900">Transfer Credits</h3>
               <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-500">
                 <X size={24} />
               </button>
             </div>
             
             <div className="p-6">
                {transferStatus === 'SUCCESS' ? (
                   <div className="text-center py-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ShieldCheck size={32} className="text-green-600" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Transfer Successful!</h4>
                      <p className="text-slate-500">Sent {transferData.amount} credits to {transferData.email}</p>
                   </div>
                ) : (
                  <form onSubmit={handleTransferSubmit} className="space-y-4">
                      {transferError && (
                          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                              <X size={16} /> {transferError}
                          </div>
                      )}
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Email</label>
                          <input 
                              type="email" 
                              required
                              value={transferData.email}
                              onChange={e => setTransferData({...transferData, email: e.target.value})}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="friend@example.com"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                          <input 
                              type="number" 
                              required
                              min="1"
                              max={user.credits}
                              value={transferData.amount}
                              onChange={e => setTransferData({...transferData, amount: e.target.value})}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <p className="text-xs text-slate-500 mt-1">Available balance: {user.credits} credits</p>
                      </div>
                      <button 
                          type="submit" 
                          disabled={transferStatus === 'PROCESSING'}
                          className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex justify-center items-center gap-2"
                      >
                          {transferStatus === 'PROCESSING' ? <Loader2 className="animate-spin" size={20} /> : 'Send Credits'}
                      </button>
                  </form>
                )}
             </div>
           </div>
         </div>
       </div>
      )}

      {/* 3. Create Listing Modal */}
      {activeModal === 'LISTING' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-slate-900 opacity-75" onClick={() => setActiveModal('NONE')}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-slate-50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Create New Listing</h3>
                <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-500">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Skill Name</label>
                      <input 
                        required
                        type="text" 
                        value={listingForm.skillName}
                        onChange={e => setListingForm({...listingForm, skillName: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        placeholder="e.g. Advanced Python"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea 
                        required
                        rows={3}
                        value={listingForm.description}
                        onChange={e => setListingForm({...listingForm, description: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        placeholder="What will you teach?"
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Credit Cost (per hr)</label>
                        <input 
                            required
                            type="number" 
                            min="1"
                            value={listingForm.creditCost}
                            onChange={e => setListingForm({...listingForm, creditCost: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
                        <select 
                            value={listingForm.level}
                            onChange={e => setListingForm({...listingForm, level: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        >
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                            <option>Expert</option>
                        </select>
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
                      <input 
                        type="text" 
                        value={listingForm.tags}
                        onChange={e => setListingForm({...listingForm, tags: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        placeholder="Coding, Tech, Music..."
                      />
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (Optional)</label>
                      <input 
                        type="text" 
                        value={listingForm.imageUrl}
                        onChange={e => setListingForm({...listingForm, imageUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        placeholder="https://..."
                      />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                  >
                      Publish Listing
                  </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;