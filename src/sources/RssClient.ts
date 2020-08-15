import Parser, { Item } from 'rss-parser';
import { Post } from '@src/post';

export interface RssClient {
  retrievePosts(): Promise<Post[]>;
}

export class RssParserClient implements RssClient {
  private readonly feedUrl: string;

  private readonly parseFunction: (item: Item) => Post;

  constructor(feedUrl: string, parseFunction: (item: Item) => Post) {
    this.feedUrl = feedUrl;
    this.parseFunction = parseFunction;
  }

  async retrievePosts(): Promise<Post[]> {
    const parser = new Parser();
    const feed: Parser.Output = await parser.parseURL(this.feedUrl);

    return feed.items.map((item) => this.parseFunction(item));
  }
}
