import { Testimonial, Pillar, Message, PaymentRecord } from '../types'

export const POSITIONING_STATEMENT = `EcoHoops helps players become smarter, more confident competitors by teaching basketball the way it's actually played. Our practices are built around real game situations, so learning sticks, improvement transfers to games, and players develop faster where it matters most. We don't just build better basketball players. We build competitors who can think, adapt, and perform under pressure.`

export const TRANSLATION_DICTIONARY = [
  { neverSay: "Ecological Dynamics", sayInstead: "We help players become smarter on the court", note: "Focus on court intelligence and instinct" },
  { neverSay: "Differential Learning", sayInstead: "We help players adapt instead of panic", note: "Focus on adaptability under pressure" },
  { neverSay: "Constraints-Led Approach", sayInstead: "We teach kids to solve problems on their own", note: "Focus on independent decision-making" },
  { neverSay: "Game-based learning", sayInstead: "Everything we do shows up in real games", note: "Focus on game transfer" },
  { neverSay: "Perception-action coupling", sayInstead: "Reading the game", note: "Focus on visual awareness and timing" },
  { neverSay: "Affordances", sayInstead: "Seeing opportunities", note: "Focus on recognizing openings" },
  { neverSay: "Emergence", sayInstead: "Players figure it out", note: "Focus on natural skill discovery" },
  { neverSay: "Representative learning design", sayInstead: "Practice looks like the game", note: "Focus on realistic environment" }
]

export const FIVE_QUESTION_CHECKLIST = [
  { id: 1, question: "What problem does this solve?", description: "Addresses real parent frustrations (freezing in games, drill burnout, lack of transfer)." },
  { id: 2, question: "What outcome does it promise?", description: "Promises real game confidence, adaptability, and decision-making." },
  { id: 3, question: "Why is EcoHoops different?", description: "Game-based constraint training instead of repetitive cone drills." },
  { id: 4, question: "Why should a parent believe us?", description: "Proof line: player transformations, parent reviews, or game evidence." },
  { id: 5, question: "What do they do next?", description: "Clear single CTA (e.g. Register for Tryouts)." }
]

export const PILLARS: Pillar[] = [
  {
    title: 'ECOLOGICAL DYNAMICS',
    subtitle: 'We Help Players Become Smarter On The Court',
    description: 'Kids learn by playing. We play games that look like real basketball, so kids react, read the game, and learn naturally.',
    icon: 'Zap',
    color: '#B0C8E0',
    slug: 'ecological-dynamics',
  },
  {
    title: 'CONSTRAINTS-LED APPROACH',
    subtitle: 'We Teach Kids To Solve Problems On Their Own',
    description: 'We change the game setup, not the kid. By changing rules, boundaries, or defenders, we help kids discover how to adapt and make smart decisions.',
    icon: 'Puzzle',
    color: '#97B3D2',
    slug: 'constraints-led-approach',
  },
  {
    title: 'SELF DETERMINATION THEORY',
    subtitle: 'Fuel the Fire Inside',
    description: 'We feed the fire inside. Kids stay excited when they have choices, feel progress, and feel they belong.',
    icon: 'Flame',
    color: '#6A9BC7',
    slug: 'self-determination-theory',
  },
  {
    title: 'DIFFERENTIAL LEARNING',
    subtitle: 'We Help Players Adapt Instead Of Panic',
    description: 'The brain loves variety. We use different ball weights, footings, and body positions so kids adapt fast and stay calm under pressure.',
    icon: 'Shuffle',
    color: '#4A7FB5',
    slug: 'differential-learning',
  },
  {
    title: 'GROWTH MINDSET',
    subtitle: 'Celebrate Effort, Learn From Mistakes',
    description: 'Mistakes are part of learning. We do not turn kids into robots. We celebrate effort, build confidence, and foster joy.',
    icon: 'TrendingUp',
    color: '#F0E6D3',
    slug: 'growth-mindset',
  },
  {
    title: 'MENTAL HEALTH',
    subtitle: 'Protect the Mind or Lose the Person',
    description: 'We protect the mind first. Every child has a right to play and feel safe. We build a space where kids feel valued.',
    icon: 'Brain',
    color: '#85A4C4',
    slug: 'mental-health',
  },
]


