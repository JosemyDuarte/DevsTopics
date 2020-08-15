import 'source-map-support/register';

import { Post } from '@src/post';

import { Item } from 'rss-parser';
import { Site } from '@src/site';
import { BaseRssSource } from '@src/sources/BaseRssSource';

const regExp = new RegExp('\\/(\\?.*)$', 'gm');

class InfoQHandler extends BaseRssSource {
  source = (): Site => Site.INFOQ;

  parseRssToPost = (item: Item): Post => {
    console.debug(`Post found for ${this.source()} [${JSON.stringify(item)}]`);

    return {
      id: item.guid,
      url: item.link.replace(regExp, ''),
      title: item.title,
      site: this.source(),
      publishedAt: new Date(item.isoDate),
      categories: item.categories,
      author: item.creator,
      content: item.contentSnippet,
    };
  };
}

export const handler = new InfoQHandler();

export const { findPosts } = handler;
