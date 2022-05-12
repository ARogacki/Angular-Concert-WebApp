import { Component, OnInit } from '@angular/core';
import {Concert} from './concert.model';
import {ConcertService} from './concert.service';
import {TokenStorageService} from '../auth/token-storage.service';
import {UserService} from '../user/user.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-concert',
  templateUrl: './concert.component.html',
  styleUrls: ['./concert.component.css']
})
export class ConcertComponent implements OnInit {
  concert: Concert;
  username: string;
  authority: string[];
  form: any = {};
  creationSuccessful = false;
  // customValidation;
  constructor(private concertService: ConcertService, private tokenStorage: TokenStorageService, private userService: UserService) { }
  ngOnInit(): void {
    // this.customValidation = new FormControl('', [Validators.max(100), Validators.min(0)]);
    if (this.tokenStorage.getToken()) {
      this.username = this.tokenStorage.getUsername();
    }
  }
  onSubmit(): void{
    if (this.tokenStorage.getToken()) {
      this.username = this.tokenStorage.getUsername();
      this.authority = this.tokenStorage.getAuthorities();
      if (this.authority.includes('ROLE_BAND')){
        this.addConcert(this.username, this.form.genre, this.form.description, this.form.date, this.form.cost, this.form.capacity);
      }
      else{
        console.log('User is not of band type');
      }
    }
  }
  addConcert(bandName: string, genre: string, description: string, date: Date, price: number, ticketCapacity: number): void{
    bandName = bandName.trim();
    genre = genre.trim();
    description = description.trim();
    this.concertService.addConcert({date, description, bandName, genre, price, ticketCapacity} as Concert)
      .subscribe(data => window.location.href = '/concert/' + data.id);
    this.creationSuccessful = true;
  }
}
