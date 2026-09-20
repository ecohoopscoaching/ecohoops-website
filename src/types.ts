export type UserRole = 'admin' | 'coach' | 'parent' | 'player'

export interface ChildProfile {
  id: string
  name: string
  teamId: string
  number?: number
  avatar?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: UserRole
  teamId?: string
  playerId?: string
  childName?: string
  children?: ChildProfile[]
  avatar?: string
}

export interface Player {
  id: string
  number: number
  name: string
  position: string
  height: string
  age: number
  birthDate?: string
  avatar?: string
  emergencyContact?: string
  medicalNotes?: string
  stats: PlayerStats
}

export interface PlayerStats {
  ppg: number
  rpg: number
  apg: number
  spg: number
  fgPct: number
}

export interface CoachProfile {
  id: string
  name: string
  role: 'Head Coach' | 'Assistant Coach' | 'Team Manager' | string
  email: string
  phone?: string
  bio?: string
  avatar?: string
  certifications?: string[]
}

export interface ParentContact {
  id: string
  name: string
  email: string
  phone?: string
  linkedPlayerName: string
  linkedPlayerNumber?: number
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
  coaches?: CoachProfile[]
  parentContacts?: ParentContact[]
  nextGame?: ScheduleEvent
}

export interface AttendanceRecord {
  status: 'going' | 'maybe' | 'notGoing'
  note?: string
  checkedIn?: boolean
  updatedAt?: string
}

export interface ScheduleEvent {
  id: string
  type: 'game' | 'practice' | 'tournament' | 'event'
  title: string
  date: string
  time: string
  location: string
  mapUrl?: string
  venueDetails?: string
  opponent?: string
  homeAway?: 'home' | 'away'
  teamId?: string
  notes?: string
  uniformColor?: 'White (Home)' | 'Black (Away)' | 'Practice Reversible' | string
  arrivalNote?: string
  rsvp: {
    going: number
    maybe: number
    notGoing: number
    total: number
  }
  attendance?: Record<string, AttendanceRecord>
  result?: {
    score: string
    outcome: 'W' | 'L' | 'T'
  }
  lastAlertSent?: string
  lastAlertType?: 'pre_game' | 'weather' | 'update' | 'rsvp' | string
  isOptional?: boolean
  isPhase1?: boolean
  isPhase2?: boolean
  isPlayoffs?: boolean
  isAllStar?: boolean
  league?: 'Coalition' | 'OBL'
  sessionType?: string
  category?: 'practice' | 'friday_night_hoops' | 'league_session' | 'playoffs' | 'all_star' | string
}

export interface EmailNotification {
  id: string
  teamId: string
  teamName: string
  recipientCount: number
  recipientEmails: string[]
  subject: string
  body: string
  sentAt: string
  eventType: 'event_created' | 'event_updated' | 'event_cancelled' | 'coach_announcement' | 'pre_game_reminder' | 'weather_cancellation' | 'rsvp_nudge'
  eventId?: string
  eventTitle?: string
  status: 'sent' | 'simulated'
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
