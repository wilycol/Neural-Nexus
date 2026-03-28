declare module "rss-parser" {
  export type ParserItem = Record<string, unknown>;

  export type ParserOutput<TItem extends ParserItem = ParserItem> = {
    items?: TItem[];
  };

  export default class Parser<TFeed = unknown, TItem extends ParserItem = ParserItem> {
    parseURL(url: string): Promise<ParserOutput<TItem>>;
  }
}

