interface IBaseTag {
  name: string;
}

export interface ITag extends IBaseTag {
  id: number | null;
}
export interface ITagRow extends ITag {
  options: string;
}
