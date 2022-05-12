import {User} from '../user/user.model';
import {Concert} from '../concert/concert.model';

export class Ticket {
  id: number;
  date: Date;
  bandName: string;
  price: number;
  user: User;
  concert: Concert;

  constructor(date: Date, price: number, bandName: string) {
    this.date = date;
    this.bandName = bandName;
    this.price = price;
  }

}
