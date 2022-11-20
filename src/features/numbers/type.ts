export interface Tag {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
}

export interface NumberEntity {
  id: number;
  number: string;
  name: string;
  tag?: Tag;
  location?: Location;
}
