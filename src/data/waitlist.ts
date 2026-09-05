export interface WaitlistEntry {
  id: string
  parentName: string
  email: string
  phone: string // "Not provided" or formatted string
  ageGroup: 'Ages 5–6' | 'Ages 7–9' | 'Ages 10–11'
  groupPreference: 'Boys’ group' | 'Girls’ group' | 'Co-ed' | 'Not provided'
  daysAvailable: 'Friday' | 'Saturday' | 'Either' | 'Not provided'
  neighbourhood: string // Optional string or "Not provided"
  childCount: '1' | '2' | '3' | '4+'
  programInterest?: string
  consent: boolean
  submissionTime: string
  source: string
  utmParams?: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_content?: string
    utm_term?: string
    fbclid?: string
  }
  isTest: boolean
  uncertaintyFlag?: string // For duplicate/conflicting submissions
}

export interface WaitlistMetrics {
  totalSubmissions: number
  realSubmissions: number
  uniqueParentContacts: number
  estimatedChildrenMin: number
  estimatedChildrenMax: number
  paidRegistrations: number
  testSubmissions: number
  divisionBreakdown: {
    'Ages 5–6': number
    'Ages 7–9': number
    'Ages 10–11': number
  }
}

export const WAITLIST_STORAGE_KEY = 'ecohoops_jr_waitlist'

// Reconciled Baseline records from Adrian's latest audit (5 submissions total, 1 test, 4 real across 3 unique parents)
export const BASELINE_WAITLIST_ENTRIES: WaitlistEntry[] = [
  {
    id: 'base-test-dre',
    parentName: 'Dre',
    email: 'ecohoopscoaching@gmail.com',
    phone: 'Not provided',
    ageGroup: 'Ages 5–6',
    groupPreference: 'Co-ed',
    daysAvailable: 'Not provided',
    neighbourhood: 'Not provided',
    childCount: '1',
    programInterest: 'Jr. NBA',
    consent: true,
    submissionTime: '2026-08-28 14:15:00 EDT',
    source: 'Direct (Internal Test)',
    isTest: true,
    uncertaintyFlag: 'Adrian Test Submission (Excluded from real lead totals)',
  },
  {
    id: 'base-lead-01',
    parentName: 'Parent Contact 1',
    email: 'parent1@example.com',
    phone: 'Not provided',
    ageGroup: 'Ages 5–6',
    groupPreference: 'Co-ed',
    daysAvailable: 'Not provided',
    neighbourhood: 'Not provided',
    childCount: '1',
    programInterest: 'Jr. NBA',
    consent: true,
    submissionTime: '2026-08-29 10:20:00 EDT',
    source: 'Website organic',
    isTest: false,
  },
  {
    id: 'base-lead-02-a',
    parentName: 'Parent Contact 2',
    email: 'parent2-multichild@example.com',
    phone: 'Not provided',
    ageGroup: 'Ages 5–6',
    groupPreference: 'Co-ed',
    daysAvailable: 'Not provided',
    neighbourhood: 'Not provided',
    childCount: '1',
    programInterest: 'Jr. NBA',
    consent: true,
    submissionTime: '2026-08-30 16:05:00 EDT',
    source: 'Website organic',
    isTest: false,
    uncertaintyFlag: 'Parent submitted separate forms for 5–6 and 7–9; may represent 2 siblings or an age correction.',
  },
  {
    id: 'base-lead-02-b',
    parentName: 'Parent Contact 2',
    email: 'parent2-multichild@example.com',
    phone: 'Not provided',
    ageGroup: 'Ages 7–9',
    groupPreference: 'Not provided',
    daysAvailable: 'Not provided',
    neighbourhood: 'Not provided',
    childCount: '1',
    programInterest: 'Jr. NBA',
    consent: true,
    submissionTime: '2026-08-30 16:12:00 EDT',
    source: 'Website organic',
    isTest: false,
    uncertaintyFlag: 'Parent submitted separate forms for 5–6 and 7–9; may represent 2 siblings or an age correction.',
  },
  {
    id: 'base-lead-03',
    parentName: 'Parent Contact 3',
    email: 'parent3@example.com',
    phone: 'Not provided',
    ageGroup: 'Ages 5–6',
    groupPreference: 'Co-ed',
    daysAvailable: 'Not provided',
    neighbourhood: 'Not provided',
    childCount: '1',
    programInterest: 'Not Sure Yet',
    consent: true,
    submissionTime: '2026-09-01 11:45:00 EDT',
    source: 'Website organic',
    isTest: false,
  },
]

