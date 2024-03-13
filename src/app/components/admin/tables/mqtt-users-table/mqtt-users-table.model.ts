export class MqttUsersTableModel{

  // tslint:disable-next-line: variable-name
  is_superuser: boolean;    // Bandera de super usuario
  username: string;         // Nombre de usuario
  password: string;         // Alias de dispositivo
  createdAt: Date;          // Hora de creación
  updatedAt: Date;       // Hora de actualización

  /** Constructor */
  constructor(row ?: any){
    this.username = row.username || 'xxxxxxxx';
    this.password = row.password || '-';
    this.is_superuser = row.is_superuser  || false;
    this.createdAt = row.createdAt || Date.now;
    this.updatedAt = row.updatedAt || Date.now;
  }
  /* --------------------------------------- */
}


