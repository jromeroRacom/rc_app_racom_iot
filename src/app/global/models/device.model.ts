import { UserModel } from './users.model';
import { MQTTCredentialsModel } from './mqtt-credentials.model';
import { ErrorModel } from './back-end.models';

export interface DeviceModel {
  serial: string;
  alias: string;
  macid: string;
  fwVersion: string;
  type: string;
  hwVersion?: string;
  topic?: string;
  state?: boolean;
  assigned?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserModel;
}

export interface DeviceIoTModel {
  device: DeviceModel;
  status: boolean;
  mqtt: MQTTCredentialsModel;
}

export interface DeviceError {
  title: string;
  msg: string;
  type: string;
  code: string;
  error: ErrorModel[];
}
