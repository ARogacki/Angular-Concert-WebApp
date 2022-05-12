import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from './auth/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Concert';
  private roles: string[];
  public username: string;
  public authority: string;
  public randomColor: string[] = ['white', 'red', 'blue', 'yellow', 'pink', 'green', 'purple'];
  public newColor: Map<string, string> = new Map<string, string>().set('color', 'white');

  constructor(private tokenStorage: TokenStorageService) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.authority = 'admin';
          return false;
        }
        if (role === 'ROLE_BAND') {
          this.authority = 'band';
          return false;
        }
        this.authority = 'user';
        return true;
      });
    }
    this.username = this.tokenStorage.getUsername();
  }
  changeColor(){
    this.newColor.set('color', this.randomColor[Math.floor(Math.random() * this.randomColor.length)]);
  }
  logout() {
    this.tokenStorage.signOut();
    window.location.href = '/home';
  }
}
