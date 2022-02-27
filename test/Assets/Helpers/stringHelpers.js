module.exports = {
  bold: function(text) {
    const Handlebars = require('handlebars');
    const result = '**' + Handlebars.escapeExpression(text) + '**';
    return new Handlebars.SafeString(result);
  },
  toPascalCase: function(str) {
    const firstReplate = str.replace(/(^(.)|[\W\_]+(.))/g,
        function(match, chr) {
          return chr.toUpperCase().replace(/[\W\_]/g, '');
        });
    return firstReplate.replace(/^([\W\_]?(.))/g, function(match) {
      return match.toUpperCase().replace(/[\W\_]/g, '');
    });
  },
  toCamelCase: function(str) {
    const firstReplate = str.replace(/(^(.)|[\W\_]+(.))/g, function(match) {
      return match.toUpperCase().replace(/[\W\_]/g, '');
    });
    return firstReplate.replace(/^([\W\_]?(.))/g, function(match) {
      return match.toLowerCase().replace(/[\W\_]/g, '');
    });
  },
  toSnakeCase: function(str) {
    const firstReplate = str.replace(/(^(.)|[\W\_]+(.))/g,
        function(match, chr) {
          return '_' + chr.toLowerCase().replace(/[\W\_]/g, '');
        });
    return firstReplate.replace(/^([\W\_]?(.))/g, function(match) {
      return match.toLowerCase().replace(/[\W\_]/g, '');
    });
  },
  toKebabCase: function(str) {
    const firstReplate = str.replace(/(^(.)|[\W\_]+(.))/g,
        function(match, chr) {
          return '-' + chr.toLowerCase().replace(/[\W\_]/g, '');
        });
    return firstReplate.replace(/^([\W\_]?(.))/g, function(match) {
      return match.toLowerCase().replace(/[\W\_]/g, '');
    });
  },
};
