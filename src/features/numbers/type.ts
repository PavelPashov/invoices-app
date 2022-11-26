import { ILocation } from "../locations/types";
import { ITag } from "../tags/type";

interface IBaseNumber {
  id: number | null;
  number: string;
  name: string;
}

export interface INumber extends IBaseNumber {
  tag?: ITag;
  location?: ILocation;
  options?: string;
}

export interface INumberRow extends IBaseNumber {
  tag: string;
  location: string;
  options: string;
}

export interface File {
  id: number;
  name: string;
  mimetype: MimeType;
  createdAt: Date;
  url: string;
}
