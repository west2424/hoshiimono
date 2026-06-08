export type WishItem = {
  id: string;
  title: string;
  url: string;
  price?: string;
  note?: string;
  addedBy: string;
  purchased: boolean;
  createdAt: number;
};
