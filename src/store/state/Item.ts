export interface Item {
  id: ItemId;
  title: string;
  children: ItemId[];
}

export type ItemId = string;
