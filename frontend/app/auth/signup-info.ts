export class SignupInfo {
  username: string;
  role: string[];
  password: string;
  email: string;
  publicProfile: boolean;
  enabled: boolean;
  description: string;
  name: string;
  lastName: string;
  constructor(username: string, role: string[], password: string, email: string, enabled: boolean) {
    this.username = username;
    this.role = role;
    this.password = password;
    this.email = email;
    this.enabled = enabled;
    this.publicProfile = false;
  }
}
