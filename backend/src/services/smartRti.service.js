const Department = require('../models/Department');
const { normalizeDepartmentName, splitNameTokens } = require('../utils/departmentKeywords');

const DEFAULT_DEPARTMENT = 'General Administration Department';
const QUERY_SPLIT_REGEX = /[\n?]+/;
const DISTRICT_LIST = ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy'];

class SmartRtiService {
  extractLocation(inputText = '', location = '') {
    const explicitLocation = String(location).trim();
    if (explicitLocation) {
      return explicitLocation;
    }

    const normalizedInput = normalizeDepartmentName(inputText);
    const matchedDistrict = DISTRICT_LIST.find((district) =>
      normalizedInput.includes(normalizeDepartmentName(district))
    );

    return matchedDistrict || '';
  }

  async matchDepartments(inputText, location = '') {
    const normalizedInput = normalizeDepartmentName(inputText || '');
    const detectedLocation = this.extractLocation(inputText, location);

    if (!normalizedInput) {
      return {
        departments: [
          {
            name: DEFAULT_DEPARTMENT,
            matchedKeywords: [],
            score: 0,
            confidence: 30,
            message: 'Unable to find exact match. Please refine your query.',
          },
        ],
        detectedLocation,
      };
    }

    const inputTokens = new Set(splitNameTokens(normalizedInput));
    const departments = await Department.find({}, { name: 1, normalizedName: 1, keywords: 1 }).lean();
    const rankedMatches = [];

    for (const department of departments) {
      const currentMatches = [];
      const departmentName = department.normalizedName || normalizeDepartmentName(department.name);
      const departmentTokens = splitNameTokens(departmentName);

      if (normalizedInput.includes(departmentName)) {
        currentMatches.push(department.name.toLowerCase());
      }

      for (const token of departmentTokens) {
        if (inputTokens.has(token)) {
          currentMatches.push(token);
        }
      }

      for (const keyword of department.keywords || []) {
        const normalizedKeyword = normalizeDepartmentName(keyword);
        if (!normalizedKeyword) continue;

        const isPhrase = normalizedKeyword.includes(' ');
        const isMatch = isPhrase
          ? normalizedInput.includes(normalizedKeyword)
          : inputTokens.has(normalizedKeyword) || normalizedInput.includes(normalizedKeyword);

        if (isMatch) {
          currentMatches.push(normalizedKeyword);
        }
      }

      const uniqueMatches = [...new Set(currentMatches)];
      const score = uniqueMatches.length;
      if (score === 0) continue;

      rankedMatches.push({
        name: department.name,
        matchedKeywords: uniqueMatches,
        score,
      });
    }

    if (rankedMatches.length === 0) {
      return {
        departments: [
          {
            name: DEFAULT_DEPARTMENT,
            matchedKeywords: [],
            score: 0,
            confidence: 30,
            message: 'Unable to find exact match. Please refine your query.',
          },
        ],
        detectedLocation,
      };
    }

    rankedMatches.sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.name.localeCompare(right.name);
    });

    const strongestScore = rankedMatches[0].score || 1;
    const topDepartments = rankedMatches.slice(0, 3).map((departmentMatch) => ({
      ...departmentMatch,
      confidence: Math.round((departmentMatch.score / strongestScore) * 100),
    }));

    return {
      departments: topDepartments,
      detectedLocation,
    };
  }

  async matchDepartment(inputText, location = '') {
    const result = await this.matchDepartments(inputText, location);
    const [topMatch] = result.departments;

    return {
      department: topMatch?.name || DEFAULT_DEPARTMENT,
      matchedKeywords: topMatch?.matchedKeywords || [],
      detectedLocation: result.detectedLocation,
    };
  }

  generateDraft(inputText, department) {
    const cleanInput = (inputText || '').trim();
    const queries = cleanInput
      .split(QUERY_SPLIT_REGEX)
      .map((item) => item.trim())
      .filter(Boolean);

    const numberedQuestions = (queries.length ? queries : [cleanInput]).map(
      (question, index) => `${index + 1}. ${question.replace(/\.$/, '')}`
    );

    return [
      'To,',
      'The Public Information Officer,',
      `${department || DEFAULT_DEPARTMENT}`,
      '',
      'Subject: Request for information under the Right to Information Act, 2005',
      '',
      'Respected Sir/Madam,',
      '',
      'Kindly provide the following information under the Right to Information Act, 2005:',
      '',
      ...numberedQuestions,
      '',
      'I request that the information be provided within the prescribed time limit.',
      '',
      'Yours faithfully,',
      'Applicant',
    ].join('\n');
  }

  validateInput(inputText, location = '') {
    const normalizedInput = (inputText || '').trim();
    if (!normalizedInput) {
      return {
        score: 0,
        suggestions: ['Enter the information request in plain language before generating a draft.'],
      };
    }

    let score = 0;
    const suggestions = [];
    const lowerInput = normalizedInput.toLowerCase();

    if (normalizedInput.length >= 180) {
      score += 4;
    } else if (normalizedInput.length >= 80) {
      score += 3;
    } else if (normalizedInput.length >= 40) {
      score += 2;
    } else {
      suggestions.push('Add more factual detail so the request is easier to process.');
    }

    if (/\b(19|20)\d{2}\b|\bjan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/i.test(normalizedInput)) {
      score += 2;
    } else {
      suggestions.push('Mention a year, date range, or relevant period if the request relates to past records.');
    }

    const specificityKeywords = ['copy', 'report', 'file', 'order', 'letter', 'document', 'tender', 'inspection'];
    const specificityHits = specificityKeywords.filter((keyword) => lowerInput.includes(keyword)).length;
    if (specificityHits >= 2) {
      score += 3;
    } else if (specificityHits === 1) {
      score += 2;
    } else {
      suggestions.push('Ask for specific records such as copies, reports, orders, files, or inspection details.');
    }

    const vagueTerms = ['details', 'everything', 'all information', 'all details', 'whatever', 'full details'];
    if (vagueTerms.some((term) => lowerInput.includes(term))) {
      score = Math.max(0, score - 2);
      suggestions.push('Replace vague phrases with the exact records or facts you need.');
    } else {
      score += 1;
    }

    if (!this.extractLocation(inputText, location)) {
      suggestions.push('Please add district or area for better processing.');
    } else {
      score += 1;
    }

    return {
      score: Math.min(10, Math.max(0, Math.round(score))),
      suggestions,
    };
  }
}

module.exports = new SmartRtiService();
