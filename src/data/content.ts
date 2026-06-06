import { Testimonial, Pillar, Message, PaymentRecord } from '../types'

export const PILLARS: Pillar[] = [
  {
    title: 'ECOLOGICAL DYNAMICS',
    subtitle: 'Train How Kids Really Learn',
    description: 'We learn by playing. No boring drills or standing in lines. We play games that look like real basketball, so kids react and learn naturally.',
    icon: 'Zap',
    color: '#B0C8E0',
    slug: 'ecological-dynamics',
  },
  {
    title: 'CONSTRAINTS-LED APPROACH',
    subtitle: 'Change the Game, Not the Kid',
    description: 'We change the game, not the kid. By changing rules or using smaller balls, we help kids discover how to move. Every kid finds their own way to play.',
    icon: 'Puzzle',
    color: '#97B3D2',
    slug: 'constraints-led-approach',
  },
  {
    title: 'SELF DETERMINATION THEORY',
    subtitle: 'Fuel the Fire Inside',
    description: 'We feed the fire inside. Kids stay excited when they have choices (autonomy), feel progress (competence), and feel they belong (connection).',
    icon: 'Flame',
    color: '#6A9BC7',
    slug: 'self-determination-theory',
  },
  {
    title: 'DIFFERENTIAL LEARNING',
    subtitle: 'The Brain Loves Variety',
    description: 'The brain loves variety. We use different ball weights, footing, and postures to wake up the brain. This helps kids learn faster and adapt to games.',
    icon: 'Shuffle',
    color: '#4A7FB5',
    slug: 'differential-learning',
  },
  {
    title: 'GROWTH MINDSET',
    subtitle: 'Celebrate the Effort, Learn from Mistakes',
    description: 'Mistakes are just data, not disasters. We praise effort and trying new things. This builds brave kids who do not fear failure.',
    icon: 'TrendingUp',
    color: '#F0E6D3',
    slug: 'growth-mindset',
  },
  {
    title: 'MENTAL HEALTH',
    subtitle: 'Protect the Mind or Lose the Person',
    description: 'We protect the mind first. Every child has a right to play and rest under UN Article 31. We build a safe space where kids feel valued.',
    icon: 'Brain',
    color: '#85A4C4',
    slug: 'mental-health',
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'g1',
    name: 'Dina Hamed',
    role: 'Parent — Google Review',
    quote: 'A fantastic program! My daughter has grown a lot as a player while having fun, learning the game, making friends, and understanding teamwork and community values. We\'re very happy to be part of this team.',
  },
  {
    id: 'g2',
    name: 'Brajgeet Bhathal',
    role: 'Parent — Google Review',
    quote: 'EcoHoops has been a fantastic experience! The program builds strong fundamentals in a fun and supportive environment, helping kids improve their skills while enjoying the game. Highly recommended!',
  },
  {
    id: 'g3',
    name: 'Joanna Kkk',
    role: 'Parent — Google Review',
    quote: 'EcoHoops for Kids Canada is a fantastic basketball program! Great structure, high energy, and a supportive coaching staff that makes learning basketball fun.',
  },
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
    bio: 'Adrian started EcoHoops after seeing how high-pressure coaching hurt his own sons. He is a player, coach, and dad. He wants to keep competitive basketball fun and safe, and throw away the toxic pressure.',
  },
  mission: 'We\'re not here to build pros. We\'re here to build people. Basketball is just the tool.',
  vision: 'A world where every kid who picks up a basketball finds joy, growth, and belonging — regardless of talent level.',
  bookClub: {
    current: 'The Inner Game of Tennis',
    author: 'W. Timothy Gallwey',
    description: 'How to stay calm, stop overthinking, and let your body learn naturally.',
  },
}

export const FEATURES = [
  {
    title: 'Play-Based Learning',
    description: 'Kids learn best by playing. We change the game setup (like using lower hoops) to help them learn.',
    icon: 'Zap',
    link: '/philosophy'
  },
  {
    title: 'Confidence Building',
    description: 'We make kids feel safe (psychological safety). Mistakes are celebrated as part of learning.',
    icon: 'Brain',
    link: '/philosophy'
  },
  {
    title: 'Great Coaches',
    description: 'Friendly coaches who help kids grow without shouting, shaming, or putting them down.',
    icon: 'Users',
    link: '/about'
  },
  {
    title: 'Safe Environments',
    description: 'A kind gym where every kid belongs and is free from toxic sports pressure.',
    icon: 'CheckCircle',
    link: '/about'
  },
  {
    title: 'Real Development',
    description: 'We build happy, strong children who happen to be great basketball players.',
    icon: 'Trophy',
    link: '/philosophy'
  },
]

export const STATS_HIGHLIGHTS = [
  { label: 'Active Players', value: '120+', icon: 'Users' },
  { label: 'Win Rate', value: '87%', icon: 'Trophy' },
  { label: 'Parent Satisfaction', value: '98%', icon: 'Heart' },
  { label: 'Years Running', value: '5', icon: 'Clock' },
]
