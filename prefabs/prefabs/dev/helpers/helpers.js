module.exports = {
  toPascalCase: function (str) {
    var firstReplate = str.replace(/(^(.)|[\W\_]+(.))/g, function (match, chr) {
      return chr.toUpperCase().replace(/[\W\_]/g, '');
    });
    return firstReplate.replace(/^([\W\_]?(.))/g, function (match) {
      return match.toUpperCase().replace(/[\W\_]/g, '');
    });
  },
  toCamelCase: function (str) {
    var firstReplate = str.replace(/(^(.)|[\W\_]+(.))/g, function (match) {
      return match.toUpperCase().replace(/[\W\_]/g, '');
    });
    return firstReplate.replace(/^([\W\_]?(.))/g, function (match) {
      return match.toLowerCase().replace(/[\W\_]/g, '');
    });
  },
  toSnakeCase: function (str) {
    var firstReplate = str.replace(/(^(.)|[\W\_]+(.))/g, function (match, chr) {
      return '_' + chr.toLowerCase().replace(/[\W\_]/g, '');
    });
    return firstReplate.replace(/^([\W\_]?(.))/g, function (match) {
      return match.toLowerCase().replace(/[\W\_]/g, '');
    });
  },
  toKebabCase: function (str) {
    var firstReplate = str.replace(/(^(.)|[\W\_]+(.))/g, function (match, chr) {
      return '-' + chr.toLowerCase().replace(/[\W\_]/g, '');
    });
    return firstReplate.replace(/^([\W\_]?(.))/g, function (match) {
      return match.toLowerCase().replace(/[\W\_]/g, '');
    });
  },
};
