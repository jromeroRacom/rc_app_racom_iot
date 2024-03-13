export class MqttAclTableModel{

  // tslint:disable-next-line: variable-name
  allow: boolean;     // Bandera de permisos
  access: boolean;    // Nivel de acceso
  username: string;   // Nombre de usuario
  topic: string;      // Topico
  createdAt: Date;    // Hora de creación
  updatedAt: Date;    // Hora de actualización

  /** Constructor */
  constructor(row ?: any){
    this.username = row.username || 'xxxxxxxx';
    this.topic = row.topic || 'xxxxxxxx';
    this.access = row.access || false;
    this.allow = row.allow  || false;
    this.createdAt = row.createdAt || Date.now;
    this.updatedAt = row.updatedAt || Date.now;
  }
  /* --------------------------------------- */
}
