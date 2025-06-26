export interface BookFilter {
  title?: { $regex: string; $options: string };
  author?: { $regex: string; $options: string };
  price?: { $gte?: number; $lte?: number };
}
