
export class FirmwareTableModel{

  type: string;         // Tipo de dispositivo al que pertenece
  version: string;      // Versión en texto de imagen
  image: string;        // Path de archivo .bin
  createdAt: Date;      // Hora de creación
  updatedAt: Date;      // Hora de actualización

  /** Constructor */
  constructor(row ?: any){
    this.type = row.type || 'none';
    this.version = row.version || '0.0.0';
    this.image = row.image  || 'none';
    this.createdAt = row.createdAt || Date.now;
    this.updatedAt = row.updatedAt || Date.now;
  }
  /* --------------------------------------- */
}


