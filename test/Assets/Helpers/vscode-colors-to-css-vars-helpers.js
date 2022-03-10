module.exports = {
  jsonToObject: function(json) {
    const regex = /\/\/.*/g;
    return JSON.parse(json.replace(regex, ''));
  },
  formatCssVar: function(property) {
    return '--' + property.replace(/\./, '--');
  },
};
