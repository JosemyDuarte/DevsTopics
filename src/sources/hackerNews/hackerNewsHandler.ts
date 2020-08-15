import 'source-map-support/register';

import { Post } from '@src/post';
import { Site } from '@src/site';
import { Item } from 'rss-parser';
import { BaseRssSource } from '@src/sources/BaseRssSource';

class HackerNewsHandler extends BaseRssSource {
  source = (): Site => Site.HACKERNEWS;

  parseRssToPost = (item: Item): Post => {
    console.debug(`Post found for ${this.source()} [${JSON.stringify(item)}]`);

    return {
      id: item.guid,
      url: item.link,
      title: item.title,
      site: this.source(),
      publishedAt: new Date(item.isoDate),
      categories: undefined,
      author: item.creator,
      content: undefined,
    };
  };
}

export const handler = new HackerNewsHandler();

export const { findPosts } = handler;
