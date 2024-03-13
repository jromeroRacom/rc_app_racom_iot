export class DeviceTableRowModel{

  serial: string;        // Número de serie de dispositivo
  alias: string;         // Alias de dispositivo
  macid: string;         // Mac de dispositivo
  fwVersion: string;     // Versión de firmware de dispositivo
  hwVersion: string;     // Versión de firmware de dispositivo
  state: boolean;        // Estado de usuario
  assigned: boolean;     // Estado de usuario
  createdAt: Date;       // Hora de creación
  updatedAt: Date;       // Hora de actualización
  type: string;          // Tipo de dispositivo

  /** Constructor */
  constructor(row ?: any){
    this.serial = row.serial || 'xxxxxxxx';
    this.alias = row.alias || '-';
    this.macid = row.macid || '-';
    this.fwVersion = row.fwVersion || 'v0.0.0';
    this.hwVersion = row.id || '';
    this.type = row.type || 'none';
    this.state = row.state  || false;
    this.assigned = row.assigned  || false;
    this.createdAt = row.createdAt || Date.now;
    this.updatedAt = row.updatedAt || Date.now;
  }
  /* --------------------------------------- */
}


