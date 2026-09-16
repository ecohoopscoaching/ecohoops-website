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

// Clean baseline — 0 fake records. Real submissions will populate here as parents register.
export const BASELINE_WAITLIST_ENTRIES: WaitlistEntry[] = []

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
 * Retrieve waitlist entries from localStorage.
 * Automatically purges any legacy fake mock records so testing begins with a clean slate.
 */
export function getStoredWaitlist(): WaitlistEntry[] {
  if (typeof window === 'undefined') return []

  try {
    // One-time automatic purge of legacy fake mock records
    const cleanMigrationKey = 'ecohoops_waitlist_cleaned_v3'
    if (!localStorage.getItem(cleanMigrationKey)) {
      localStorage.removeItem(WAITLIST_STORAGE_KEY)
      localStorage.setItem(cleanMigrationKey, 'true')
      return []
    }

    const raw = localStorage.getItem(WAITLIST_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    // Filter out any lingering legacy fake baseline entries
    const filtered = parsed.filter((item: any) => {
      const isFake = (
        !item.id ||
        item.id.startsWith('base-lead-') ||
        item.id === 'base-test-dre' ||
        item.email === 'parent1@example.com' ||
        item.email === 'parent2-multichild@example.com' ||
        item.email === 'parent3@example.com'
      )
      return !isFake
    })

    return filtered.map(normalizeWaitlistEntry)
  } catch (err) {
    console.error('Error reading waitlist from localStorage:', err)
    return []
  }
}

/**
 * Completely clears all waitlist records from localStorage
 */
export function clearStoredWaitlist(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify([]))
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
