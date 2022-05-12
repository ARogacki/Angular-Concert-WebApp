import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {User} from './user.model';
import {Concert} from '../concert/concert.model';
import {catchError, tap} from 'rxjs/operators';
import {Ticket} from '../ticket/ticket.model';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = 'http://localhost:8080/restApi/user';
  constructor(private http: HttpClient) { }

  getListOfUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.userUrl).pipe(
      tap(_ => this.log(`fetched all users`)),
      catchError(this.handleError<User[]>(`getUsers`))
    );
  }
  getListOfUsersExceptAdmin(): Observable<User[]>{
    const url = `${this.userUrl}/adminList`;
    return this.http.get<User[]>(url).pipe(
      tap(_ => this.log(`fetched all users`)),
      catchError(this.handleError<User[]>(`getUsers`))
    );
  }
  getListOfUsersSortedByDisabled(): Observable<User[]>{
    const url = `${this.userUrl}/disabled`;
    return this.http.get<User[]>(this.userUrl).pipe(
      tap(_ => this.log(`fetched all users`)),
      catchError(this.handleError<User[]>(`getUsers`))
    );
  }

  getUserByUsername(username: string): Observable<User>{
    const url = `${this.userUrl}/${username}`;
    return this.http.get<User>(url).pipe(
      tap(_ => this.log(`fetched user=${username}`)),
      catchError(this.handleError<User>(`getUser=${username}`))
    );
  }
  deleteUserByUsername(username: string): Observable<User>{
    const url = `${this.userUrl}/${username}`;
    return this.http.delete<User>(url).pipe(
      tap(_ => this.log(`deleted user=${username}`)),
      catchError(this.handleError<User>(`deleteUser=${username}`))
    );
  }
  changeStateByUsername(username: string): Observable<any>{
    const url = `${this.userUrl}/changeState/${username}`;
    return this.http.patch(url, httpOptions).pipe(
      tap((userUpdated: User) => this.log(`updated user=${username}`)),
      catchError(this.handleError<User>('userUpdated'))
    );
  }
  updateUser(user: User): Observable<any>{
    const url = `${this.userUrl}/${user.username}`;
    if (user.name) {
      if (user.name.length < 1) {
        delete user.name;
      }
    }
    if (user.lastName) {
      if (user.lastName.length < 1) {
        delete user.lastName;
      }
    }
    if (user.description) {
      if (user.description.length < 1) {
        delete user.description;
      }
    }
    return this.http.patch(url, user, httpOptions).pipe(
      tap((userUpdated: User) => this.log(`updated user=${user.username}`)),
      catchError(this.handleError<User>('userUpdated'))
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
    console.log('UserService: ' + message);
  }
}
