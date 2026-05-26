const Department = require('../models/Department');
const SecretariatDepartment = require('../models/SecretariatDepartment');
const Hod = require('../models/Hod');
const SubOffice = require('../models/SubOffice');
const PublicAuthority = require('../models/PublicAuthority');
const { normalizeDepartmentName } = require('../utils/departmentKeywords');

function formatAddress(parts = []) {
  return parts
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .join(', ');
}

function parsePublicAuthorityEntry(value = '') {
  const raw = String(value || '')
    .replace(/\r/g, '')
    .trim();

  if (!raw) {
    return {
      name: '',
      address: '',
    };
  }

  const lineParts = raw
    .split('\n')
    .map((part) => part.trim())
    .filter(Boolean);

  if (lineParts.length > 1) {
    return {
      name: lineParts[0],
      address: lineParts.slice(1).join('\n'),
    };
  }

  const commaParts = raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (commaParts.length >= 2) {
    return {
      name: commaParts[0],
      address: commaParts.slice(1).join('\n'),
    };
  }

  return {
    name: raw,
    address: '',
  };
}

exports.getDepartments = async (_req, res) => {
  try {
    const secretariatDepartments = await SecretariatDepartment.find(
      { isActive: true },
      { name: 1, created_at: 1 }
    )
      .sort({ hodName: 1 })
      .lean();

    if (secretariatDepartments.length > 0) {
      const departmentIds = secretariatDepartments.map((item) => item._id);
      const hodCounts = await Hod.aggregate([
        { $match: { departmentId: { $in: departmentIds.map(String) }, isOnboarded: true } },
        { $group: { _id: '$departmentId', count: { $sum: 1 } } },
      ]);
      const countMap = new Map(hodCounts.map((item) => [String(item._id), item.count]));

      return res.json({
        success: true,
        data: secretariatDepartments.map((item) => ({
          id: item._id,
          name: item.name,
          category: 'Secretariat Department',
          hasSubOffices: (countMap.get(String(item._id)) || 0) > 0,
        })),
        total: secretariatDepartments.length,
      });
    }

    const departments = await Department.find({}, { name: 1, normalizedName: 1, keywords: 1, category: 1 })
      .sort({ name: 1 })
      .lean();

    const publicAuthorities = await PublicAuthority.find({}, { normalizedDepartmentName: 1 }).lean();
    const authorityNames = new Set(publicAuthorities.map((item) => item.normalizedDepartmentName));

    return res.json({
      success: true,
      data: departments.map((item) => ({
        id: item._id,
        name: item.name,
        category: item.category,
        keywords: item.keywords,
        hasSubOffices: authorityNames.has(item.normalizedName),
      })),
      total: departments.length,
    });
  } catch (_error) {
    return res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

exports.getDepartmentHods = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id, { name: 1, normalizedName: 1 }).lean();
    const hods = await Hod.find(
      { departmentId: req.params.id, isOnboarded: true },
      { hodName: 1, addressLine1: 1, addressLine2: 1, city: 1, pincode: 1 }
    )
      .sort({ name: 1 })
      .lean();

    const hodIds = hods.map((item) => item._id);
    const subOfficeCounts = await SubOffice.aggregate([
      { $match: { hodId: { $in: hodIds }, isActive: true } },
      { $group: { _id: '$hodId', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(subOfficeCounts.map((item) => [String(item._id), item.count]));

    if (hods.length > 0) {
      return res.json({
        success: true,
        data: hods.map((item) => ({
          id: item._id,
          name: item.hodName,
          address: formatAddress([item.addressLine1, item.addressLine2, item.city, item.pincode]),
          hasSubOffices: (countMap.get(String(item._id)) || 0) > 0,
        })),
        total: hods.length,
      });
    }

    if (department) {
      const authority = await PublicAuthority.findOne({
        normalizedDepartmentName: normalizeDepartmentName(department.name),
      }).lean();

      if (authority) {
        const rows = (authority.publicAuthorities || []).map((entry, index) => {
          const parsed = parsePublicAuthorityEntry(entry);

          return {
            id: `${authority._id}:${index + 1}`,
            name: parsed.name,
            address: parsed.address,
            hasSubOffices: false,
          };
        });

        return res.json({
          success: true,
          data: rows,
          total: rows.length,
        });
      }
    }

    return res.json({
      success: true,
      data: [],
      total: 0,
    });
  } catch (_error) {
    return res.status(500).json({ error: 'Failed to fetch HODs' });
  }
};

exports.getHodSubOffices = async (req, res) => {
  try {
    const subOffices = await SubOffice.find(
      { hodId: req.params.id, isActive: true },
      { name: 1, address: 1, pincode: 1, hasSubOffices: 1 }
    )
      .sort({ name: 1 })
      .lean();

    return res.json({
      success: true,
      data: subOffices.map((item) => ({
        id: item._id,
        name: item.name,
        address: formatAddress([item.address, item.pincode]),
        hasSubOffices: Boolean(item.hasSubOffices),
      })),
      total: subOffices.length,
    });
  } catch (_error) {
    return res.status(500).json({ error: 'Failed to fetch sub offices' });
  }
};

exports.getPublicAuthorities = async (_req, res) => {
  try {
    const authorities = await PublicAuthority.find(
      {},
      { departmentName: 1, publicAuthorities: 1, source: 1 }
    )
      .sort({ departmentName: 1 })
      .lean();

    return res.json(authorities);
  } catch (_error) {
    return res.status(500).json({ error: 'Failed to fetch public authorities' });
  }
};

exports.getPublicAuthorityHods = async (req, res) => {
  try {
    const authority = await PublicAuthority.findById(req.params.id).lean();

    if (!authority) {
      return res.status(404).json({ success: false, error: 'Public authority not found' });
    }

    const rows = (authority.publicAuthorities || []).map((entry, index) => {
      const parsed = parsePublicAuthorityEntry(entry);

      return {
        id: `${authority._id}:${index + 1}`,
        name: parsed.name,
        address: parsed.address,
        hasSubOffices: false,
      };
    });

    return res.json({
      success: true,
      data: rows,
      total: rows.length,
    });
  } catch (_error) {
    return res.status(500).json({ error: 'Failed to fetch public authority HODs' });
  }
};
