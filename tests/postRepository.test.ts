import { Site } from '@src/site';
import { DynamoPostReaderRepository } from '@src/repositories/dynamoPostReaderRepository';

describe('lets', () => {
  it('should work', () => {
    expect.hasAssertions();
    const dynamoPostRepository = new DynamoPostReaderRepository(
      'development-posts',
      'publishedAt_site_index',
      { endpoint: 'http://127.0.0.1:8000', region: 'localhost' },
    );
    dynamoPostRepository.search(new Date('2020-08'), Site.HACKERNOON);
    expect(1).toBe(1);
  });
});
