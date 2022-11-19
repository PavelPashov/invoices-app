export interface LoginResponse {
  user: {
    id: number;
    email: string;
  };
  token: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
