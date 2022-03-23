import {PathUtils} from '../../src/Utils/PathUtils';

describe('PathUtils', () => {
  it('should indicates that two path are equal even if the case is not the same', () => {
    expect(PathUtils.pathsAreEqual('./test.hbs', './TEST.HBS', true)).toBeTruthy();
    expect(PathUtils.pathsAreEqual('./test.hbs', './test2.hbs')).toBeFalsy();
  });
});
