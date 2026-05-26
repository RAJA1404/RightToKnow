const districtData = require('../data/districts.json');

exports.getDistricts = (_req, res) => {
  const districts = districtData.map((item) => item.district).sort((a, b) => a.localeCompare(b));
  return res.json(districts);
};

exports.getTaluks = (req, res) => {
  const districtName = String(req.query.district || '').trim().toLowerCase();

  if (!districtName) {
    return res.status(400).json({ error: 'district query parameter is required' });
  }

  const district = districtData.find((item) => item.district.toLowerCase() === districtName);
  if (!district) {
    return res.json([]);
  }

  return res.json(district.taluks.map((item) => item.name));
};

exports.getVillages = (req, res) => {
  const districtName = String(req.query.district || '').trim().toLowerCase();
  const talukName = String(req.query.taluk || '').trim().toLowerCase();

  if (!districtName || !talukName) {
    return res.status(400).json({ error: 'district and taluk query parameters are required' });
  }

  const district = districtData.find((item) => item.district.toLowerCase() === districtName);
  if (!district) {
    return res.json([]);
  }

  const taluk = district.taluks.find((item) => item.name.toLowerCase() === talukName);
  if (!taluk) {
    return res.json([]);
  }

  return res.json(taluk.villages);
};
