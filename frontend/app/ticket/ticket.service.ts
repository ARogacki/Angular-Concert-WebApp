import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Concert} from '../concert/concert.model';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Ticket} from './ticket.model';
import {User} from '../user/user.model';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private ticketUrl = 'http://localhost:8080/restApi/ticket';
  constructor(private http: HttpClient) { }

  getTickets(): Observable<Ticket[]>{
    return this.http.get<Ticket[]>(this.ticketUrl);
  }
  countTickets(id: string): Observable<any>{
    const url = `${this.ticketUrl}/concert/${id}/count`;
    return this.http.get(url);
  }
  reserveTicket(ticket, username: string, id: string): Observable<Ticket>{
    const url = `${this.ticketUrl}/concert/${id}?username=${username}`;
    return this.http.post<Ticket>(url, ticket, httpOptions).pipe(
      tap((ticketAdded: Ticket) => this.log(`added ticket id=${ticketAdded.id}`)),
      catchError(this.handleError<Ticket>('addTicket'))
    );
  }
  getTicketsByUsername(username: string): Observable<Ticket[]>{
    const url = `${this.ticketUrl}/user/${username}`;
    return this.http.get<Ticket[]>(url).pipe(
      tap(_ => this.log(`fetched tickets=${Ticket}`)),
      catchError(this.handleError<Ticket[]>(`getTickets=${Ticket}`))
    );
  }
  getTicketsByConcertId(id: string): Observable<Ticket[]>{
    const url = `${this.ticketUrl}/concert/${id}`;
    return this.http.get<Ticket[]>(url).pipe(
      tap(_ => this.log(`fetched tickets=${Ticket}`)),
      catchError(this.handleError<Ticket[]>(`getTickets=${Ticket}`))
    );
  }
  deleteTicketById(id: string): Observable<Ticket>{
    const url = `${this.ticketUrl}/${id}`;
    return this.http.delete<Ticket>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted ticket id=${id}`)),
      catchError(this.handleError<Ticket>('deleteTicket'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log('TicketService: ' + message);
  }
}

