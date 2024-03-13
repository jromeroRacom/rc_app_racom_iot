export interface ExpirationEvent{
  event: string;
  timeLeft?: number;
}

export interface JWTDecoded {
  user?: {
    id: number;
    session: string;
    email: string;
    name: string;
    role: string;
  };
  timestamp?: Date;
  exp: number;
  iat: number;
}
