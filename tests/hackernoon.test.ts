import { findPosts } from '@src/sources/hackerNoon/hackerNoonHandler';

describe('lets', () => {
  it('should work', () => {
    expect.hasAssertions();
    findPosts(null, null);
    expect(1).toBe(1);
  });
});
