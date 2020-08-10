import { Site } from '@src/site';

export interface Post {
    id: string;
    title: string;
    url: string;
    site: Site;
    publishedAt: Date;
    categories: string[];
    author: string;
    content: string;
}

export class DynamoPost {
    id: string;

    title: string;

    url: string;

    site: Site;

    publishedAt: string;

    categories: string[];

    author: string;

    content: string;

    constructor(id: string, title: string, url: string, site: Site, publishedAt: string, categories: string[], author: string, content: string) {
      this.id = id;
      this.title = title;
      this.url = url;
      this.site = site;
      this.publishedAt = publishedAt;
      this.categories = categories;
      this.author = author;
      this.content = content;
    }

    static from(item: Post): DynamoPost {
      return new DynamoPost(item.id,
        item.title,
        item.url,
        item.site,
        new Date(item.publishedAt).toISOString(),
        item.categories,
        item.author,
        item.content);
    }
}
