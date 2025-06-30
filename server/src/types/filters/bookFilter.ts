export interface BookFilter {
  title?: { $regex: string; $options: string };
  genres?: { $in: string[] } | { $all: string[] };
  authorName?: { $regex: string; $options: string };
  price?: { $gte?: number; $lte?: number };
}
