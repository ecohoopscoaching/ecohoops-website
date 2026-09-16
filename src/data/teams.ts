import { Team, Player } from '../types'

const createPlayer = (id: string, number: number, name: string, position?: string, height?: string, age?: number, avatar?: string): Player => ({
  id,
  number,
  name,
  position: position || 'G/F',
  height: height || '-',
  age: age || 15,
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
    season: 'Winter 2026-2027',
    isActive: true,
    record: '0-0',
    roster: [
      createPlayer('g1-ss', 3, 'Alisha Sapp', 'PG', '5\'5"', 14, '/images/Player Profile Pics/Alisha.png'),
      createPlayer('g9-ss', 5, 'Joury Elmorshedy', 'PF', '5\'8"', 14, '/images/Player Profile Pics/Joury.png'),
      createPlayer('g8-ss', 8, 'Charlotte Barker', 'SF', '5\'7"', 14, '/images/Player Profile Pics/Charlotte.png'),
      createPlayer('g2-ss', 10, 'Layla Khawja', 'SG', '5\'4"', 14, '/images/Player Profile Pics/Layla.png'),
      createPlayer('g4-ss', 12, 'Calista Aznar', 'PF', '5\'6"', 14, '/images/Player Profile Pics/Calista.png'),
      createPlayer('g10-ss', 13, 'Amaya Small', 'SG', '5\'6"', 14, '/images/Player Profile Pics/Amaya.png'),
      createPlayer('g11-ss', 20, 'Simar Ahmed', 'SF', '5\'5"', 14, '/images/Player Profile Pics/Simar.png'),
      createPlayer('g6-ss', 21, 'Muriam Dhawan', 'SG', '5\'5"', 14, '/images/Player Profile Pics/Muriam.png'),
      createPlayer('g7-ss', 23, 'Aleena Hasan', 'PG', '5\'4"', 14, '/images/Player Profile Pics/Aleena.png'),
      createPlayer('g-rasna-w26', 28, 'Rasna Purba', 'G/F', '5\'5"', 14),
      createPlayer('g5-ss', 30, 'Laila Gaafar', 'C', '5\'8"', 14, '/images/Player Profile Pics/Laila.png'),
      createPlayer('g-inaaya-w26', 35, 'Inaaya Sufian', 'G/F', '5\'7"', 14),
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
        id: 'c-teepu-g',
        name: 'Teepu Khawja',
        role: 'Assistant Coach',
        email: 'teepu.khawja@ecohoops.ca',
        phone: '(647) 555-0188',
        bio: 'Assistant Coach for the 2012 Girls team, dedicated to fundamental skill development, high energy, and team camaraderie.',
        certifications: ['Safe Sport Certified']
      }
    ],
    parentContacts: [
      { id: 'p-adrian-test', name: 'Adrian Sapp (Parent / Test Contact)', email: 'ecohoopscoaching@gmail.com', phone: '(647) 555-0194', linkedPlayerName: 'Alisha Sapp', linkedPlayerNumber: 3 }
    ]
  },
  {
    id: 'u15-boys-ss26',
    name: '2011 Boys',
    gender: 'Boys',
    ageGroup: 'Born 2011',
    birthYear: 2011,
    season: 'Winter 2026-2027',
    isActive: true,
    record: '0-0',
    roster: [
      createPlayer('b7-ss', 7, 'Jacob Sagat', 'PF', '5\'11"', 15, '/images/Player Profile Pics/Jacob.png'),
      createPlayer('b3-ss', 21, 'Savva Donets', 'SF', '5\'11"', 15, '/images/Player Profile Pics/Savva.png'),
      createPlayer('b6-ss', 13, 'Josh Uppal', 'SF', '6\'0"', 15, '/images/Player Profile Pics/Josh.png'),
      createPlayer('b-dean-ss', 2, 'Dean', 'G', '5\'8"', 15),
      createPlayer('b-rayan-ss', 4, 'Rayan', 'G', '5\'9"', 15),
      createPlayer('b10-ss', 11, 'Gurveer Bhatti', 'SG', '5\'9"', 15, '/images/Player Profile Pics/Gurveer.png'),
      createPlayer('b11-ss', 15, 'Adole Bhathal', 'PF', '6\'0"', 15, '/images/Player Profile Pics/Adole.png'),
      createPlayer('b-avir-ss', 8, 'Avir', 'F', '5\'10"', 15),
      createPlayer('b-ronit-ss', 23, 'Ronit (?)', 'G', '5\'9"', 15),
      createPlayer('b-neal-ss', 24, 'Neal (?)', 'F', '5\'11"', 15),
    ],
    coaches: [
      {
        id: 'c-adrian-b',
        name: 'Adrian Sapp',
        role: 'Coach',
        email: 'coach.adrian@ecohoops.ca',
        phone: '(647) 555-0194',
        bio: 'Founder of EcoHoops. Over 15 years coaching youth rep basketball with a focus on player development, positive mentorship, and high-IQ execution.',
        avatar: '/images/coach.png',
        certifications: ['Canada Basketball NCCP Level 2', 'Safe Sport Certified', 'First Aid / CPR-C', 'Jr. NBA Certified']
      },
      {
        id: 'c-herald-b',
        name: 'Herald Sison',
        role: 'Coach',
        email: 'herald.sison@ecohoops.ca',
        phone: '(416) 555-0144',
        bio: 'Coach for the 2011 Boys team, bringing passionate leadership, guard development, and competitive defensive intensity.',
        certifications: ['NCCP Trained', 'Safe Sport Certified']
      },
      {
        id: 'c-adrian-y-b',
        name: 'Adrian Yasay',
        role: 'Coach',
        email: 'adrian.yasay@ecohoops.ca',
        phone: '(647) 555-0162',
        bio: 'Coach for the 2011 Boys team, focused on skill execution, court spacing, and player confidence.',
        certifications: ['Safe Sport Certified']
      }
    ],
    parentContacts: [
      { id: 'p-adrian-test-b', name: 'Adrian Sapp (Parent / Test Contact)', email: 'ecohoopscoaching@gmail.com', phone: '(647) 555-0194', linkedPlayerName: 'Jacob Sagat', linkedPlayerNumber: 7 }
    ]
  }
]

