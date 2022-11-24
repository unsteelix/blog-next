export interface IBlock {
  id: string;
  index: number;
  type: string;
  data: any;
}

export interface IPost {
  id: string;
  slug: string;
  preview: string;
  cover: string;
  title: string;
  subTitle: string;
  index: number;
  show: boolean;
  blocks: {
    [key: string]: IBlock;
  };
  [key: string]: any;
}

export interface IPosts {
  [key: string]: IPost;
}

export interface IBlocks {
  [key: string]: IBlock;
}
