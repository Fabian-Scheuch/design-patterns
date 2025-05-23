import { ParkingLotEvent } from './parking-lot.event.js';

export interface Subscriber {
  update(event: ParkingLotEvent): void;
}

export interface Publisher {
  subscribe(subscriber: Subscriber): void;
  unsubscribe(subscriber: Subscriber): void;
  notify(type: 'enter' | 'exit'): void;
}