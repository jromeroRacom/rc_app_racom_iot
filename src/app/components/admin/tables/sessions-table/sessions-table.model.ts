export class SessionsTableModel{

  id: string;               // Id de sesión
  ip: string;              // Ip de sesion
  city: string;            // Lugar de inició de sesión
  user: string;             // Correo de usuario
  start: Date;              // Hora de inicio
  expiration: Date;         // Tiempo de expiración


  /** Constructor */
  constructor(row ?: any){
    this.ip = row.ip || 'none';
    this.city = row.city || 'none';
    this.id = row.id || 'none';
    this.expiration = row.expiration || Date.now();
    this.start = row.start || Date.now();
    this.user = row.user || 'none';
  }
  /* --------------------------------------- */
}
