import { Rol } from './rol.model';

export interface Usuario {
  id?: number;
  username: string;
  password?: string;
  email: string;
  rol: Rol;
  activo?: boolean;
  fechaCreacion?: string;
}
