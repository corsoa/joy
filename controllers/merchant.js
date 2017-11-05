/**
 * Friendly name for the MCC segment descriptions.
 */
exports.getMerchantCategories = ((req, res) => {
  res.send(req.mcc_cache);
});
module.exports = exports;
