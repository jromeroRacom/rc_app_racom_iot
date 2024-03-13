import { UserModel } from '../../../../global/models/users.model';

interface DeviceModel {
  img?: string;                   // Para uso interno en tablas
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


