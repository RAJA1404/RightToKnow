const DEPARTMENT_SYNONYMS = {
  'Adi Dravidar and Tribal Welfare Department': ['scheduled caste', 'tribal', 'tribe', 'hostel', 'scholarship'],
  'Agriculture and Farmers Welfare Department': ['agriculture', 'farmer', 'crop', 'cultivation', 'seed', 'fertilizer'],
  'Animal Husbandry, Dairy and Fisheries Department': ['animal', 'livestock', 'dairy', 'milk', 'fishery', 'fisheries', 'poultry'],
  'Backward Classes and Minorities Welfare Department': ['backward class', 'minority', 'community certificate', 'scholarship', 'welfare'],
  'Commercial Taxes and Registration Department': ['tax', 'gst', 'registration', 'property registration', 'stamp duty'],
  'Cooperation, Food and Consumer Protection Department': ['ration', 'consumer', 'food supply', 'cooperative', 'civil supplies'],
  'Energy Department': ['electricity', 'power', 'eb', 'tneb', 'current', 'transformer'],
  'Environment and Forest Department': ['environment', 'forest', 'pollution', 'wildlife', 'tree'],
  'Finance Department': ['budget', 'finance', 'fund allocation', 'expenditure', 'treasury'],
  'Handlooms and Textiles Department': ['handloom', 'textile', 'weaver', 'loom', 'garment'],
  'Health and Family Welfare Department': ['health', 'hospital', 'doctor', 'medical', 'clinic', 'ambulance'],
  'Higher Education Department': ['college', 'university', 'higher education', 'degree', 'scholarship'],
  'Highways and Minor Ports Department': ['highway', 'road', 'bridge', 'minor port', 'toll', 'construction'],
  'Home Department': ['police', 'law and order', 'prison', 'security', 'crime'],
  'Housing and Urban Development Department': ['housing', 'urban', 'layout', 'planning permission', 'tnhdb'],
  'Human Resources Management Department': ['service register', 'government staff', 'transfer', 'posting', 'establishment'],
  'Industries Department': ['industry', 'factory', 'industrial estate', 'sipcot', 'manufacturing'],
  'Information Technology Department': ['it', 'technology', 'software', 'internet', 'digital service'],
  'Labour Welfare Department': ['labour', 'worker', 'wages', 'employment', 'factory labour'],
  'Law Department': ['law', 'legal opinion', 'advocate', 'litigation', 'gazette'],
  'Legislative Assembly Department': ['assembly', 'mla', 'question', 'legislative', 'house proceedings'],
  'Micro, Small and Medium Enterprises Department': ['msme', 'small business', 'entrepreneur', 'subsidy', 'enterprise'],
  'Municipal Administration and Water Supply': ['municipality', 'corporation', 'drainage', 'drinking water', 'sewage'],
  'Natural Resources Department': ['mineral', 'sand', 'natural resource', 'quarry', 'resource'],
  'Planning and Development Department': ['planning', 'development', 'scheme', 'policy', 'target'],
  'Prohibition and Excise Department': ['liquor', 'tasmac', 'excise', 'prohibition', 'bar license'],
  'Public Department': ['government order', 'protocol', 'public department', 'secretariat'],
  'Public Works Department': ['public works', 'pwd', 'building', 'canal', 'construction', 'maintenance'],
  'Revenue and Disaster Management Department': ['revenue', 'patta', 'land record', 'disaster', 'flood relief'],
  'Rural Development Department': ['panchayat', 'rural road', 'village', 'mnrega', 'rural development'],
  'School Education Department': ['school', 'teacher', 'student', 'education', 'textbook'],
  'Social Reforms Department': ['social reform', 'awareness', 'campaign', 'equality'],
  'Social Welfare Department': ['women welfare', 'child welfare', 'anganwadi', 'nutrition', 'welfare'],
  'Special Programmes Implementation Department': ['implementation', 'special programme', 'monitoring', 'flagship scheme'],
  'Tamil Development Department': ['tamil', 'language', 'literature', 'translation', 'classical tamil'],
  'Tourism and Culture Department': ['tourism', 'museum', 'temple festival', 'heritage', 'culture'],
  'Transport Department': ['transport', 'bus', 'permit', 'driving licence', 'vehicle'],
  'Water Resources Department': ['water', 'dam', 'river', 'reservoir', 'irrigation'],
  'Welfare of Differently Abled Persons Department': ['differently abled', 'disability', 'accessible', 'assistive device', 'pension'],
  'Youth Welfare and Sports Development Department': ['sports', 'stadium', 'coach', 'youth', 'tournament'],
};

const STOP_WORDS = new Set(['and', 'of', 'the', 'department', 'welfare']);

function normalizeDepartmentName(name = '') {
  return name.trim().toLowerCase().replace(/[^\w\s,&-]/g, '').replace(/\s+/g, ' ');
}

function splitNameTokens(name = '') {
  return normalizeDepartmentName(name)
    .split(/[\s,&-]+/)
    .map((token) => token.trim())
    .filter((token) => token && !STOP_WORDS.has(token));
}

function buildDepartmentKeywords(name, category = '') {
  const baseTokens = splitNameTokens(name);
  const categoryTokens = splitNameTokens(category);
  const manualKeywords = DEPARTMENT_SYNONYMS[name] || [];

  return [...new Set([...baseTokens, ...categoryTokens, ...manualKeywords.map((keyword) => keyword.toLowerCase())])];
}

function buildDepartmentCode(name = '') {
  const tokens = splitNameTokens(name);
  if (!tokens.length) return 'DEPT';

  const acronym = tokens.map((token) => token[0].toUpperCase()).join('');
  const normalized = normalizeDepartmentName(name);
  const hash = normalized
    .split('')
    .reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0)
    .toString(36)
    .toUpperCase();

  return `${acronym.slice(0, 8)}-${hash.slice(-4)}`;
}

module.exports = {
  buildDepartmentCode,
  buildDepartmentKeywords,
  normalizeDepartmentName,
  splitNameTokens,
};
