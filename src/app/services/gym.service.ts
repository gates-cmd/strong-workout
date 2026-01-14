import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { TrainingSession, EXERCISE_CATALOG } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GymService {
  private http = inject(HttpClient);
  private apiUrl = 'https://695e61ac2556fd22f6784514.mockapi.io/gym/exercise';

  getSessions(): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(this.apiUrl);
  }

  getSession(id: string): Observable<TrainingSession> {
    return this.http.get<TrainingSession>(`${this.apiUrl}/${id}`);
  }

  createSession(session: TrainingSession): Observable<TrainingSession> {
    return this.http.post<TrainingSession>(this.apiUrl, session);
  }

  updateSession(session: TrainingSession): Observable<TrainingSession> {
    return this.http.put<TrainingSession>(`${this.apiUrl}/${session.id}`, session);
  }

  deleteSession(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getExerciseList(): Observable<string[]> {
    return this.getSessions().pipe(
      map(sessions => {
        const defaultNames = EXERCISE_CATALOG.map(e => e.name);
        const historyNames: string[] = [];
        
        if (sessions) {
          sessions.forEach(session => {
            if (session.exercises && Array.isArray(session.exercises)) {
              session.exercises.forEach(ex => {
                if (ex.exerciseName) {
                  historyNames.push(ex.exerciseName);
                }
              });
            }
          });
        }

        const allNames = [...defaultNames, ...historyNames];
        
        return [...new Set(allNames)]
          .filter(name => !!name && name.trim() !== '')
          .sort(); 
      })
    );
  }
}