import { Post } from '@src/post';
import { Site } from '@src/site';

export interface PostReaderRepository {
    search(publishedFrom: Date, site: Site): Promise<Post[]>;
}
