module.exports = {
  jsonToObject: function(json) {
    const regex = /\/\/.*/g;
    try {
      return JSON.parse(json.replace(regex, ''));
    } catch (e) {
      return json;
    }
  },
  formatCssVar: function(property) {
    return '--vscode-' + property.replace(/\./, '-');
  },
};
