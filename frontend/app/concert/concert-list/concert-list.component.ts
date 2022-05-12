import { Component, OnInit } from '@angular/core';
import {Concert} from '../concert.model';
import {ConcertService} from '../concert.service';
import {TokenStorageService} from '../../auth/token-storage.service';
import {Ticket} from '../../ticket/ticket.model';
import {TicketService} from '../../ticket/ticket.service';
import {Page} from '../page.model';

@Component({
  selector: 'app-concert-list',
  templateUrl: './concert-list.component.html',
  styleUrls: ['./concert-list.component.css']
})
export class ConcertListComponent implements OnInit {
  concertList: Concert[];
  page: Page;
  username: string;
  searchValues: Map<string, string>;
  pageNumber: number;
  search: string;
  selected = 'id';
  sortValue = 'id';
  constructor(private concertService: ConcertService, private tokenStorage: TokenStorageService, private ticketService: TicketService) { }
  getConcerts(): void{
    this.concertService.getSortedConcerts(this.searchValues)
      .subscribe(concertPage => {
        this.page = concertPage;
        this.concertList = this.page.content;
        this.concertList.forEach(data => this.ticketService.countTickets(data.id.toString())
          .subscribe(countData => data.ticketAmount = countData));
      });

  }
  ngOnInit(): void {
    this.setInitialSearch();
    this.getConcerts();
    if (this.tokenStorage.getToken()) {
      this.username = this.tokenStorage.getUsername();
    }
  }
  reserveTicket(concert): void{
    const ticket = new Ticket(concert.date, concert.price, concert.bandName);
    this.ticketService.reserveTicket(ticket, this.username, concert.id)
      .subscribe(data => this.getConcerts());
  }
  setInitialSearch(): void{
    this.searchValues = new Map<string, string>();
    this.searchValues.set('search', '');
    this.searchValues.set('order', 'ASC');
    this.searchValues.set('sort', 'id');
    this.searchValues.set('page', '0');
    this.pageNumber = 0;
  }
  sortBy(sortValue: string): void{
    this.searchValues.set('sort', sortValue);
    this.getConcerts();
  }
  searchBand(bandName: string): void{
    this.searchValues.set('search', bandName);
    this.getConcerts();
  }
  changeOrder(): void{
    if (this.searchValues.get('order') === 'ASC'){
      this.searchValues.set('order', 'DESC');
    }
    else{
      this.searchValues.set('order', 'ASC');
    }
    this.getConcerts();
  }
  changePage(pageIncrement: number): void{
    this.pageNumber += pageIncrement;
    this.searchValues.set('page', (this.pageNumber).toString());
    this.getConcerts();
  }
}
