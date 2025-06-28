export interface BookFilter {
  title?: { $regex: string; $options: string };
  genres?: { $in: string[] } | { $all: string[] };
  author?: { $regex: string; $options: string };
  price?: { $gte?: number; $lte?: number };
}
