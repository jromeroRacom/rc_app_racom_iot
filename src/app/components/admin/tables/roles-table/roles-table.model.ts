export class RolesTableModel{

  role: string;         // nombre del rol

  /** Constructor */
  constructor(row ?: any){
    this.role = row.role || 'none';
  }
  /* --------------------------------------- */
}
