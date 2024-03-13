export class DevicesTypesTableModel{

  type: string;         // nombre del tipo

  /** Constructor */
  constructor(row ?: any){
    this.type = row.type || 'none';
  }
  /* --------------------------------------- */
}
