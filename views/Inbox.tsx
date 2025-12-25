import React, { useState, useEffect, useRef } from 'react';
import { Conversation, ChatMessage, User } from '../types';
import { Search, Send, Check, CheckCheck, MoreVertical } from 'lucide-react';

interface Props {
  conversations: Conversation[];
  onSendMessage: (conversationId: string, text: string) => void;
  currentUserId: string;
}

const Inbox: React.FC<Props> = ({ conversations, onSendMessage, currentUserId }) => {
  const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id || null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === selectedId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId && inputText.trim()) {
      onSendMessage(selectedId, inputText);
      setInputText('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)]">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col h-full">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                    <p>No messages yet.</p>
                </div>
            ) : (
                conversations.map(conv => (
                <div 
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedId === conv.id ? 'bg-indigo-50 hover:bg-indigo-50' : ''}`}
                >
                    <div className="flex gap-3">
                    <img src={conv.participantAvatar} alt={conv.participantName} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                        <h3 className={`font-medium truncate ${selectedId === conv.id ? 'text-indigo-900' : 'text-slate-900'}`}>{conv.participantName}</h3>
                        <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{conv.lastMessageTime}</span>
                        </div>
                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                        {conv.lastMessage}
                        </p>
                    </div>
                    {conv.unreadCount > 0 && (
                        <div className="flex flex-col justify-center">
                        <span className="w-5 h-5 bg-indigo-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                            {conv.unreadCount}
                        </span>
                        </div>
                    )}
                    </div>
                </div>
                ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full bg-slate-50 hidden md:flex">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={activeConversation.participantAvatar} alt={activeConversation.participantName} className="w-10 h-10 rounded-full" />
                  <div>
                    <h3 className="font-bold text-slate-900">{activeConversation.participantName}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-xs text-slate-500">Online</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeConversation.messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-br-none' 
                          : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <div className={`text-[10px] mt-1 flex justify-end items-center gap-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {msg.timestamp}
                          {isMe && <CheckCheck size={12} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleSend} className="relative flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-slate-100 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <Send size={24} className="ml-1" />
              </div>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;