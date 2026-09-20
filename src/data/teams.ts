import { Team, Player } from '../types'

const createPlayer = (
  id: string,
  number: number,
  name: string,
  birthDate: string,
  position?: string,
  avatar?: string
): Player => ({
  id,
  number,
  name,
  birthDate,
  position: position || 'G/F',
  height: '-',
  age: 14,
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
    id: 'u15-girls',
    name: 'U15 Girls',
    gender: 'Girls',
    ageGroup: 'U15 Girls (Born 2012)',
    birthYear: 2012,
    season: 'Winter 2026-2027',
    isActive: true,
    record: '0-0',
    roster: [
      // Oldest to youngest
      createPlayer('g-laila', 30, 'Laila Gaafar', 'January 30, 2012', 'C', '/images/Player Profile Pics/Laila.png'),
      createPlayer('g-muriam', 21, 'Muriam Ahmed', 'February 16, 2012', 'SG', '/images/Player Profile Pics/Muriam.png'),
      createPlayer('g-joury', 5, 'Joury Elmorshedy', 'March 1, 2012', 'PF', '/images/Player Profile Pics/Joury.png'),
      createPlayer('g-amaya', 13, 'Amaya Small', 'March 13, 2012', 'SG', '/images/Player Profile Pics/Amaya.png'),
      createPlayer('g-calista', 12, 'Calista Aznar', 'April 1, 2012', 'PF', '/images/Player Profile Pics/Calista.png'),
      createPlayer('g1-ss', 3, 'Alisha Sapp', 'June 13, 2012', 'PG', '/images/Player Profile Pics/Alisha.png'),
      createPlayer('g-aleena', 23, 'Aleena Hasan', 'July 21, 2012', 'PG', '/images/Player Profile Pics/Aleena.png'),
      createPlayer('g-simar', 20, 'Simar Dhawan', 'August 20, 2012', 'SF', '/images/Player Profile Pics/Simar.png'),
      createPlayer('g-rasna', 28, 'Rasna Purba', 'September 28, 2012', 'G/F'),
      createPlayer('g-inaaya', 35, 'Inaaya Sufian', 'November 1, 2012', 'G/F'),
      createPlayer('g-charlotte', 8, 'Charlotte Barker', 'November 3, 2012', 'SF', '/images/Player Profile Pics/Charlotte.png'),
      createPlayer('g-layla', 10, 'Layla Khawja', 'December 21, 2012', 'SG', '/images/Player Profile Pics/Layla.png'),
    ],
    coaches: [
      {
        id: 'c-adrian-g',
        name: 'Adrian Sapp',
        role: 'Coach',
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
        bio: 'Assistant Coach for the U15 Girls team, dedicated to fundamental skill development, high energy, and team camaraderie.',
        certifications: ['Safe Sport Certified']
      }
    ],
    parentContacts: [
      { id: 'p-adrian-test', name: 'Adrian Sapp (Parent / Test Contact)', email: 'ecohoopscoaching@gmail.com', phone: '(647) 555-0194', linkedPlayerName: 'Alisha Sapp', linkedPlayerNumber: 3 }
    ]
  },
  {
    id: 'u16-boys',
    name: 'U16 Boys',
    gender: 'Boys',
    ageGroup: 'U16 Boys (Born 2011)',
    birthYear: 2011,
    season: 'Winter 2026-2027',
    isActive: true,
    record: '0-0',
    roster: [
      // Oldest to youngest
      createPlayer('b-ronit', 1, 'Ronit Bhamra', 'March 21, 2011', 'G'),
      createPlayer('b-rayan', 20, 'Rayan Khalaf', 'March 23, 2011', 'G'),
      createPlayer('b-savelii', 21, 'Savelii Donets', 'May 8, 2011', 'SF', '/images/Player Profile Pics/Savva.png'),
      createPlayer('b7-ss', 7, 'Jacob Sagat', 'July 7, 2011', 'PF', '/images/Player Profile Pics/Jacob.png'),
      createPlayer('b-adole', 15, 'Adole Bhathal', 'July 12, 2011', 'PF', '/images/Player Profile Pics/Adole.png'),
      createPlayer('b-josh', 13, 'Josh Uppal', 'July 28, 2011', 'SF', '/images/Player Profile Pics/Josh.png'),
      createPlayer('b-gurveer', 11, 'Gurveer Bhatti', 'July 30, 2011', 'SG', '/images/Player Profile Pics/Gurveer.png'),
      createPlayer('b-avir', 0, 'Avir Channa', 'December 7, 2011', 'F'),
      createPlayer('b-dean', 19, 'Dean Kerr', 'December 19, 2011', 'G'),
    ],
    coaches: [
      {
        id: 'c-adrian-b',
        name: 'Adrian Sapp',
        role: 'Head Coach',
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
        bio: 'Coach for the U16 Boys team, bringing passionate leadership, guard development, and competitive defensive intensity.',
        certifications: ['NCCP Trained', 'Safe Sport Certified']
      },
      {
        id: 'c-adrian-y-b',
        name: 'Adrian Yasay',
        role: 'Coach',
        email: 'adrian.yasay@ecohoops.ca',
        phone: '(647) 555-0162',
        bio: 'Coach for the U16 Boys team, focused on skill execution, court spacing, and player confidence.',
        certifications: ['Safe Sport Certified']
      }
    ],
    parentContacts: [
      { id: 'p-adrian-test-b', name: 'Adrian Sapp (Parent / Test Contact)', email: 'ecohoopscoaching@gmail.com', phone: '(647) 555-0194', linkedPlayerName: 'Jacob Sagat', linkedPlayerNumber: 7 }
    ]
  }
]
