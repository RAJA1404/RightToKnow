const crypto = require('crypto');
const RTIRequest = require('../models/RtiRequest');
const smartRtiService = require('../services/smartRti.service');

function generateApplicationId() {
  return `SRTI-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
}

exports.generate = async (req, res) => {
  try {
    const { inputText, location = '' } = req.body;

    if (!inputText || !inputText.trim()) {
      return res.status(400).json({ error: 'inputText is required' });
    }

    const validation = smartRtiService.validateInput(inputText, location);
    const matchResult = await smartRtiService.matchDepartments(inputText, location);
    const topDepartment = matchResult.departments?.[0] || {
      name: 'General Administration Department',
      matchedKeywords: [],
    };
    const generatedDraft = smartRtiService.generateDraft(inputText, topDepartment.name);
    const locationSuggestion = matchResult.detectedLocation ? '' : 'Please add district or area for better processing';

    return res.json({
      departments: matchResult.departments || [],
      department: topDepartment.name,
      matchedKeywords: topDepartment.matchedKeywords || [],
      generatedDraft,
      score: validation.score,
      suggestions: validation.suggestions,
      detectedLocation: matchResult.detectedLocation,
      locationSuggestion,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate RTI draft' });
  }
};

exports.submit = async (req, res) => {
  try {
    const { inputText, department, matchedKeywords, generatedDraft, score, suggestions, formData } = req.body;

    if (!inputText || !department || !generatedDraft) {
      return res.status(400).json({ error: 'inputText, department, and generatedDraft are required' });
    }

    const request = await RTIRequest.create({
      applicationId: generateApplicationId(),
      inputText: inputText.trim(),
      department: department.trim(),
      matchedKeywords: Array.isArray(matchedKeywords) ? matchedKeywords : [],
      generatedDraft: generatedDraft.trim(),
      score: Number.isFinite(Number(score)) ? Number(score) : 0,
      suggestions: Array.isArray(suggestions) ? suggestions : [],
      timeline: [
        {
          step: 'Application Submitted',
          date: new Date(),
          note: 'Acknowledgement generated and request stored successfully.',
        },
      ],
      formData: formData && typeof formData === 'object' ? formData : null,
      submittedBy: req.user?._id || null,
    });

    return res.status(201).json({
      message: 'RTI request submitted successfully',
      applicationId: request.applicationId,
      status: request.status,
      createdAt: request.createdAt,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to submit RTI request' });
  }
};
