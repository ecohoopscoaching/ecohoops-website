import { Team, Player } from '../types'

const createPlayer = (id: string, number: number, name: string, position: string, height: string, age: number, avatar?: string): Player => ({
  id,
  number,
  name,
  position: '',
  height: '',
  age: 0,
  avatar,
  stats: {
    ppg: 0,
    rpg: 0,
    apg: 0,
    spg: 0,
    fgPct: 0,
  },
})

export const TEAMS: Team[] = [
  {
    id: 'u14-girls-ss26',
    name: '2012 Girls',
    gender: 'Girls',
    ageGroup: 'Born 2012',
    birthYear: 2012,
    season: 'Spring/Summer 2026',
    isActive: true,
    record: '0-0',
    roster: [
      createPlayer('g1-ss', 3, 'Alisha Sapp', 'PG', '5\'5"', 14, '/images/Player Profile Pics/Alisha.png'),
      createPlayer('g9-ss', 5, 'Joury Elmorshedy', 'PF', '5\'8"', 14, '/images/Player Profile Pics/Joury.png'),
      createPlayer('g8-ss', 8, 'Charlotte Barker', 'SF', '5\'7"', 14, '/images/Player Profile Pics/Charlotte.png'),
      createPlayer('g2-ss', 10, 'Layla Khawja', 'SG', '5\'4"', 14, '/images/Player Profile Pics/Layla.png'),
      createPlayer('g4-ss', 12, 'Calista Aznar', 'PF', '5\'6"', 14, '/images/Player Profile Pics/Calista.png'),
      createPlayer('g10-ss', 13, 'Amaya Small', 'SG', '5\'6"', 14, '/images/Player Profile Pics/Amaya.png'),
      createPlayer('g3-ss', 16, 'Sydney Kaknevicius', 'SF', '5\'7"', 14, '/images/Player Profile Pics/Sydney.png'),
      createPlayer('g11-ss', 20, 'Simar Ahmed', 'SF', '5\'5"', 14, '/images/Player Profile Pics/Simar.png'),
      createPlayer('g6-ss', 21, 'Muriam Dhawan', 'SG', '5\'5"', 14, '/images/Player Profile Pics/Muriam.png'),
      createPlayer('g12-ss', 22, 'Quinn Quarrington', 'C', '5\'9"', 14, '/images/Player Profile Pics/Quinn.png'),
      createPlayer('g7-ss', 23, 'Aleena Hasan', 'PG', '5\'4"', 14, '/images/Player Profile Pics/Aleena.png'),
      createPlayer('g5-ss', 30, 'Laila Gaafar', 'C', '5\'8"', 14, '/images/Player Profile Pics/Laila.png'),
    ],
    coaches: [
      {
        id: 'c-adrian-g',
        name: 'Adrian Sapp',
        role: 'Head Coach',
        email: 'coach.adrian@ecohoops.ca',
        phone: '(647) 555-0194',
        bio: 'Founder of EcoHoops. Over 15 years coaching youth rep basketball with a focus on player development, positive mentorship, and high-IQ execution.',
        avatar: '/images/coach.png',
        certifications: ['Canada Basketball NCCP Level 2', 'Safe Sport Certified', 'First Aid / CPR-C', 'Jr. NBA Certified']
      },
      {
        id: 'c-maya-g',
        name: 'Maya Williams',
        role: 'Assistant Coach',
        email: 'coach.maya@ecohoops.ca',
        phone: '(416) 555-0155',
        bio: 'Former OUA / USports collegiate guard specializing in perimeter defence, ball screen reading, and shooting mechanics.',
        certifications: ['NCCP Trained', 'Safe Sport Certified']
      },
      {
        id: 'm-lisa-g',
        name: 'Lisa Jenkins',
        role: 'Team Manager',
        email: 'manager.girls@ecohoops.ca',
        phone: '(905) 555-0182',
        bio: 'Coordinates tournament registrations, hotel blocks, uniform distribution, and scorekeeping logistics.'
      }
    ],
    parentContacts: [
      { id: 'p-jenk', name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com', phone: '(416) 555-9011', linkedPlayerName: 'Maya Jenkins', linkedPlayerNumber: 7 },
      { id: 'p-bark', name: 'David Barker', email: 'david.barker@example.com', phone: '(905) 555-2244', linkedPlayerName: 'Charlotte Barker', linkedPlayerNumber: 8 },
      { id: 'p-elmo', name: 'Fatima Elmorshedy', email: 'fatima.e@example.com', phone: '(647) 555-4819', linkedPlayerName: 'Joury Elmorshedy', linkedPlayerNumber: 5 },
      { id: 'p-quar', name: 'Mark Quarrington', email: 'mark.q@example.com', phone: '(905) 555-7312', linkedPlayerName: 'Quinn Quarrington', linkedPlayerNumber: 22 },
      { id: 'p-azna', name: 'Jennifer Aznar', email: 'jennifer.a@example.com', phone: '(416) 555-6671', linkedPlayerName: 'Calista Aznar', linkedPlayerNumber: 12 },
      { id: 'p-khaw', name: 'Tariq Khawja', email: 'tariq.k@example.com', phone: '(647) 555-3810', linkedPlayerName: 'Layla Khawja', linkedPlayerNumber: 10 }
    ]
  },
  {
    id: 'u15-boys-ss26',
    name: '2011 Boys',
    gender: 'Boys',
    ageGroup: 'Born 2011',
    birthYear: 2011,
    season: 'Spring/Summer 2026',
    isActive: true,
    record: '0-0',
    roster: [
      createPlayer('b-jordan-ss', 5, 'Jordan McNally Romero', 'G', '5\'9"', 15),
      createPlayer('b7-ss', 7, 'Jacob Sagat', 'PF', '5\'11"', 15, '/images/Player Profile Pics/Jacob.png'),
      createPlayer('b2-ss', 8, 'Ryder Sison', 'SG', '5\'9"', 15, '/images/Player Profile Pics/Ryder.png'),
      createPlayer('b-julian-ss', 9, 'Julian Diaz', 'G', '5\'8"', 15),
      createPlayer('b-teddy-ss', 12, 'Teddy Dakpoyan', 'F', '5\'11"', 15),
      createPlayer('b6-ss', 13, 'Josh Uppal', 'SF', '6\'0"', 15, '/images/Player Profile Pics/Josh.png'),
      createPlayer('b11-ss', 15, 'Adole Bhathal', 'PF', '6\'0"', 15, '/images/Player Profile Pics/Adole.png'),
      createPlayer('b-mateo-ss', 16, 'Mateo Aldana', 'F', '5\'10"', 15),
      createPlayer('b3-ss', 21, 'Savva Donets', 'SF', '5\'11"', 15, '/images/Player Profile Pics/Savva.png'),
      createPlayer('b-tyler-ss', 33, 'Tyler Ilogon', 'C', '6\'1"', 15),
    ],
    coaches: [
      {
        id: 'c-marcus-b',
        name: 'Marcus Vance',
        role: 'Head Coach',
        email: 'coach.marcus@ecohoops.ca',
        phone: '(416) 555-0133',
        bio: 'Former collegiate athlete emphasizing high-tempo pace-and-space offense, defensive communication, and mental resilience.',
        certifications: ['Canada Basketball NCCP Level 2', 'Safe Sport Certified', 'First Aid / CPR']
      },
      {
        id: 'c-jordan-b',
        name: 'Jordan Lee',
        role: 'Assistant Coach',
        email: 'coach.jordan@ecohoops.ca',
        phone: '(647) 555-0177',
        bio: 'Specialist in post development, rim protection, and transition spacing.',
        certifications: ['NCCP Trained', 'Safe Sport Certified']
      },
      {
        id: 'm-rachel-b',
        name: 'Rachel Sagat',
        role: 'Team Manager',
        email: 'manager.boys@ecohoops.ca',
        phone: '(905) 555-0128',
        bio: 'Parent coordinator, travel planner, and tournament communication liaison.'
      }
    ],
    parentContacts: [
      { id: 'p-jenk-b', name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com', phone: '(416) 555-9011', linkedPlayerName: 'Leo Jenkins', linkedPlayerNumber: 12 },
      { id: 'p-saga', name: 'Robert Sagat', email: 'robert.sagat@example.com', phone: '(905) 555-8812', linkedPlayerName: 'Jacob Sagat', linkedPlayerNumber: 7 },
      { id: 'p-siso', name: 'Elena Sison', email: 'elena.sison@example.com', phone: '(647) 555-1940', linkedPlayerName: 'Ryder Sison', linkedPlayerNumber: 8 },
      { id: 'p-uppa', name: 'Manpreet Uppal', email: 'm.uppal@example.com', phone: '(416) 555-4429', linkedPlayerName: 'Josh Uppal', linkedPlayerNumber: 13 },
      { id: 'p-bhat', name: 'Harjit Bhathal', email: 'h.bhathal@example.com', phone: '(905) 555-7731', linkedPlayerName: 'Adole Bhathal', linkedPlayerNumber: 15 }
    ]
  },
  {
    id: 'u14-girls',
    name: '2012 Girls',
    gender: 'Girls',
    ageGroup: 'Born 2012',
    birthYear: 2012,
    season: 'Winter 2025-2026',
    teamPhoto: '/images/12.png',
    isActive: false,
    record: '14-1',
    roster: [
      createPlayer('g1', 3, 'Alisha Sapp', 'PG', '5\'5"', 13, '/images/Player Profile Pics/Alisha.png'),
      createPlayer('g2', 10, 'Layla Khawja', 'SG', '5\'4"', 13, '/images/Player Profile Pics/Layla.png'),
      createPlayer('g3', 16, 'Sydney Kaknevicius', 'SF', '5\'7"', 13, '/images/Player Profile Pics/Sydney.png'),
      createPlayer('g4', 12, 'Calista Aznar', 'PF', '5\'6"', 13, '/images/Player Profile Pics/Calista.png'),
      createPlayer('g5', 30, 'Laila Gaafar', 'C', '5\'8"', 13, '/images/Player Profile Pics/Laila.png'),
      createPlayer('g6', 5, 'Muriam Dhawan', 'SG', '5\'5"', 13, '/images/Player Profile Pics/Muriam.png'),
      createPlayer('g7', 23, 'Aleena Hasan', 'PG', '5\'4"', 13, '/images/Player Profile Pics/Aleena.png'),
      createPlayer('g8', 8, 'Charlotte Barker', 'SF', '5\'7"', 13, '/images/Player Profile Pics/Charlotte.png'),
      createPlayer('g9', 20, 'Joury Elmorshedy', 'PF', '5\'8"', 13, '/images/Player Profile Pics/Joury.png'),
      createPlayer('g10', 13, 'Amaya Small', 'SG', '5\'6"', 13, '/images/Player Profile Pics/Amaya.png'),
      createPlayer('g11', 21, 'Simar Ahmed', 'SF', '5\'5"', 13, '/images/Player Profile Pics/Simar.png'),
      createPlayer('g12', 22, 'Quinn Quarrington', 'C', '5\'9"', 13, '/images/Player Profile Pics/Quinn.png'),
    ],
    coaches: [
      {
        id: 'c-adrian-g2',
        name: 'Adrian Sapp',
        role: 'Head Coach',
        email: 'coach.adrian@ecohoops.ca',
        phone: '(647) 555-0194',
        bio: 'Founder of EcoHoops. Over 15 years coaching youth rep basketball with a focus on player development, positive mentorship, and high-IQ execution.',
        avatar: '/images/coach.png',
        certifications: ['Canada Basketball NCCP Level 2', 'Safe Sport Certified', 'First Aid / CPR-C', 'Jr. NBA Certified']
      },
      {
        id: 'c-maya-g2',
        name: 'Maya Williams',
        role: 'Assistant Coach',
        email: 'coach.maya@ecohoops.ca',
        phone: '(416) 555-0155',
        bio: 'Former collegiate guard specializing in perimeter defence and shooting mechanics.',
        certifications: ['NCCP Trained', 'Safe Sport Certified']
      }
    ],
    parentContacts: [
      { id: 'p-jenk-w', name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com', phone: '(416) 555-9011', linkedPlayerName: 'Maya Jenkins', linkedPlayerNumber: 7 },
      { id: 'p-bark-w', name: 'David Barker', email: 'david.barker@example.com', phone: '(905) 555-2244', linkedPlayerName: 'Charlotte Barker', linkedPlayerNumber: 8 },
      { id: 'p-elmo-w', name: 'Fatima Elmorshedy', email: 'fatima.e@example.com', phone: '(647) 555-4819', linkedPlayerName: 'Joury Elmorshedy', linkedPlayerNumber: 5 }
    ],
    nextGame: {
      id: 'g2',
      type: 'game',
      title: 'vs Hamilton Flames',
      date: '2026-04-05',
      time: '10:00 AM',
      location: 'David Braley Centre, Hamilton',
      opponent: 'Hamilton Flames',
      homeAway: 'away',
      rsvp: { going: 11, maybe: 1, notGoing: 0, total: 12 },
    },
  },
  {
    id: 'u15-boys',
    name: '2011 Boys',
    gender: 'Boys',
    ageGroup: 'Born 2011',
    birthYear: 2011,
    season: 'Winter 2025-2026',
    teamPhoto: '/images/u15 boys team pic.jpg',
    isActive: false,
    record: '12-3',
    roster: [
      createPlayer('b1', 0, 'Jason Badurina', 'PG', '5\'8"', 14, '/images/Player Profile Pics/Jason.png'),
      createPlayer('b2', 8, 'Ryder Sison', 'SG', '5\'9"', 14, '/images/Player Profile Pics/Ryder.png'),
      createPlayer('b3', 21, 'Savva Donets', 'SF', '5\'11"', 14, '/images/Player Profile Pics/Savva.png'),
      createPlayer('b4', 1, 'Kingston Torralba', 'PG', '5\'7"', 14, '/images/Player Profile Pics/Kingston.png'),
      createPlayer('b5', 2, 'Aiden Valladolid', 'SG', '5\'10"', 14, '/images/Player Profile Pics/Aiden.png'),
      createPlayer('b6', 13, 'Josh Uppal', 'SF', '6\'0"', 14, '/images/Player Profile Pics/Josh.png'),
      createPlayer('b7', 7, 'Jacob Sagat', 'PF', '5\'11"', 14, '/images/Player Profile Pics/Jacob.png'),
      createPlayer('b8', 24, 'Noah Hoang', 'C', '6\'1"', 14, '/images/Player Profile Pics/Noah.png'),
      createPlayer('b9', 23, 'Alex Kolczynski', 'SF', '5\'10"', 14, '/images/Player Profile Pics/Alex.png'),
      createPlayer('b10', 11, 'Gurveer Bhatti', 'SG', '5\'9"', 14, '/images/Player Profile Pics/Gurveer.png'),
      createPlayer('b11', 15, 'Adole Bhathal', 'PF', '6\'0"', 14, '/images/Player Profile Pics/Adole.png'),
      createPlayer('b12', 12, 'Gabriel Kangethe', 'C', '6\'2"', 14, '/images/Player Profile Pics/Gabriel.png'),
    ],
    coaches: [
      {
        id: 'c-marcus-b2',
        name: 'Marcus Vance',
        role: 'Head Coach',
        email: 'coach.marcus@ecohoops.ca',
        phone: '(416) 555-0133',
        bio: 'Former collegiate athlete emphasizing high-tempo pace-and-space offense, defensive communication, and mental resilience.',
        certifications: ['Canada Basketball NCCP Level 2', 'Safe Sport Certified', 'First Aid / CPR']
      }
    ],
    parentContacts: [
      { id: 'p-jenk-bw', name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com', phone: '(416) 555-9011', linkedPlayerName: 'Leo Jenkins', linkedPlayerNumber: 12 },
      { id: 'p-saga-w', name: 'Robert Sagat', email: 'robert.sagat@example.com', phone: '(905) 555-8812', linkedPlayerName: 'Jacob Sagat', linkedPlayerNumber: 7 }
    ],
    nextGame: {
      id: 'g1',
      type: 'game',
      title: 'vs Raptors Prep',
      date: '2026-04-06',
      time: '2:00 PM',
      location: 'Hershey Centre, Mississauga',
      opponent: 'Raptors Prep',
      homeAway: 'home',
      rsvp: { going: 10, maybe: 1, notGoing: 1, total: 12 },
    },
  },

]
