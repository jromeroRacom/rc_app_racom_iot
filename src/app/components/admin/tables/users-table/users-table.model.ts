
export class UsersTableModel{

  id: number;           // Id de usuario
  email: string;        // Correo de usuario
  name: string;         // Nombre de usuario
  state: boolean;       // Estado de usuario
  role: string;         // Rol de usuario
  createdAt: Date;      // Hora de creación
  updatedAt: Date;      // Hora de actualización

  /** Constructor */
  constructor(row ?: any){
    this.id = row.id || 0;
    this.email = row.email || 'none';
    this.name = row.name || '';
    this.state = row.state  || false;
    this.role = row.role || 'none';
    this.createdAt = row.createdAt || Date.now;
    this.updatedAt = row.updatedAt || Date.now;
  }
  /* --------------------------------------- */
}


