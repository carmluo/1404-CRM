import { differenceInDays, parseISO } from 'date-fns'

export const opportunityKeywords = {
  stalled: (opp) => opp.status === 'no-activity',
  'no activity': (opp) => opp.status === 'no-activity',
  overdue: (opp) => opp.status === 'overdue',
  'at risk': (opp) => opp.status === 'overdue' || opp.status === 'no-activity',
  qualifying: (opp) => opp.stage === 'Qualifying',
  'needs analysis': (opp) => opp.stage === 'Needs Analysis',
  'estimate prep': (opp) => opp.stage === 'Estimate Prep',
  'estimate submitted': (opp) => opp.stage === 'Estimate Submitted',
  negotiation: (opp) => opp.stage === 'Negotiation',
  'verbal commit': (opp) => opp.stage === 'Verbal Commit',
  large: (opp) => opp.amount >= 500000,
  small: (opp) => opp.amount < 200000,
  'high value': (opp) => opp.amount >= 500000,
  lowes: (opp) => opp.account.toLowerCase().includes("lowe"),
  target: (opp) => opp.account.toLowerCase().includes("target"),
  depot: (opp) => opp.account.toLowerCase().includes("depot"),
  kitchen: (opp) => opp.title.toLowerCase().includes("kitchen"),
  bathroom: (opp) => opp.title.toLowerCase().includes("bathroom"),
  flooring: (opp) => opp.title.toLowerCase().includes("flooring"),
  hvac: (opp) => opp.title.toLowerCase().includes("hvac"),
  lighting: (opp) => opp.title.toLowerCase().includes("lighting"),
}

export const accountKeywords = {
  'low activity': (acc) => {
    if (!acc.lastActivity) return true
    const days = differenceInDays(new Date(), parseISO(acc.lastActivity))
    return days > 30
  },
  inactive: (acc) => acc.status === 'Inactive',
  active: (acc) => acc.status === 'Active',
  prospect: (acc) => acc.type === 'Prospect',
  customer: (acc) => acc.type === 'Customer',
  'high revenue': (acc) => acc.annualRevenue > 50000000000,
  retail: (acc) => acc.industry?.toLowerCase().includes('retail'),
  hardware: (acc) => acc.industry?.toLowerCase().includes('hardware'),
  furniture: (acc) => acc.industry?.toLowerCase().includes('furniture'),
}

export const contactKeywords = {
  unresponsive: (contact) => contact.engagement === 'Weak',
  weak: (contact) => contact.engagement === 'Weak',
  moderate: (contact) => contact.engagement === 'Moderate',
  responsive: (contact) => contact.engagement === 'Responsive',
  recent: (contact) => {
    if (!contact.lastContacted) return false
    const days = differenceInDays(new Date(), parseISO(contact.lastContacted))
    return days <= 7
  },
  'email preferred': (contact) => contact.preferredCommunication === 'Email',
  'phone preferred': (contact) => contact.preferredCommunication === 'Phone',
  'low engagement': (contact) => contact.engagement === 'Weak',
  'high engagement': (contact) => contact.engagement === 'Responsive',
}

export function nlSearchOpportunities(opportunities, query) {
  if (!query || query.trim() === '') return opportunities
  const q = query.toLowerCase().trim()

  // Check keyword map
  for (const [keyword, filterFn] of Object.entries(opportunityKeywords)) {
    if (q.includes(keyword)) {
      return opportunities.filter(filterFn)
    }
  }

  // Fallback: search by title, account, contact, stage
  return opportunities.filter(opp =>
    opp.title.toLowerCase().includes(q) ||
    opp.account.toLowerCase().includes(q) ||
    opp.contact.toLowerCase().includes(q) ||
    opp.stage.toLowerCase().includes(q)
  )
}

export function nlSearchAccounts(accounts, query) {
  if (!query || query.trim() === '') return accounts
  const q = query.toLowerCase().trim()

  for (const [keyword, filterFn] of Object.entries(accountKeywords)) {
    if (q.includes(keyword)) {
      return accounts.filter(filterFn)
    }
  }

  return accounts.filter(acc =>
    acc.name.toLowerCase().includes(q) ||
    acc.industry?.toLowerCase().includes(q) ||
    acc.type?.toLowerCase().includes(q)
  )
}

export function nlSearchContacts(contacts, query) {
  if (!query || query.trim() === '') return contacts
  const q = query.toLowerCase().trim()

  for (const [keyword, filterFn] of Object.entries(contactKeywords)) {
    if (q.includes(keyword)) {
      return contacts.filter(filterFn)
    }
  }

  return contacts.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.title.toLowerCase().includes(q) ||
    c.account.toLowerCase().includes(q) ||
    c.location?.toLowerCase().includes(q)
  )
}
