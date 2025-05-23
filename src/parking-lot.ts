import { Publisher, Subscriber } from "./parking-lot.observer.js";
import { ParkingLotEvent } from "./parking-lot.event.js";

export class Display implements Subscriber {
  update(event: ParkingLotEvent): void {
    const action = event.type === "enter" ? "entered" : "left";
    console.log(
      `A car ${action} the lot ${event.parkingLotName}: ${event.occupied}/${event.capacity} occupied.`
    );
  }
}

export class ParkingLot implements Publisher {
  private subscribers: Subscriber[] = [];
  public occupied = 0;

  constructor(
    public name: string,
    public capacity: number
  ) {}

  subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber) {
    this.subscribers = this.subscribers.filter((s) => s !== subscriber);
  }

  notify(type: "enter" | "exit"): void {
    const event: ParkingLotEvent = {
      type,
      parkingLotName: this.name,
      occupied: this.occupied,
      capacity: this.capacity,
    };
    this.subscribers.forEach((s) => s.update(event));
  }

  enter() {
    if (!this.isFull()) {
      this.occupied++;
      this.notify("enter");
    } else {
      throw new Error(`the parking lot is full`);
    }
  }

  exit() {
    if (!this.isEmpty()) {
      this.occupied--;
      this.notify("exit");
    } else {
      throw new Error(`the parking lot is empty`);
    }
  }

  isFull() {
    return this.occupied == this.capacity;
  }

  isEmpty() {
    return this.occupied == 0;
  }
}
