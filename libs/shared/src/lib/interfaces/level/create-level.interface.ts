/**
 * The CreateLevel interface defines the structure for creating a new level in the system.
 */
export interface CreateLevel {
  id: number;
  name: string;
  imageUrl: string;
  minPoints: number;
  maxPoints?: number | null;
}
