export interface DraftSchema {
  _id: string;
  title: string;
  value: any;
  author: {
    username: string;
  };
}
