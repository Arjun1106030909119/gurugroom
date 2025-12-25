import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Landing from './views/Landing';
import Marketplace from './views/Marketplace';
import Dashboard from './views/Dashboard';
import SessionRoom from './views/SessionRoom';
import Profile from './views/Profile';
import Auth from './views/Auth';
import Inbox from './views/Inbox';
import BookingModal from './components/BookingModal';
import { ViewState, User, Session, SkillListing, Conversation, ChatMessage } from './types';
import { MOCK_LISTINGS, MOCK_SESSIONS, MOCK_USERS, CURRENT_USER, MOCK_CONVERSATIONS } from './constants';
import { supabase } from './lib/supabaseClient';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // --- Centralized State ---
  const [currentView, setCurrentView] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<User | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [listings, setListings] = useState<SkillListing[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Booking State
  const [selectedListingForBooking, setSelectedListingForBooking] = useState<SkillListing | null>(null);

  // --- Supabase Init & Data Fetching ---
  useEffect(() => {
    const init = async () => {
      await checkUser();
      await fetchListings();
      setIsLoading(false);
    };
    init();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
          await fetchUserSessions(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSessions([]);
        setCurrentView('LANDING');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id);
        await fetchUserSessions(session.user.id);
      }
    } catch (e) {
      console.warn("Session check failed", e);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (data) {
        setUser(data as User);
      } else {
        // Profile doesn't exist (e.g., first time OAuth login), so create it
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
           const newProfile = {
              id: userId,
              name: authUser.user_metadata.full_name || authUser.email?.split('@')[0] || 'User',
              avatar: authUser.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
              role: 'learner',
              title: 'Learner',
              bio: '',
              credits: 10,
              skills: [],
              rating: 0,
              reviews: 0,
              email: authUser.email
           };
           
           const { error: createError } = await supabase.from('profiles').insert([newProfile]);
           if (!createError) {
             setUser(newProfile as unknown as User);
           } else {
             console.error("Failed to create new profile automatically", createError);
           }
        }
      }
    } catch (e) {
      console.error("Profile handling error", e);
    }
  };

  const fetchListings = async () => {
    try {
      // 1. Fetch Listings (No Join)
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*');

      if (listingsError) throw listingsError;

      if (!listingsData || listingsData.length === 0) {
         console.log("No listings found in DB. You can create one in the Dashboard.");
         // We only fallback to mocks if we really want to, but for a real DB experience, 
         // let's show empty state or mocks if strictly needed. 
         // Keeping mocks for now so the UI isn't empty on first load.
         setListings(MOCK_LISTINGS);
         return;
      }
      
      // 2. Fetch Experts manually to avoid join issues
      const expertIds = Array.from(new Set(listingsData.map((l: any) => l.expert_id).filter(Boolean)));
      
      let profilesMap: Record<string, any> = {};
      
      if (expertIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .in('id', expertIds);
          
        if (profilesData) {
          profilesMap = profilesData.reduce((acc: any, p: any) => ({...acc, [p.id]: p}), {});
        }
      }

      const formattedListings = listingsData.map((item: any) => {
        const expert = profilesMap[item.expert_id] || MOCK_USERS.find(u => u.id === item.expert_id) || {
            id: item.expert_id,
            name: 'Unknown Expert',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.expert_id}`,
            title: 'Expert',
            rating: 5.0
        };
        
        return {
          ...item,
          expert,
          skillName: item.skill_name || item.skillName, 
          creditCost: item.credit_cost || item.creditCost,
          imageUrl: item.image_url || item.imageUrl,
          expertId: item.expert_id
        };
      });

      setListings(formattedListings);

    } catch (e: any) {
      if (e.message?.includes('Could not find the table') || e.code === '42P01') {
         console.warn("Supabase tables not found. Using Mock Data.");
      } else {
         console.error("Error fetching listings:", e);
      }
      setListings(MOCK_LISTINGS);
    }
  };

  const fetchUserSessions = async (userId: string) => {
    try {
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .or(`learner_id.eq.${userId},expert_id.eq.${userId}`)
        .order('scheduled_at', { ascending: true });

      if (sessionsError) throw sessionsError;
      
      if (!sessionsData || sessionsData.length === 0) {
        setSessions([]);
        return;
      }

      const listingIds = [...new Set(sessionsData.map((s: any) => s.listing_id))];
      const expertIds = [...new Set(sessionsData.map((s: any) => s.expert_id))];

      const { data: listingsData } = await supabase.from('listings').select('*').in('id', listingIds);
      const { data: expertsData } = await supabase.from('profiles').select('*').in('id', expertIds);

      const listingsMap = (listingsData || []).reduce((acc: any, l: any) => ({...acc, [l.id]: l}), {});
      const expertsMap = (expertsData || []).reduce((acc: any, e: any) => ({...acc, [e.id]: e}), {});

      const formattedSessions = sessionsData.map((item: any) => ({
        ...item,
        expert: expertsMap[item.expert_id] || { name: 'Unknown Expert', avatar: '' }, 
        listing: listingsMap[item.listing_id],
        scheduledAt: item.scheduled_at,
        durationMinutes: item.duration_minutes
      }));

      setSessions(formattedSessions);

    } catch (e: any) {
      if (e.message?.includes('Could not find the table')) {
         setSessions(MOCK_SESSIONS);
      } else {
         setSessions([]);
      }
    }
  };

  // --- Actions ---

  const handleOpenAuth = () => {
    setCurrentView('AUTH');
  };

  const handleAuthComplete = async () => {
    // Auth state listener will handle the data fetching
    setCurrentView('DASHBOARD');
  };

  const handleDemoLogin = () => {
    setUser(CURRENT_USER);
    setSessions(MOCK_SESSIONS);
    setCurrentView('DASHBOARD');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); 
    setSessions([]);
    setCurrentView('LANDING');
  };

  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    if (!user) return;
    
    if (user.id === 'u1') {
      setUser({ ...user, ...updatedData });
      alert("Profile updated locally (Demo Mode)!");
      setCurrentView('DASHBOARD');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('id', user.id);

    if (error) {
      alert("Error updating profile: " + error.message);
    } else {
      setUser({ ...user, ...updatedData });
      alert("Profile updated successfully!");
      setCurrentView('DASHBOARD');
    }
  };

  const handleAddCredits = async (amount: number, cost: number) => {
    if (!user) return;
    setIsProcessingPayment(true);
    
    // Simulate Payment Gateway Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock user check
    if (user.id === 'u1') {
        const newBalance = (user.credits || 0) + amount;
        setUser({ ...user, credits: newBalance });
        setIsProcessingPayment(false);
        alert(`Payment Verified! $${cost} charged via Secure Gateway. ${amount} credits added.`);
        return;
    }

    const newBalance = (user.credits || 0) + amount;
    
    const { error } = await supabase
      .from('profiles')
      .update({ credits: newBalance })
      .eq('id', user.id);

    setIsProcessingPayment(false);
    
    if (error) {
      alert("Transaction failed: " + error.message);
    } else {
      setUser({ ...user, credits: newBalance });
      alert(`Payment successful! ${amount} credits added to your wallet.`);
    }
  };

  const handleTransferCredits = async (recipientEmail: string, amount: number) => {
    if (!user) return;

    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (user.id === 'u1') {
      // Demo mode simulation
      const newBalance = (user.credits || 0) - amount;
      setUser({...user, credits: newBalance});
      return; 
    }

    // 1. Check Recipient Existence
    const { data: recipient, error: recipientError } = await supabase
      .from('profiles')
      .select('id, credits, name')
      .eq('email', recipientEmail)
      .single();

    if (recipientError || !recipient) {
      throw new Error("Recipient email not found in our system.");
    }

    if (recipient.id === user.id) {
      throw new Error("You cannot transfer credits to yourself.");
    }

    // 2. Perform Transfer (Note: In a real backend, this should be an atomic transaction)
    
    // Deduct from Sender
    const { error: deductError } = await supabase
      .from('profiles')
      .update({ credits: (user.credits || 0) - amount })
      .eq('id', user.id);

    if (deductError) throw new Error("Failed to deduct credits. Please try again.");

    // Add to Recipient
    const { error: addError } = await supabase
      .from('profiles')
      .update({ credits: (recipient.credits || 0) + amount })
      .eq('id', recipient.id);

    if (addError) {
      // Critical error: credits deducted but not added. 
      // In a real app, we'd have a backend rollback. Here we alert.
      console.error("Critical Transfer Error", addError);
      alert("Error crediting recipient. Please contact support.");
    } else {
      setUser({ ...user, credits: (user.credits || 0) - amount });
    }
  };

  const handleCreateListing = async (formData: any) => {
    if (!user) return;

    if (user.id === 'u1') {
        alert("Cannot create listings in Demo Mode.");
        return;
    }

    const { error } = await supabase.from('listings').insert([{
        expert_id: user.id,
        skill_name: formData.skillName,
        description: formData.description,
        credit_cost: parseInt(formData.creditCost),
        level: formData.level,
        image_url: formData.imageUrl || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(formData.skillName)}`,
        tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    }]);

    if (error) {
        alert("Failed to create listing: " + error.message);
    } else {
        alert("Listing created successfully!");
        fetchListings(); // Refresh marketplace
        
        // Also update user role to expert if not already
        if (user.role !== 'expert') {
             await supabase.from('profiles').update({ role: 'expert' }).eq('id', user.id);
             setUser({...user, role: 'expert'});
        }
        
        setCurrentView('MARKETPLACE');
    }
  };

  // 1. Initiate Booking (Opens Modal)
  const handleInitiateBooking = (listing: SkillListing) => {
    if (!user) {
      handleOpenAuth();
      return;
    }

    // Prevent booking own listing
    if (listing.expertId === user.id) {
        alert("You cannot book your own session!");
        return;
    }

    if ((user.credits || 0) < listing.creditCost) {
      const needed = listing.creditCost - (user.credits || 0);
      alert(`Insufficient credits! You need ${needed} more credits. Please top up in your Dashboard.`);
      return;
    }

    setSelectedListingForBooking(listing);
  };

  const handleInitiateMessage = (expertId: string, expertName: string) => {
      if (!user) {
          handleOpenAuth();
          return;
      }
      
      // Check if conversation already exists
      const existingConv = conversations.find(c => c.participantId === expertId);
      if (existingConv) {
          setCurrentView('INBOX');
          return;
      }

      // Create new placeholder conversation
      const newConv: Conversation = {
          id: `c-${Date.now()}`,
          participantId: expertId,
          participantName: expertName,
          participantAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${expertId}`,
          lastMessage: 'Started a new conversation',
          lastMessageTime: 'Now',
          unreadCount: 0,
          messages: []
      };

      setConversations([newConv, ...conversations]);
      setCurrentView('INBOX');
  };

  const handleSendMessage = (conversationId: string, text: string) => {
      setConversations(prev => prev.map(c => {
          if (c.id === conversationId) {
              return {
                  ...c,
                  lastMessage: text,
                  lastMessageTime: 'Now',
                  messages: [
                      ...c.messages,
                      {
                          id: `m-${Date.now()}`,
                          senderId: user?.id || 'unknown',
                          senderName: 'Me',
                          text: text,
                          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                      }
                  ]
              };
          }
          return c;
      }));
  };

  // 2. Finalize Booking (Called from Modal)
  const handleFinalizeBooking = async (date: Date) => {
    if (!user || !selectedListingForBooking) return;

    // Start transaction logic (simplified)
    const newBalance = (user.credits || 0) - selectedListingForBooking.creditCost;
    
    // Check for Demo Mode OR Mock Listing
    // If the listing ID exists in MOCK_LISTINGS, it's a mock listing.
    const isMockListing = MOCK_LISTINGS.some(l => l.id === selectedListingForBooking.id);
    const isDemoUser = user.id === 'u1';

    if (isDemoUser || isMockListing) {
       const newSession: Session = {
           id: `s-${Date.now()}`,
           listingId: selectedListingForBooking.id,
           expert: selectedListingForBooking.expert,
           learnerId: user.id,
           status: 'scheduled',
           scheduledAt: date.toISOString(),
           durationMinutes: 60,
           topic: `Session: ${selectedListingForBooking.skillName}`
       };
       setSessions([...sessions, newSession]);
       setUser({...user, credits: newBalance});
       
       if (!isDemoUser) {
           alert("Session Booked! (Simulation Mode: This was a mock listing)");
       }

       setSelectedListingForBooking(null);
       setCurrentView('DASHBOARD');
       return;
    }

    // Real DB Transaction for Real Listings + Real Users
    // 1. Deduct credits
    const { error: creditError } = await supabase
      .from('profiles')
      .update({ credits: newBalance })
      .eq('id', user.id);
      
    if (creditError) {
      alert("Booking failed during payment: " + creditError.message);
      return;
    }

    // 2. Create Session
    const { error: sessionError } = await supabase
      .from('sessions')
      .insert([
        {
          listing_id: selectedListingForBooking.id,
          expert_id: selectedListingForBooking.expertId || selectedListingForBooking.expert.id, 
          learner_id: user.id,
          status: 'scheduled',
          scheduled_at: date.toISOString(),
          duration_minutes: 60,
          topic: `Session: ${selectedListingForBooking.skillName}`
        }
      ]);

    if (sessionError) {
      console.error("Session creation error", sessionError);
      alert("Booking failed: " + sessionError.message);
      // In a real app, we would revert the credit deduction here
    } else {
      // Optimistic update
      setUser({ ...user, credits: newBalance });
      fetchUserSessions(user.id); // Refresh sessions
      setSelectedListingForBooking(null);
      setCurrentView('DASHBOARD');
    }
  };

  const handleJoinSession = (sessionId: string) => {
    // In real app, update DB status to live
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'live' } : s));
    setActiveSessionId(sessionId);
    setCurrentView('SESSION_ROOM');
  };

  const handleEndSession = async () => {
    if (activeSessionId) {
       // Update DB if not mock
       if (!user || user.id !== 'u1') {
         await supabase.from('sessions').update({ status: 'completed' }).eq('id', activeSessionId);
       }
       // Local update
       setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, status: 'completed' } : s));
    }
    setActiveSessionId(null);
    setCurrentView('DASHBOARD');
  };

  // --- View Router ---
  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex h-[calc(100vh-64px)] items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
      );
    }

    switch (currentView) {
      case 'LANDING':
        return <Landing onGetStarted={() => setCurrentView('MARKETPLACE')} />;
      
      case 'MARKETPLACE':
        return (
          <Marketplace 
            listings={listings} 
            onBook={handleInitiateBooking} 
            onMessage={handleInitiateMessage}
          />
        );
      
      case 'AUTH':
        return (
          <Auth 
            onComplete={handleAuthComplete} 
            onCancel={() => setCurrentView('LANDING')} 
            onDemoLogin={handleDemoLogin}
          />
        );
      
      case 'DASHBOARD':
        if (!user) return <Landing onGetStarted={handleOpenAuth} />;
        return (
          <Dashboard 
            user={user} 
            sessions={sessions}
            onJoinSession={handleJoinSession}
            onAddCredits={handleAddCredits}
            onTransferCredits={handleTransferCredits}
            onCreateListing={handleCreateListing}
            isProcessing={isProcessingPayment}
            onEditProfile={() => setCurrentView('PROFILE')}
          />
        );

      case 'PROFILE':
        if (!user) return <Landing onGetStarted={handleOpenAuth} />;
        return (
          <Profile 
            user={user} 
            onSave={handleUpdateProfile} 
            onCancel={() => setCurrentView('DASHBOARD')} 
          />
        );
      
      case 'INBOX':
          if (!user) return <Landing onGetStarted={handleOpenAuth} />;
          return (
              <Inbox 
                  conversations={conversations} 
                  onSendMessage={handleSendMessage} 
                  currentUserId={user.id}
              />
          );

      case 'SESSION_ROOM':
        const session = sessions.find(s => s.id === activeSessionId);
        if (!session) return <Dashboard user={user!} sessions={sessions} onJoinSession={handleJoinSession} onAddCredits={handleAddCredits} onTransferCredits={handleTransferCredits} onCreateListing={handleCreateListing} isProcessing={false} onEditProfile={() => setCurrentView('PROFILE')}/>;
        return <SessionRoom session={session} user={user!} onEndCall={handleEndSession} />;
        
      default:
        return <Landing onGetStarted={handleOpenAuth} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {currentView !== 'SESSION_ROOM' && (
        <Navbar 
          currentView={currentView}
          onChangeView={setCurrentView}
          user={user}
          onLogin={handleOpenAuth}
          onLogout={handleLogout}
        />
      )}
      
      <main>
        {renderView()}
      </main>

      {/* Booking Modal Overlay */}
      {selectedListingForBooking && (
        <BookingModal 
          listing={selectedListingForBooking}
          onConfirm={handleFinalizeBooking}
          onCancel={() => setSelectedListingForBooking(null)}
        />
      )}
    </div>
  );
};

export default App;