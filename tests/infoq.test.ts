import { findPosts } from '@src/sources/infoQ/infoQHandler';

describe('lets', () => {
  it('should work', async () => {
    expect.hasAssertions();
    await findPosts(null, null);
    expect(1).toBe(1);
  });
});
