const districtTalukBlockMap = require('./districtTalukBlockMap');

function getVillagesForTaluk(district, taluk, allVillages) {
  const blocks = (districtTalukBlockMap[district] || {})[taluk] || [];
  return allVillages.filter(v =>
    v.district === district && blocks.includes(v.block)
  );
}

function validateAllMappings(allVillages) {
  const errors = [];
  allVillages.forEach(v => {
    const blocks = (districtTalukBlockMap[v.district] || {})[v.taluk] || [];
    if (!blocks.includes(v.block)) {
      errors.push({
        type: 'wrong_block_for_taluk',
        district: v.district,
        taluk: v.taluk,
        block: v.block,
        village: v.village,
      });
    }
  });
  console.table(errors);
  return errors;
}

module.exports = {
  districtTalukBlockMap,
  getVillagesForTaluk,
  validateAllMappings,
};
