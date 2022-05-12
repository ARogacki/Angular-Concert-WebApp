import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Concert} from './concert.model';
import {catchError, tap} from 'rxjs/operators';
import {Ticket} from '../ticket/ticket.model';
import {Page} from './page.model';
import {User} from '../user/user.model';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class ConcertService {
  private concertsUrl = 'http://localhost:8080/restApi/concert';
  constructor(private http: HttpClient) { }

  getConcerts(): Observable<Page>{
    return this.http.get<Page>(this.concertsUrl);
  }
  getSortedConcerts(searchValues: Map<string, string>): Observable<Page>{
    const url = `${this.concertsUrl}?search=${searchValues.get('search')}&order=${searchValues.get('order')}&sort=${searchValues.get('sort')}&page=${searchValues.get('page')}`;
    return this.http.get<Page>(url);
  }
  getConcert(id: string): Observable<Concert>{
    const url = `${this.concertsUrl}/${id}`;
    return this.http.get<Concert>(url).pipe(
      tap(_ => this.log(`fetched concert id=${id}`)),
      catchError(this.handleError<Concert>(`getConcert id=${id}`))
    );
  }
  addConcert(concert: Concert): Observable<Concert>{
    return this.http.post<Concert>(this.concertsUrl, concert, httpOptions).pipe(
      tap((contactAdded: Concert) => this.log(`added concert id=${contactAdded.id}`)),
      catchError(this.handleError<Concert>('addContact'))
    );
  }
  updateConcert(concert: Concert): Observable<any> {
    const url = `${this.concertsUrl}/${concert.id}`;
    if (concert.description) {
      if (concert.description.length < 1) {
        delete concert.description;
      }
    }
    if (concert.genre) {
      if (concert.genre.length < 1) {
        delete concert.genre;
      }
    }
    return this.http.patch(url, concert, httpOptions).pipe(
      tap((userUpdated: Concert) => this.log(`updated concert=${concert.id}`)),
      catchError(this.handleError<Concert>('concertUpdated'))
    );
  }
  deleteConcert(id: string): Observable<Concert>{
    const url = `${this.concertsUrl}/${id}`;
    return this.http.delete<Concert>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted concert id=${id}`)),
      catchError(this.handleError<Concert>('deleteConcert'))
    );
  }
  getConcertsByBand(id: number): Observable<Concert[]>{
    const url = `${this.concertsUrl}/band/${id}`;
    return this.http.get<Concert[]>(url).pipe(
      tap(_ => this.log(`fetched concert id=${id}`)),
      catchError(this.handleError<Concert[]>(`getConcert id=${id}`))
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

  /** Log a ConcertService message with the MessageService */
  private log(message: string) {
    console.log('ConcertService: ' + message);
  }
}
