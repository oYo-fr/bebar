const fs = require('fs');
const wipeDependencies = () => {
  const file = fs.readFileSync('package.json');
  const content = JSON.parse(file);
  for (const devDep in content.devDependencies) {
    if (content.devDependencies.hasOwnProperty(devDep)) {
      content.devDependencies[devDep] = '*';
    }
  }
  for (const dep in content.dependencies) {
    if (content.dependencies.hasOwnProperty(dep)) {
      content.dependencies[dep] = '*';
    }
  }
  fs.writeFileSync('package.json', JSON.stringify(content, null, 2));
};
if (require.main === module) {
  wipeDependencies();
} else {
  module.exports = wipeDependencies;
}
