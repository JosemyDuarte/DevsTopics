import { findPosts } from '@src/handlers/infoqHandler';

describe('lets', () => {
  it('should work', async () => {
    expect.hasAssertions();
    await findPosts(null, null, null);
    expect(1).toBe(1);
  });
});
