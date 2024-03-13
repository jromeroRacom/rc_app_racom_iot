export interface AuthSupport {
  ok: boolean;
  uid?: string;
  name?: string;
  email?: string;
  token?: string;
  msg?: string;
}

export interface UserSopport {
  uid: string;
  name: string;
  email:string;
}
