export type ViewState = 'LANDING' | 'MARKETPLACE' | 'DASHBOARD' | 'SESSION_ROOM' | 'PROFILE' | 'AUTH' | 'INBOX';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'learner' | 'expert' | 'admin';
  title: string;
  bio: string;
  credits: number;
  skills: string[];
  rating: number;
  reviews: number;
}

export interface SkillListing {
  id: string;
  expertId: string;
  expert: User;
  skillName: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  creditCost: number;
  tags: string[];
  imageUrl: string;
}

export interface Session {
  id: string;
  listingId: string;
  expert: User;
  learnerId: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  scheduledAt: string; // ISO string
  durationMinutes: number;
  topic: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export enum SectionId {
  FEATURES = 'FEATURES',
  ROLES = 'ROLES',
  MATCHING = 'MATCHING',
  ARCHITECTURE = 'ARCHITECTURE',
  DATABASE = 'DATABASE',
  API = 'API',
  VIDEO = 'VIDEO',
  IMPLEMENTATION = 'IMPLEMENTATION'
}

export interface MatchingFactor {
  name: string;
  weight: number;
  color: string;
}

export interface BlueprintSection {
  id: SectionId;
  title: string;
  icon: any;
  content: any;
}