import {Concert} from './concert.model';

export class Page{
  content: any[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  first: boolean;
  sort: string;
  numberOfElements: number;
}
