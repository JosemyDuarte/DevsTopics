import 'source-map-support/register';

import { Post } from '@src/post';
import { Site } from '@src/site';
import { Item } from 'rss-parser';
import { BaseRssSource } from '@src/sources/BaseRssSource';

class DevToHandler extends BaseRssSource {
  source = (): Site => Site.DEVTO;

  parseRssToPost = (item: Item): Post => {
    console.debug(`Post found for ${this.source()} [${JSON.stringify(item)}]`);

    return {
      id: item.guid,
      url: item.link,
      title: item.title,
      site: this.source(),
      publishedAt: new Date(item.isoDate),
      categories: item.categories,
      author: item.creator,
      content: item.contentSnippet,
    };
  };
}

export const handler = new DevToHandler();

export const { findPosts } = handler;
