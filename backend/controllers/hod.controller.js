const Hod = require('../models/Hod.model');

function formatHod(hod) {
  return {
    id: hod._id,
    departmentId: hod.departmentId,
    departmentName: hod.departmentName,
    hodName: hod.hodName,
    designation: hod.designation,
    addressLine1: hod.addressLine1,
    addressLine2: hod.addressLine2,
    city: hod.city,
    district: hod.district,
    pincode: hod.pincode,
    phone: hod.phone,
    email: hod.email,
    isOnboarded: hod.isOnboarded,
  };
}

exports.getAllHods = async (_req, res) => {
  try {
    const hods = await Hod.find({}).sort({ departmentName: 1 }).lean();

    return res.json({
      success: true,
      data: hods.map(formatHod),
      total: hods.length,
    });
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch HOD records' });
  }
};

exports.getHodByDepartment = async (req, res) => {
  try {
    const hod = await Hod.findOne({ departmentId: req.params.departmentId }).lean();

    if (!hod) {
      return res.status(404).json({
        success: false,
        isOnboarded: false,
        message: 'HOD data has not been onboarded for this department yet',
      });
    }

    if (!hod.isOnboarded) {
      return res.json({
        success: true,
        isOnboarded: false,
        message: 'HOD data has not been onboarded for this department yet',
      });
    }

    return res.json({
      success: true,
      isOnboarded: true,
      data: formatHod(hod),
    });
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch department HOD data' });
  }
};

exports.getHodStatus = async (_req, res) => {
  try {
    const onboarded = await Hod.countDocuments({ isOnboarded: true });
    const pending = await Hod.countDocuments({ isOnboarded: false });

    return res.json({
      success: true,
      onboarded,
      pending,
      total: onboarded + pending,
    });
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch HOD onboarding status' });
  }
};
