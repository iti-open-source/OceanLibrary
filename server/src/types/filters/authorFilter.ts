export interface AuthorFilter {
  name?: { $regex: string; $options: string };
  nationality?: { $regex: string; $options: string };
  genres?: { $in: string[] } | { $all: string[] };
}
