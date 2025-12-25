import { User, SkillListing, Session, SectionId, BlueprintSection, MatchingFactor, Conversation } from './types';
import { Layers, Users, GitMerge, Server, Database, Terminal, Video, Code } from 'lucide-react';

export const MATCHING_FACTORS: MatchingFactor[] = [
  { name: 'Skill Match', weight: 45, color: '#6366f1' },
  { name: 'Availability', weight: 30, color: '#8b5cf6' },
  { name: 'Rating', weight: 15, color: '#ec4899' },
  { name: 'Language', weight: 10, color: '#10b981' },
];

export const BLUEPRINT_DATA: BlueprintSection[] = [
  {
    id: SectionId.FEATURES,
    title: 'Features',
    icon: Layers,
    content: {
      categories: [
        {
          title: 'For Learners',
          items: ['Expert Search', 'Live Video', 'Secure Payments']
        },
        {
          title: 'For Experts',
          items: ['Profile Management', 'Session Tools', 'Analytics']
        }
      ]
    }
  },
  {
    id: SectionId.ROLES,
    title: 'Roles',
    icon: Users,
    content: [
      { role: 'Learner', color: 'border-indigo-500', desc: 'Consumes content and sessions.' },
      { role: 'Expert', color: 'border-purple-500', desc: 'Provides services and earns.' },
      { role: 'Admin', color: 'border-slate-500', desc: 'System management.' }
    ]
  },
  {
    id: SectionId.MATCHING,
    title: 'Matching',
    icon: GitMerge,
    content: {
      code: `const score = (req, exp) => {
  return (
    req.skills.intersect(exp.skills).len * 0.45 +
    exp.availability.includes(req.time) * 0.30 +
    normalize(exp.rating) * 0.15 +
    (req.lang === exp.lang) * 0.10
  );
}`
    }
  },
  {
    id: SectionId.ARCHITECTURE,
    title: 'Architecture',
    icon: Server,
    content: {}
  },
  {
    id: SectionId.DATABASE,
    title: 'Database',
    icon: Database,
    content: [
      {
        name: 'Users',
        code: `{ id: UUID, role: Enum, profile: Map }`
      },
      {
        name: 'Sessions',
        code: `{ expertId: UUID, learnerId: UUID, status: Enum }`
      }
    ]
  },
  {
    id: SectionId.API,
    title: 'API',
    icon: Terminal,
    content: [
      {
        group: 'Core',
        endpoints: [
          { method: 'GET', url: '/api/v1/experts', desc: 'List experts' },
          { method: 'POST', url: '/api/v1/sessions', desc: 'Create session' }
        ]
      }
    ]
  },
  {
    id: SectionId.VIDEO,
    title: 'Video',
    icon: Video,
    content: {
      strategies: [
        { title: 'Peer Connection', desc: 'WebRTC Mesh', code: 'new RTCPeerConnection()' },
        { title: 'Signaling', desc: 'WebSocket', code: 'io.emit("offer", sdp)' }
      ],
      features: ['Screen Share', 'Chat', 'Recording']
    }
  },
  {
    id: SectionId.IMPLEMENTATION,
    title: 'Timeline',
    icon: Code,
    content: [
      { phase: 'MVP', time: 'Week 1-2', desc: 'Core Marketplace' },
      { phase: 'Beta', time: 'Week 3-4', desc: 'Video & Payments' }
    ]
  }
];

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  role: 'learner',
  title: 'Frontend Developer',
  bio: 'Passionate about React and UI design. Looking to improve backend skills.',
  credits: 12,
  skills: ['React', 'TypeScript', 'Tailwind'],
  rating: 4.8,
  reviews: 12
};

export const MOCK_USERS: User[] = [
  {
    id: 'e1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    role: 'expert',
    title: 'Senior System Architect',
    bio: 'Ex-Google engineer with 10 years of experience in distributed systems.',
    credits: 150,
    skills: ['System Design', 'Go', 'Kubernetes'],
    rating: 5.0,
    reviews: 84
  },
  {
    id: 'e2',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    role: 'expert',
    title: 'Guitar Virtuoso',
    bio: 'Berklee graduate offering jazz and blues guitar masterclasses.',
    credits: 80,
    skills: ['Guitar', 'Music Theory'],
    rating: 4.9,
    reviews: 42
  },
  {
    id: 'e3',
    name: 'Elena Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'expert',
    title: 'Native Spanish Speaker',
    bio: 'Certified language tutor specializing in conversational fluency.',
    credits: 45,
    skills: ['Spanish', 'Linguistics'],
    rating: 4.7,
    reviews: 156
  }
];

export const MOCK_LISTINGS: SkillListing[] = [
  {
    id: 'l1',
    expertId: 'e1',
    expert: MOCK_USERS[0],
    skillName: 'System Design Interview Prep',
    description: 'Master the architectural patterns needed to ace your tech interviews. We will cover scaling, sharding, and CAP theorem.',
    level: 'Advanced',
    creditCost: 3,
    tags: ['Tech', 'Career', 'Architecture'],
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'l2',
    expertId: 'e2',
    expert: MOCK_USERS[1],
    skillName: 'Advanced Jazz Improvisation',
    description: 'Learn to navigate complex chord changes and build your own melodic voice on the guitar.',
    level: 'Expert',
    creditCost: 2,
    tags: ['Music', 'Creative', 'Guitar'],
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'l3',
    expertId: 'e3',
    expert: MOCK_USERS[2],
    skillName: 'Conversational Spanish',
    description: 'Practice real-world scenarios in a relaxed environment. Perfect for travelers or business professionals.',
    level: 'Intermediate',
    creditCost: 1,
    tags: ['Language', 'Culture'],
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600'
  }
];

export const MOCK_SESSIONS: Session[] = [
  {
    id: 's1',
    listingId: 'l1',
    expert: MOCK_USERS[0],
    learnerId: 'u1',
    status: 'live',
    scheduledAt: new Date().toISOString(),
    durationMinutes: 60,
    topic: 'System Design Mock Interview'
  },
  {
    id: 's2',
    listingId: 'l2',
    expert: MOCK_USERS[1],
    learnerId: 'u1',
    status: 'scheduled',
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days later
    durationMinutes: 45,
    topic: 'Jazz Scales and Modes'
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    participantId: 'e1',
    participantName: 'Sarah Chen',
    participantAvatar: MOCK_USERS[0].avatar,
    lastMessage: 'Great, see you at the scheduled time!',
    lastMessageTime: '10:30 AM',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'e1', senderName: 'Sarah Chen', text: 'Hi Alex! Thanks for booking.', timestamp: '10:28 AM' },
      { id: 'm2', senderId: 'u1', senderName: 'Me', text: 'Looking forward to it.', timestamp: '10:29 AM' },
      { id: 'm3', senderId: 'e1', senderName: 'Sarah Chen', text: 'Great, see you at the scheduled time!', timestamp: '10:30 AM' }
    ]
  },
  {
    id: 'c2',
    participantId: 'e3',
    participantName: 'Elena Rodriguez',
    participantAvatar: MOCK_USERS[2].avatar,
    lastMessage: 'Do you have any specific topics for Spanish?',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    messages: [
      { id: 'm4', senderId: 'e3', senderName: 'Elena Rodriguez', text: 'Hola! Do you have any specific topics for Spanish?', timestamp: 'Yesterday' }
    ]
  }
];