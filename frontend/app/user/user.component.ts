import { Component, OnInit } from '@angular/core';
import {UserService} from './user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenStorageService} from '../auth/token-storage.service';
import {TicketService} from '../ticket/ticket.service';
import {User} from './user.model';
import {Ticket} from '../ticket/ticket.model';
import {Concert} from '../concert/concert.model';
import {ConcertService} from '../concert/concert.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  username: string;
  userPage: string;
  form: any = {};
  isBand: boolean;
  user: User;
  editMode: boolean;
  showConcerts: boolean;
  tickets: Ticket[];
  concerts: Concert[];

  constructor(private userService: UserService, private route: ActivatedRoute,
              private tokenStorage: TokenStorageService, private ticketService: TicketService, private concertService: ConcertService,
              private router: Router) {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isBand = false;
      this.showConcerts = true;
      this.username = this.tokenStorage.getUsername();
      this.userPage = this.route.snapshot.paramMap.get('username');
      this.getData();
      this.editMode = false;
    }
  }
  getData(): void{
    this.getUser();
    this.getTickets();
  }
  getUser(): void{
    this.userService.getUserByUsername(this.userPage)
      .subscribe(user => {this.user = user;
                          if (this.username === user.username) {
                            this.initialValues(user);
                          }
                          this.user.roles.find(x => { if (x.name === 'ROLE_BAND') { this.isBand = true;
                                                                                    this.getConcerts(user); }
                          });
      });
  }
  getTickets(): void{
    this.ticketService.getTicketsByUsername(this.userPage)
      .subscribe(tickets => this.tickets = tickets);
  }
  getConcerts(user: User): void{
    this.concertService.getConcertsByBand(user.id)
      .subscribe(concerts => {this.concerts = concerts;
                              this.concerts.forEach(data => this.ticketService.countTickets(data.id.toString())
                                .subscribe(countData => data.ticketAmount = countData));
      });
  }
  changeEditState(): void{
    this.editMode = !this.editMode;
  }
  onSubmit(): void{
    this.updateUser(this.user.username, this.form.name, this.form.lastName, this.form.description, this.form.publicProfile);
  }
  refundTicket(ticket: Ticket): void{
    this.ticketService.deleteTicketById(ticket.id.toString())
      .subscribe(data => this.getData());
  }
  updateUser(username: string, name: string, lastName: string, description: string, publicProfile: boolean = false): void{
    console.log(publicProfile);
    if (name) {
      name = name.trim();
    }
    if (lastName) {
    lastName = lastName.trim();
    }
    if (description) {
    description = description.trim();
    }
    this.userService.updateUser({username, name, lastName, description, publicProfile} as User)
      .subscribe(data => this.reloadPage());
  }
  initialValues(user): void{
    if (user.name) {
      this.form.name = user.name;
    }
    if (user.lastName) {
      this.form.lastName = user.lastName;
    }
    if (user.description) {
      this.form.description = user.description;
    }
    if (user.publicProfile) {
      this.form.publicProfile = user.publicProfile;
    }
  }
  reloadPage() {
    window.location.reload();
  }

  changeCategory(): void{
    this.showConcerts = !this.showConcerts;
  }

  getDisplayedConcerts(): string[]{
    if (this.username === this.user.username) {
      return ['bandName', 'description', 'ticketCapacity', 'price', 'genre', 'date', 'delete'];
    }
    else {
      return ['bandName', 'description', 'ticketCapacity', 'price', 'genre', 'date'];
    }
  }
  getDisplayedTickets(): string[]{
    if (this.username === this.user.username) {
      return ['bandName', 'owner', 'price', 'date', 'refund'];
    }
    else {
      return ['bandName', 'owner', 'price', 'date'];
    }
  }

  deleteConcert(id: string): void{
    this.concertService.deleteConcert(id)
      .subscribe(data => this.getData());
  }
}
