export class Concert {
  id: number;
  date: Date;
  description: string;
  bandName: string;
  genre: string;
  price: number;
  ticketAmount: number;
  ticketCapacity: number;

  constructor(date: Date, description: string, bandName: string, genre: string, price: number, ticketCapacity: number) {
    this.date = date;
    this.description = description;
    this.bandName = bandName;
    this.genre = genre;
    this.price = price;
    this.ticketCapacity = ticketCapacity;
  }

}
