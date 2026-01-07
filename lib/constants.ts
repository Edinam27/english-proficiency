export const PROGRAMMES = [
  'Philosophy in Accounting',
  'Philosophy in Leadership',
  'Philosophy in Finance',
  'Philosophy in Media & Digital Communication Management',
  'Philosophy in Information Systems',
  'Philosophy in Management',
  'Business Administration in Accounting and Finance',
  'Business Administration in Auditing',
  'Business Administration in Corporate Governance',
  'Business Administration in Corporate Communications',
  'Business Administration in Marketing',
  'Business Administration in Internal Auditing',
  'Business Administration in Petroleum Accounting & Finance',
  'Business Administration in Total Quality Management (TQM)',
  'Business Administration in Impact Entrepreneurship and Innovation',
  'Business Administration in Assets and Wealth Management',
  'Business Administration in Business Management',
  'Business Administration in Management Information Systems',
  'Science in Procurement Management',
  'Science in Pensions Management',
  'Science in Leadership',
  'Science in Insurance Risk Management',
  'Science in Information Systems',
  'Science in Information Security Management',
  'Arts in Peace, Security and Intelligence Management',
  'Arts in Brands and Communications Management',
  'Arts in Media & Digital Communication Management',
  'Arts in Digital and Strategic Marketing Management',
  'Laws (LLM) in Competition and Consumer Protection Law',
  'Laws (LLM) in International Business And Commercial Law',
  'Laws (LLM) in Natural Resources and Climate Change Law',
];

export const getProgrammeDuration = (programme: string): number => {
  const lower = programme.toLowerCase();
  // MBA (Business Administration) and MPHIL (Philosophy) are 2 years
  if (lower.includes('philosophy') || lower.includes('business administration')) {
    return 2;
  }
  // LLM, MA (Arts), MSc (Science) are 1 year
  if (lower.includes('laws') || lower.includes('arts') || lower.includes('science')) {
    return 1;
  }
  // Default to 1 year if unknown, or keep previous default
  return 1;
};

export const SIGNATORIES = [
  { 
    id: 'DENIS_ATTUQUAYEFIO', 
    name: 'Denis Attuquayefio', 
    title: 'Ag. Deputy Director of Academic Affairs',
    for: 'For: Director of Academics Affairs'
  },
  { 
    id: 'ANTHONY_AFEADIE', 
    name: 'Anthony Afeadie', 
    title: 'Director of Academics Affairs',
    for: '' 
  },
  {
    id: 'LETICIA_AKYEAMPONG',
    name: 'Leticia Akyeampong, PhD',
    title: 'Deputy Director, Administration',
    for: 'For: REGISTRAR'
  }
];
