
export interface MqttDataModel {
  status: boolean;
  username: string;
  password: string;
  topic: string;
  access: number;
  allow: number;
  ip: string;
  connectedAt: string;
  transfer_bytes: TransferData;
  transfer_msgs: TransferData;
  location: Location;
}

interface Location {
  country: string;
  region: string;
  timezone: string;
  city: string;
  ll: number[];
}

interface TransferData {
  send: number;
  recv: number;
}
