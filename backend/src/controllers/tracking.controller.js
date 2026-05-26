const RTIRequest = require('../models/RtiRequest');

const STATUS_MESSAGES = {
  Submitted: 'Your request has been received and is awaiting departmental review.',
  Processing: 'Your request is currently under review by the designated public authority.',
  Completed: 'Your request has been completed and the final response is ready.',
};

function calculateExpectedDate(createdAt) {
  if (!createdAt) return null;

  const expectedDate = new Date(createdAt);
  expectedDate.setDate(expectedDate.getDate() + 30);
  return expectedDate;
}

function normalizeTimelineEntry(entry) {
  return {
    step: entry.step,
    date: entry.date,
    note: entry.note || '',
  };
}

function buildTimeline(request) {
  if (Array.isArray(request.timeline) && request.timeline.length > 0) {
    return request.timeline.map(normalizeTimelineEntry);
  }

  const timeline = [
    {
      step: 'Application Submitted',
      date: request.createdAt,
      note: 'Acknowledgement generated and request stored successfully.',
    },
  ];

  if (request.status === 'Processing') {
    timeline.push({
      step: 'Processing by Department',
      date: request.updatedAt,
      note: 'Assigned to the relevant public authority for review.',
    });
  }

  if (request.status === 'Completed') {
    timeline.push({
      step: 'Processing by Department',
      date: request.updatedAt,
      note: 'Department review completed and response prepared.',
    });
    timeline.push({
      step: 'Final Decision',
      date: request.updatedAt,
      note: 'Final response has been recorded for this application.',
    });
  }

  return timeline;
}

exports.getByApplicationId = async (req, res) => {
  try {
    const request = await RTIRequest.findOne({ applicationId: req.params.id.trim() }).lean();

    if (!request) {
      return res.status(404).json({ error: 'RTI request not found' });
    }

    const timeline = buildTimeline(request);
    const expectedDate = calculateExpectedDate(request.createdAt);

    return res.json({
      id: request.applicationId,
      applicationId: request.applicationId,
      status: request.status,
      department: request.department,
      createdAt: request.createdAt,
      expectedDate,
      statusMessage: STATUS_MESSAGES[request.status] || STATUS_MESSAGES.Submitted,
      timeline,
      generatedDraft: request.generatedDraft,
      matchedKeywords: request.matchedKeywords,
      score: request.score,
      suggestions: request.suggestions,
      formData: request.formData,
    });
  } catch (_error) {
    return res.status(500).json({ error: 'Failed to fetch RTI request' });
  }
};
