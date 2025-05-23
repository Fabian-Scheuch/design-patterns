export type ParkingLotEventType = 'enter' | 'exit';

export interface ParkingLotEvent {
  type: ParkingLotEventType;
  parkingLotName: string;
  occupied: number;
  capacity: number;
}