/**
 * Parses UTM and Meta Click ID (fbclid) tracking parameters from URL search params
 */
export function getTrackingParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const tracking: Record<string, string> = {}
  
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid']
  keys.forEach((key) => {
    const val = params.get(key)
    if (val) tracking[key] = val
  })

  return tracking
}

/**
 * Retrieve waitlist entries from localStorage, seeding baseline if empty.
 * Normalizes any historical payloads if stored under legacy format.
 */
export function getStoredWaitlist(): WaitlistEntry[] {
  if (typeof window === 'undefined') return BASELINE_WAITLIST_ENTRIES

  try {
    const raw = localStorage.getItem(WAITLIST_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(BASELINE_WAITLIST_ENTRIES))
      return BASELINE_WAITLIST_ENTRIES
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(BASELINE_WAITLIST_ENTRIES))
      return BASELINE_WAITLIST_ENTRIES
    }

    // Merge baseline records with any newly stored records if not already present
    const existingIds = new Set(parsed.map((item: any) => item.id))
    const merged = [...parsed]
    BASELINE_WAITLIST_ENTRIES.forEach((baseline) => {
      if (!existingIds.has(baseline.id)) {
        merged.unshift(baseline)
      }
    })

    return merged.map(normalizeWaitlistEntry)
  } catch (err) {
    console.error('Error reading waitlist from localStorage:', err)
    return BASELINE_WAITLIST_ENTRIES
  }
}

/**
 * Normalizes legacy or raw web3forms payloads into clean WaitlistEntry
 */
export function normalizeWaitlistEntry(raw: any, index = 0): WaitlistEntry {
  const parentName = raw['Parent / Guardian Name'] || raw.parentName || 'Anonymous'
  const email = (raw['Email Address'] || raw.email || '').toLowerCase().trim()
  const phone = raw['Phone Number'] || raw.phone || 'Not provided'
  const ageGroup = raw['Child Age Group'] || raw.ageGroup || 'Ages 5–6'
  const groupPreference = raw['Group Preference'] || raw.groupPreference || (ageGroup === 'Ages 5–6' ? 'Co-ed' : 'Not provided')
  const daysAvailable = raw['Days That Could Work'] || raw.daysAvailable || 'Not provided'
  const neighbourhood = raw['Neighbourhood / Postal Area'] || raw.neighbourhood || 'Not provided'
  const childCount = raw['Number of Children Interested'] || raw['Number of Children'] || raw.childCount || '1'
  const isTest = Boolean(
    raw.isTest ||
    raw['Test Status'] === 'TEST' ||
    parentName.trim().toLowerCase() === 'dre' ||
    parentName.trim().toLowerCase().includes('test') ||
    email.includes('test@') ||
    email === 'ecohoopscoaching@gmail.com'
  )

  return {
    id: raw.id || `entry-${Date.now()}-${index}`,
    parentName,
    email,
    phone,
    ageGroup,
    groupPreference,
    daysAvailable,
    neighbourhood,
    childCount,
    programInterest: raw['Program Interest'] || raw.programInterest || 'Not Sure Yet',
    consent: raw.consent !== undefined ? Boolean(raw.consent) : true,
    submissionTime: raw['Submission Time'] || raw.submissionTime || new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }),
    source: raw['Campaign Source'] || raw.source || 'Website direct',
    utmParams: raw.utmParams || (raw['Meta Click ID (fbclid)'] ? { fbclid: raw['Meta Click ID (fbclid)'] } : undefined),
    isTest,
    uncertaintyFlag: raw.uncertaintyFlag || (isTest ? 'Test Submission (Excluded from leads)' : undefined),
  }
}

