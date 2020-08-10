import { Post } from '@src/post';

export interface PostWriterRepository {
    save(item: Post): Promise<string>;
}
