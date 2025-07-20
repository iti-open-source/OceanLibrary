export interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  address: {
    street?: string;
    city?: string;
    country?: string;
    zip?: string;
  };
  role: "super-admin" | "admin" | "user";
  active: boolean;
  verified: boolean;
  createdAt?: string;
  updatedAt?: string;
  passwordChangeAt?: Date;
  verificationExpiry?: Date;
  passwordResetExpiry?: Date;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  usersPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetUsersResponse {
  status: string;
  data: User[];
  pagination: PaginationInfo;
}

export interface UserActionResponse {
  status: string;
  message: string;
}
