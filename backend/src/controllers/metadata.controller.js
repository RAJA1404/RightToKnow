const Category = require('../models/Category');
const Department = require('../models/Department');
const SampleQuestion = require('../models/SampleQuestion');

exports.getDepartments = async (_req, res) => {
  try {
    const departments = await Department.find({}, { name: 1, keywords: 1 }).sort({ name: 1 }).lean();
    return res.json(departments);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

exports.getCategories = async (_req, res) => {
  try {
    const categories = await Category.find({}, { name: 1 }).sort({ name: 1 }).lean();
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

exports.getSampleQuestions = async (_req, res) => {
  try {
    const samples = await SampleQuestion.find({}, { category: 1, question: 1 }).sort({ category: 1, question: 1 }).lean();
    return res.json(samples);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch sample questions' });
  }
};
