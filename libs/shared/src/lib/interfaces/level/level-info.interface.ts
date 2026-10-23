/**
 * The LevelInfo interface defines the structure for basic level information.
 */
export interface LevelInfo {
  id: number;
  name: string;
  minPoints: number;
  maxPoints: number | null;
  imageUrl: string;
}