export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'g1',
    name: 'Katarina Homolova',
    role: 'Parent — Google Review',
    quote: "We couldn't be happier with our experience at Ecohoops. It's an incredibly positive and encouraging environment where young players truly love being on the court. Practices are creative and game-based, not old-school drills, which helps players learn organically through playing. Players are encouraged to share their opinions, reflect on their performances, and grow with confidence. Ecohoops isn't just about basketball- it's about developing thoughtful, well-rounded human beings, teammates, and friends through meaningful social activities off the court. Fantastic club! Strongly recommend!",
  },
  {
    id: 'g2',
    name: 'Brajgeet Bhathal',
    role: 'Parent — Google Review',
    quote: "EcoHoops has been a fantastic experience! The program builds strong fundamentals in a fun and supportive environment, helping players grow in both skill and confidence. The coach is dedicated, patient, and truly invested in each athlete's development. It's a positive atmosphere that encourages continuous improvement and a genuine love for the game. My son absolutely loves being part of it!",
  },
  {
    id: 'g3',
    name: 'Dina Hamed',
    role: 'Parent — Google Review',
    quote: "A fantastic program! My daughter has grown a lot as a player while having fun, learning the game, making friends, and understanding teamwork and community values. We're very happy to be part of this team.",
  },
  {
    id: 'g4',
    name: 'Joanna Kkk',
    role: 'Parent — Google Review',
    quote: "Amazing coach, team and people 😊 My son loves his team",
  },
  {
    id: 'g5',
    name: 'T De Mesa',
    role: 'Parent — Google Review',
    quote: "Great coach/mentor on & off the court. If you're looking for non traditional & more games based development this is the place to be!",
  },
  {
    id: 'g6',
    name: 'Anna Badurina',
    role: 'Parent — Google Review',
    quote: "Great team environment and very dedicated Coaches!",
  },
  {
    id: 'g7',
    name: 'herald sison',
    role: 'Parent — Google Review',
    quote: "EcoHoops has been an amazing organization to grow your Kids basketball skills but to also help them mature into good human beings. This club fosters inclusivity and good decision making and mental health.",
  },
  {
    id: 'g8',
    name: 'Matthew Barker',
    role: 'Parent — Google Review',
    quote: "Amazing basketball program that develops players the right way! Hello to learning through playing and goodbye to old school methods! Glad to be a part of the Ecohoops community!",
  },
  {
    id: 'g9',
    name: 'Rabia Din',
    role: 'Parent — Google Review',
    quote: "My daughter has been with the program for a while now and absolutely loves it! She has learned so much, grown as an athlete and made amazing friends. Strongly recommend!",
  },
  {
    id: 't1',
    name: 'Kendy',
    role: 'Parent Testimonial',
    quote: "Coach Adrian has been pivotal in my son's basketball development journey. Coach not only focuses on the physical skills training, but also in the development of having a growth mindset. My son was extremely raw when he began his U9 journey. The discipline he has developed as an elite player has also transformed his performance academically in school. So if you're serious about investing in basketball development for your child, you've come to the right place.",
  },
  {
    id: 't2',
    name: 'Meghan',
    role: 'Parent Testimonial',
    quote: "Coach Adrian has been working with our daughter for some time now and we have noticed huge improvements with her confidence and decision making on the court. Adrian's focus on the mental and physical aspects of the game have allowed our daughter to make effective decisions during practice and game time. We greatly appreciate all the effort and commitment, Adrian's utmost professionalism is outstanding. Our Daughter and all kids that he is currently working with gravitate to him and his style!",
  },
  {
    id: 't3',
    name: 'Chris',
    role: 'Parent Testimonial',
    quote: "I met Adrian several years ago as our sons played on the same basketball team. At the time I was searching for someone to help my son develop some confidence and skills, especially coming from a traumatic experience with a previous coach. I decided to reach out and take a look at how Adrian trains and works with young people. I can simply say that this man has done wonders for my son's skills and confidence in playing the game he enjoys. Adrian pays attention to details and demands the best out of each player he works with.",
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
