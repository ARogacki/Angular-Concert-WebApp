import { Component, OnInit } from '@angular/core';
import {Concert} from '../concert.model';
import {ConcertService} from '../concert.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenStorageService} from '../../auth/token-storage.service';
import {TicketService} from '../../ticket/ticket.service';
import {Ticket} from '../../ticket/ticket.model';
import {UserService} from '../../user/user.service';

@Component({
  selector: 'app-concert-details',
  templateUrl: './concert-details.component.html',
  styleUrls: ['./concert-details.component.css']
})
export class ConcertDetailsComponent implements OnInit {
  concert: Concert;
  tickets: Ticket[];
  username: string;
  id: string;
  editMode: boolean;
  form: any = {};
  constructor(private route: ActivatedRoute, private concertService: ConcertService, private ticketService: TicketService,
              private tokenStorage: TokenStorageService, private userService: UserService, private router: Router) { }
  ngOnInit(): void {
    this.editMode = false;
    if (this.tokenStorage.getToken()) {
      this.username = this.tokenStorage.getUsername();
    }
    this.id = this.route.snapshot.paramMap.get('id');
    this.getConcert();
    this.getTickets();
  }
  reserveTicket(): void{
    const ticket = new Ticket(this.concert.date, this.concert.price, this.concert.bandName);
    this.ticketService.reserveTicket(ticket, this.username, this.id)
      .subscribe(data => {this.getTickets(); this.getConcert(); });
  }
  getTickets(): void{
    this.ticketService.getTicketsByConcertId(this.id)
      .subscribe(tickets => this.tickets = tickets);
  }
  refundTicket(ticket: Ticket): void{
    this.ticketService.deleteTicketById(ticket.id.toString())
      .subscribe(data => {this.getTickets(); this.getConcert(); });
  }
  getConcert(): void{
    this.concertService.getConcert(this.id)
      .subscribe(concert => {this.concert = concert;
                             if (this.username === concert.bandName) {
                                this.initialValues(concert);
                             }
                             this.ticketService.countTickets(this.id)
                              .subscribe(ticketAmount => this.concert.ticketAmount = ticketAmount); });
  }
  deleteConcert(): void{
    this.concertService.deleteConcert(this.id)
      .subscribe(data => {this.router.navigate(['/']); });

  }
  getDisplayedTickets(): string[]{
    if (this.username) {
      return ['bandName', 'owner', 'price', 'date', 'refund'];
    }
  }
  changeEditState(): void{
    this.editMode = !this.editMode;
  }
  reloadPage() {
    window.location.reload();
  }

  onSubmit(): void{
    this.updateConcert(this.concert.id, this.form.description, this.form.genre);
  }
  initialValues(concert): void{
    if (concert.description) {
      this.form.description = concert.description;
    }
    if (concert.genre) {
      this.form.genre = concert.genre;
    }
  }
  updateConcert(id: number, description: string, genre: string): void{
    if (description) {
      description.trim();
    }
    if (genre){
      genre.trim();
    }
    this.concertService.updateConcert({id, description, genre} as Concert)
      .subscribe(data => this.reloadPage());
  }
}
