import { Unidad } from '../models';
import { UT1 } from './ut1.data';
import { UT2 } from './ut2.data';

export const UNIDADES: Unidad[] = [UT1, UT2];

export function buscarUnidad(id: string): Unidad | undefined {
  return UNIDADES.find((u) => u.id === id);
}
