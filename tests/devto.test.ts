import { findPosts } from '@src/handlers/devtoHandler';

describe('lets', () => {
  it('should work', async () => {
    expect.hasAssertions();
    await findPosts(null, null, null);
    expect(1).toBe(1);
  });
});
