import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Monitor, Settings, Users, Send, LayoutGrid, MonitorUp } from 'lucide-react';
import { Session, User, ChatMessage } from '../types';

interface Props {
  session: Session;
  user: User;
  onEndCall: () => void;
}

const SessionRoom: React.FC<Props> = ({ session, user, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [viewMode, setViewMode] = useState<'speaker' | 'grid'>('speaker');
  
  // Real-time Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize System Message
  useEffect(() => {
    setMessages([
      {
        id: 'sys-1',
        senderId: 'system',
        senderName: 'System',
        text: `Session started: ${session.topic}. Connected securely.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      },
      {
        id: 'exp-1',
        senderId: session.expert.id,
        senderName: session.expert.name,
        text: `Hello ${user.name}! Can you hear me okay?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, [session.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: 'You',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate Real-time Reply from Expert
    setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: session.expert.id,
        senderName: session.expert.name,
        text: "That's a great point! Let me pull up the whiteboard to explain that further.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 2500); // 2.5s delay for realism
  };

  const toggleScreenShare = () => {
      setIsScreenSharing(!isScreenSharing);
      const msg: ChatMessage = {
          id: `sys-${Date.now()}`,
          senderId: 'system',
          senderName: 'System',
          text: !isScreenSharing ? 'You started screen sharing.' : 'You stopped screen sharing.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: true
      };
      setMessages(prev => [...prev, msg]);
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-900 flex flex-col">
      {/* Main Video Area */}
      <div className="flex-1 p-4 flex gap-4 overflow-hidden relative">
        {/* Main Grid */}
        <div className={`flex-1 flex gap-4 transition-all duration-300 ${showChat ? 'mr-80' : ''}`}>
          
          {viewMode === 'speaker' && !isScreenSharing ? (
            <div className="relative flex-1 h-full">
                {/* Remote User (Expert) */}
                <div className="w-full h-full bg-slate-800 rounded-2xl overflow-hidden relative group border border-slate-700">
                    <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200" 
                    alt="Remote Video"
                    className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {session.expert.name} (Expert)
                    </div>
                </div>

                {/* Local User (PIP) */}
                <div className="absolute bottom-4 right-4 w-48 h-32 md:w-64 md:h-40 bg-slate-800 rounded-xl border-2 border-slate-700 shadow-2xl overflow-hidden z-10 transition-all hover:scale-105">
                    {!isVideoOff ? (
                    <img 
                        src={user.avatar} 
                        alt="Self Video"
                        className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        ME
                        </div>
                    </div>
                    )}
                    <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-0.5 rounded">You</div>
                </div>
            </div>
          ) : (
              // Grid View or Screen Share Mode
             <div className="flex-1 grid grid-cols-2 gap-4 h-full">
                 {isScreenSharing && (
                     <div className="col-span-2 bg-slate-800 rounded-2xl border border-indigo-500/50 flex items-center justify-center relative overflow-hidden">
                         <div className="text-center">
                             <MonitorUp size={48} className="text-indigo-400 mx-auto mb-2" />
                             <p className="text-indigo-200 font-medium">You are sharing your screen</p>
                         </div>
                     </div>
                 )}
                 
                 <div className={`bg-slate-800 rounded-2xl overflow-hidden relative border border-slate-700 ${isScreenSharing ? 'h-48' : ''}`}>
                    <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                    alt="Remote"
                    className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-white text-xs">
                        {session.expert.name}
                    </div>
                 </div>

                 <div className={`bg-slate-800 rounded-2xl overflow-hidden relative border border-slate-700 ${isScreenSharing ? 'h-48' : ''}`}>
                    {!isVideoOff ? (
                        <img 
                            src={user.avatar} 
                            alt="Self"
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                    ) : (
                         <div className="w-full h-full flex items-center justify-center bg-slate-800">
                             <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">ME</div>
                         </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-white text-xs">
                        You
                    </div>
                 </div>
             </div>
          )}
        </div>

        {/* Real-time Chat Sidebar */}
        <div className={`
          absolute top-0 bottom-0 right-0 w-80 bg-slate-800 border-l border-slate-700 flex flex-col transition-transform duration-300 shadow-xl
          ${showChat ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="p-4 border-b border-slate-700 flex justify-between items-center text-white bg-slate-800">
            <h3 className="font-semibold flex items-center gap-2"><MessageSquare size={16}/> Live Chat</h3>
            <button onClick={() => setShowChat(false)} className="text-slate-400 hover:text-white">&times;</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-800/50">
            {messages.map((msg) => (
               <ChatMessageItem 
                  key={msg.id} 
                  name={msg.senderName} 
                  text={msg.text} 
                  time={msg.timestamp} 
                  isSelf={msg.senderId === user.id} 
                  isSystem={msg.isSystem} 
               />
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-slate-700 bg-slate-800">
            <form onSubmit={handleSendMessage} className="relative">
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..." 
                className="w-full bg-slate-700 text-white rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 p-1 text-indigo-400 hover:text-indigo-300"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-8 z-20">
        <div className="flex items-center gap-4 text-white">
          <div className="text-sm font-medium">
            <p className="opacity-90">{session.topic}</p>
            <p className="opacity-50 text-xs">54:20 remaining</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ControlButton 
            isActive={!isMuted} 
            onClick={() => setIsMuted(!isMuted)} 
            icon={isMuted ? MicOff : Mic} 
            activeColor="bg-slate-700"
            inactiveColor="bg-red-500 hover:bg-red-600"
          />
          <ControlButton 
            isActive={!isVideoOff} 
            onClick={() => setIsVideoOff(!isVideoOff)} 
            icon={isVideoOff ? VideoOff : Video} 
            activeColor="bg-slate-700"
            inactiveColor="bg-red-500 hover:bg-red-600"
          />
          <ControlButton 
            isActive={isScreenSharing}
            onClick={toggleScreenShare}
            icon={Monitor} 
            activeColor="bg-green-600 text-white"
          />
          <ControlButton 
            icon={LayoutGrid} 
            onClick={() => setViewMode(viewMode === 'speaker' ? 'grid' : 'speaker')}
            isActive={viewMode === 'grid'}
            activeColor="bg-slate-600"
          />
          <ControlButton 
            icon={MessageSquare} 
            isActive={showChat} 
            onClick={() => setShowChat(!showChat)} 
            activeColor="bg-indigo-600"
          />
          <button 
            onClick={onEndCall}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold ml-4 transition-colors flex items-center gap-2"
          >
            <PhoneOff size={20} /> End Call
          </button>
        </div>

        <div className="flex items-center gap-4">
           <ControlButton icon={Settings} onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

const ControlButton = ({ icon: Icon, onClick, isActive = true, activeColor = "bg-slate-700 hover:bg-slate-600", inactiveColor = "" }: any) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl transition-all text-white ${isActive ? activeColor : inactiveColor || "bg-slate-800 hover:bg-slate-700"}`}
  >
    <Icon size={20} />
  </button>
);

const ChatMessageItem = ({ name, text, time, isSelf, isSystem }: any) => (
  <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
    {!isSystem && <span className="text-xs text-slate-400 mb-1">{name}</span>}
    <div className={`
      max-w-[85%] px-3 py-2 rounded-lg text-sm break-words
      ${isSystem ? 'bg-slate-700/50 text-slate-400 w-full text-center italic text-xs py-1' : ''}
      ${isSelf ? 'bg-indigo-600 text-white rounded-br-none' : ''}
      ${!isSelf && !isSystem ? 'bg-slate-700 text-slate-200 rounded-bl-none' : ''}
    `}>
      {text}
    </div>
    {!isSystem && <span className="text-[10px] text-slate-500 mt-1">{time}</span>}
  </div>
);

export default SessionRoom;