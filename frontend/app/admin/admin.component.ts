import { Component, OnInit } from '@angular/core';
import {UserService} from '../user/user.service';
import {TokenStorageService} from '../auth/token-storage.service';
import {User} from '../user/user.model';
import {Role} from '../user/role.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[];
  constructor(private userService: UserService, private tokenStorage: TokenStorageService,) { }
  displayedColumns: string[] = ['id', 'username', 'roles', 'enabled', 'delete'];
  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers(): void{
    this.userService.getListOfUsersExceptAdmin()
      .subscribe(users => this.users = users);
  }
  changeUserState(user: User): void{
    this.userService.changeStateByUsername(user.username)
      .subscribe(data => this.getAllUsers());
  }
  deleteUser(user: User): void{
    this.userService.deleteUserByUsername(user.username)
      .subscribe(data => this.getAllUsers());
  }
  reloadPage() {
    window.location.reload();
  }
}