/**
 * Saves a new waitlist submission to localStorage
 */
export function saveWaitlistEntry(entry: WaitlistEntry): void {
  if (typeof window === 'undefined') return
  try {
    const list = getStoredWaitlist()
    list.push(entry)
    localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(list))
  } catch (err) {
    console.error('Error saving waitlist entry to localStorage:', err)
  }
}

/**
 * Calculates accurate metrics from waitlist records
 */
export function calculateWaitlistMetrics(entries: WaitlistEntry[]): WaitlistMetrics {
  const totalSubmissions = entries.length
  const testSubmissions = entries.filter((e) => e.isTest).length
  const realEntries = entries.filter((e) => !e.isTest)
  const realSubmissions = realEntries.length

  // Deduplicate real parent emails to calculate unique parent contacts
  const uniqueParents = new Set(realEntries.map((e) => e.email.toLowerCase().trim()).filter(Boolean))
  const uniqueParentContacts = uniqueParents.size

  // Calculate estimated children:
  // - Minimum assumes duplicate parent submissions represent an age correction (1 child)
  // - Maximum assumes duplicate parent submissions represent different siblings (2 children)
  // Plus childCount parsed values
  const estimatedChildrenMin = uniqueParentContacts
  const estimatedChildrenMax = realEntries.reduce((acc, curr) => {
    const count = parseInt(curr.childCount) || 1
    return acc + count
  }, 0)

  const divisionBreakdown = {
    'Ages 5–6': realEntries.filter((e) => e.ageGroup === 'Ages 5–6').length,
    'Ages 7–9': realEntries.filter((e) => e.ageGroup === 'Ages 7–9').length,
    'Ages 10–11': realEntries.filter((e) => e.ageGroup === 'Ages 10–11').length,
  }

  return {
    totalSubmissions,
    realSubmissions,
    uniqueParentContacts,
    estimatedChildrenMin,
    estimatedChildrenMax,
    paidRegistrations: 0, // Waitlist entries are distinct from paid registrations
    testSubmissions,
    divisionBreakdown,
  }
}

/**
 * Exports waitlist entries to a CSV file download
 */
export function exportWaitlistToCsv(entries: WaitlistEntry[]): void {
  if (typeof window === 'undefined') return

  const headers = [
    'Status',
    'Parent / Guardian Name',
    'Email Address',
    'Phone Number',
    'Age Group',
    'Group Preference',
    'Days That Could Work',
    'Neighbourhood / Postal Code',
    'Number of Children',
    'Program Interest',
    'Consent',
    'Submission Time',
    'Campaign Source',
    'Uncertainty / Notes',
  ]

  const rows = entries.map((entry) => [
    entry.isTest ? 'TEST' : 'REAL LEAD',
    `"${(entry.parentName || '').replace(/"/g, '""')}"`,
    `"${(entry.email || '').replace(/"/g, '""')}"`,
    `"${(entry.phone || 'Not provided').replace(/"/g, '""')}"`,
    `"${(entry.ageGroup || '').replace(/"/g, '""')}"`,
    `"${(entry.groupPreference || 'Not provided').replace(/"/g, '""')}"`,
    `"${(entry.daysAvailable || 'Not provided').replace(/"/g, '""')}"`,
    `"${(entry.neighbourhood || 'Not provided').replace(/"/g, '""')}"`,
    `"${(entry.childCount || '1').replace(/"/g, '""')}"`,
    `"${(entry.programInterest || 'Not provided').replace(/"/g, '""')}"`,
    entry.consent ? 'Yes' : 'No',
    `"${(entry.submissionTime || '').replace(/"/g, '""')}"`,
    `"${(entry.source || 'Direct').replace(/"/g, '""')}"`,
    `"${(entry.uncertaintyFlag || '').replace(/"/g, '""')}"`,
  ])

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute(
    'download',
    `ecohoops-jr-waitlist-${new Date().toISOString().split('T')[0]}.csv`
  )
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
