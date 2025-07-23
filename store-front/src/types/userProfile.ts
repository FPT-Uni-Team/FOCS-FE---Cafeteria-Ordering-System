export interface UserResponse {
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone_number?: string;
  avatar?: string;
}
