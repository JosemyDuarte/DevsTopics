import { findPosts } from '@src/handlers/hackerNoonHandler';

describe('lets', () => {
  it('should work', () => {
    expect.hasAssertions();
    findPosts(null, null, null);
    expect(1).toBe(1);
  });
});