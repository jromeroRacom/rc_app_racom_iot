import { nanoid } from 'nanoid';

export class DeviceTableRowModel{

  id: string;            // Id para manejo interno de fila
  img: string;           // Imagen de dispositivo
  serial: string;        // Número de serie de dispsoitivo
  alias: string;         // Alias de dispositivo
  macid: string;         // Mac de dispositivo
  fwVersion: string;     // Versión de firmware de dispositivo
  type: string;          // Tipo de dispositivo

  /** Constructor */
  constructor(row ?: any){
    this.id = row.id || nanoid(5);
    this.serial = row.serial || 'xxxxxxxx';
    this.alias = row.alias || '-';
    this.macid = row.macid || '-';
    this.fwVersion = row.fwVersion || 'v0.0.0';
    this.type = row.type || 'none';
    this.img = `assets/images/devices/${this.type}.png` || 'assets/images/devices/none.png';
  }
  /* --------------------------------------- */
}


