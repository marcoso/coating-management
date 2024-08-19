export class User {
  id: number;
  username: string;
  password: string;
  fullname: string;  
  token: string;
  role: string;

  constructor(fullname?: string, role?: string) {
    this.fullname = fullname;
    this.role = role;
  }
}
