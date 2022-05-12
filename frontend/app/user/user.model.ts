import {Role} from './role.model';

export class User {
  id: number;
  username: string;
  roles: Role[];
  name: string;
  lastName: string;
  publicProfile: boolean;
  enabled: boolean;
  description: string;
  accountBalance: number;

  constructor(username: string, name: string, lastName: string, publicProfile: boolean,
              enabled: boolean, description: string, accountBalance: number) {
    this.username = username;
    this.name = name;
    this.lastName = lastName;
    this.publicProfile = publicProfile;
    this.enabled = enabled;
    this.description = description;
    this.accountBalance = accountBalance;
  }

}
