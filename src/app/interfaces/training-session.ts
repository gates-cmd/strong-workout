import { PerformedExercise } from './performed-exercise';

export interface TrainingSession {
  id?: string;
  date: string;
  exercises: PerformedExercise[];
}