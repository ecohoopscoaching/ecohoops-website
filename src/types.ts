export interface Player {
  id: string
  number: number
  name: string
  position: string
  height: string
  age: number
  avatar?: string
  stats: PlayerStats
}

export interface PlayerStats {
  ppg: number
  rpg: number
  apg: number
  spg: number
  fgPct: number
}

export interface Team {
  id: string
  name: string
  gender: 'Boys' | 'Girls'
  ageGroup: string
  birthYear: number
  season: string
  teamPhoto?: string
  isActive: boolean
  record: string
  roster: Player[]
  nextGame?: ScheduleEvent
}

export interface ScheduleEvent {
  id: string
  type: 'game' | 'practice' | 'tournament' | 'event'
  title: string
  date: string
  time: string
  location: string
  opponent?: string
  homeAway?: 'home' | 'away'
  rsvp: {
    going: number
    maybe: number
    notGoing: number
    total: number
  }
  result?: {
    score: string
    outcome: 'W' | 'L' | 'T'
  }
}

export interface Message {
  id: string
  sender: string
  avatar?: string
  content: string
  timestamp: string
  channel: string
  unread?: boolean
}

export interface Testimonial {
  id: string
  name: string
  role: string
  quote: string
  avatar?: string
}

export interface Pillar {
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  slug?: string
  scienceTitle?: string
  scienceDetails?: string[]
  onCourtTitle?: string
  onCourtDetails?: string[]
  parentBenefit?: string[]
  quote?: string
}

export interface PaymentRecord {
  id: string
  player: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  dueDate: string
  description: string
}

export interface ChatMessage {
  role: 'user' | 'model'
  text: string
  timestamp: number
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string | null;
  category: string;
  content: string; // HTML payload
}
