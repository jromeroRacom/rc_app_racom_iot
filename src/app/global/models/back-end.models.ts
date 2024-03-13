import { DeviceModel } from './device.model';
export interface ResponseModel {
  ok: boolean;
  msg?: string;
  token?: string;
  errors?: string;
  device?: DeviceModel;
  data?: {
    u: string;
    a: string;
    t: string;
    y: string;
  };
  state?: boolean;
}

export class ErrorModel {
  msg: string;

  constructor() { this.msg = ''; }
}

export class ErrorsModel {
  ok: boolean;
  errors: ErrorModel[];

  constructor() { this.ok = false; this.errors = []; }
}

export interface Devices {
  count: number;
  rows: DeviceModel[];
}

export interface ApiDevicesModel {
  ok: boolean;
  devices: Devices;
}



