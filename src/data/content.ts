import { Testimonial, Pillar, Message, PaymentRecord } from '../types'

export const PILLARS: Pillar[] = [
  {
    title: 'ECOLOGICAL DYNAMICS',
    subtitle: 'Train How Kids Really Learn',
    description: 'Game-like practice scenarios that mirror real competition. No line drills. No standing around. Every session is alive, chaotic, and purposeful — just like the game itself.',
    icon: 'Zap',
    color: '#B0C8E0',
  },
  {
    title: 'CONSTRAINTS-LED APPROACH',
    subtitle: 'Change the Game, Not the Kid',
    description: 'We shape the environment, not the player. By manipulating rules, space, and numbers, we let each athlete discover their own solutions. Every kid develops their unique game.',
    icon: 'Puzzle',
    color: '#97B3D2',
  },
  {
    title: 'SELF-DETERMINATION',
    subtitle: 'Fuel the Fire Inside',
    description: 'Rooted in the science of "The Play State," we focus on autonomy, competence, and connection. When kids are intrinsically motivated and self-directed, they don\'t just play — they wire their brains for resilience.',
    icon: 'Flame',
    color: '#6A9BC7',
  },
  {
    title: 'MENTAL HEALTH FIRST',
    subtitle: 'Protect the Mind or Lose the Person',
    description: 'Basketball is the vehicle, not the destination. Rooted in Article 31 of the UN Convention on the Rights of the Child, we weave mindfulness and safety into every session. We build resilient humans first.',
    icon: 'Brain',
    color: '#4A7FB5',
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Kendy M.',
    role: 'Parent — 2011 Boys',
    quote: 'My son used to dread practice. Now he counts the days. Coach Adrian didn\'t just teach him basketball — he taught him to love the process.',
  },
  {
    id: 't2',
    name: 'Meghan R.',
    role: 'Parent — 2012 Girls',
    quote: 'The difference is night and day. My daughter\'s confidence on AND off the court has skyrocketed. This isn\'t just a basketball program — it\'s a life program.',
  },
  {
    id: 't3',
    name: 'Chris T.',
    role: 'Parent — 2011 Boys',
    quote: 'After years of toxic rep basketball, EcoHoops restored my son\'s love for the game. Adrian gets it — the kid comes first, always.',
  },
  {
    id: 't4',
    name: 'Priya S.',
    role: 'Parent — 2012 Girls',
    quote: 'Finally, a program that values growth over wins. My daughter is learning life skills that will outlast any trophy. EcoHoops is the future.',
  },
]

export const MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: 'Coach Adrian',
    content: 'Great energy at practice today! Remember — Friday Night Hoops is this week. Bring a friend! 🏀',
    timestamp: '2 hours ago',
    channel: 'general',
    unread: true,
  },
  {
    id: 'm2',
    sender: 'Kendy M.',
    content: 'Miles won\'t be at Saturday\'s game — family event. Sorry for the late notice!',
    timestamp: '4 hours ago',
    channel: '2011-boys',
    unread: true,
  },
  {
    id: 'm3',
    sender: 'Coach Adrian',
    content: 'Spring Classic tournament schedule is up. Check the Schedule tab for game times and locations.',
    timestamp: 'Yesterday',
    channel: 'general',
  },
  {
    id: 'm4',
    sender: 'Meghan R.',
    content: 'Can we get the practice plan for this week? Want to work on some stuff at home.',
    timestamp: 'Yesterday',
    channel: '2012-girls',
  },
  {
    id: 'm5',
    sender: 'System',
    content: 'Payment reminder: Spring season fees due by April 15th.',
    timestamp: '2 days ago',
    channel: 'payments',
  },
]

export const PAYMENTS: PaymentRecord[] = [
  { id: 'p1', player: 'Miles Carter', amount: 1850, status: 'paid', dueDate: '2026-03-15', description: 'Spring Season Registration' },
  { id: 'p2', player: 'Jaylen Brooks', amount: 1850, status: 'paid', dueDate: '2026-03-15', description: 'Spring Season Registration' },
  { id: 'p3', player: 'Kai Thompson', amount: 1850, status: 'pending', dueDate: '2026-04-15', description: 'Spring Season Registration' },
  { id: 'p4', player: 'Darius Mitchell', amount: 1850, status: 'pending', dueDate: '2026-04-15', description: 'Spring Season Registration' },
  { id: 'p5', player: 'Nico Alvarez', amount: 1850, status: 'overdue', dueDate: '2026-03-01', description: 'Spring Season Registration' },
  { id: 'p6', player: 'Ava Richardson', amount: 1850, status: 'paid', dueDate: '2026-03-15', description: 'Spring Season Registration' },
  { id: 'p7', player: 'Maya Chen', amount: 1850, status: 'paid', dueDate: '2026-03-15', description: 'Spring Season Registration' },
  { id: 'p8', player: 'Sophia Grant', amount: 1850, status: 'pending', dueDate: '2026-04-15', description: 'Spring Season Registration' },
]

export const PHILOSOPHY_CONTENT = {
  founder: {
    name: 'Adrian Sapp',
    title: 'Founder & Head Coach',
    bio: 'Adrian created EcoHoops after witnessing how traditional competitive coaching harmed his own sons\' mental health and love for basketball. A lifelong basketball mind — player, coach, and basketball dad — he decided enough was enough. EcoHoops was born from the belief that we can keep the grit, the community, and the love for the game while burning the toxic culture that crushes young athletes.',
  },
  mission: 'We\'re not here to build pros. We\'re here to build people. Basketball is just the tool.',
  vision: 'A world where every kid who picks up a basketball finds joy, growth, and belonging — regardless of talent level.',
  bookClub: {
    current: 'The Inner Game of Tennis',
    author: 'W. Timothy Gallwey',
    description: 'Understanding the mental game and the power of letting go of conscious control.',
  },
}

export const FEATURES = [
  {
    title: 'Team Management',
    description: 'Full roster management, player profiles, stats tracking, and lineup builder — all in one place.',
    icon: 'Users',
    link: '/teams'
  },
  {
    title: 'Smart Scheduling',
    description: 'Games, practices, tournaments, and events with calendar sync, conflict detection, and automatic reminders.',
    icon: 'Calendar',
    link: '/schedule'
  },
  {
    title: 'Live RSVP',
    description: 'Real-time availability tracking. Know exactly who\'s coming to every game and practice.',
    icon: 'CheckCircle',
    link: '/schedule'
  },
  {
    title: 'Team Chat',
    description: 'Instant messaging for coaches, parents, and players. Announcements, alerts, and group discussions.',
    icon: 'MessageCircle',
    link: '/dashboard'
  },
  {
    title: 'Payment Tracking',
    description: 'Automated invoicing, payment reminders, and financial reporting. No more chasing fees.',
    icon: 'CreditCard',
    link: '/dashboard'
  },
  {
    title: 'AI Coach',
    description: 'Powered by Google Gemini. Get instant answers about drills, strategy, player development, and the EcoHoops philosophy.',
    icon: 'Bot',
    link: '/dashboard'
  },
]

export const STATS_HIGHLIGHTS = [
  { label: 'Active Players', value: '120+', icon: 'Users' },
  { label: 'Win Rate', value: '87%', icon: 'Trophy' },
  { label: 'Parent Satisfaction', value: '98%', icon: 'Heart' },
  { label: 'Years Running', value: '5', icon: 'Clock' },
]
