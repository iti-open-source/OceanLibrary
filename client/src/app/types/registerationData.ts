export interface registerationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
    zip: string;
  };
}
