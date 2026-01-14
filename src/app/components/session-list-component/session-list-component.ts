import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GymService } from '../../services/gym.service';
import { TrainingSession, EXERCISE_CATALOG } from '../../interfaces';
import { AlertService } from '../../services/alert-service';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-list-component.html',
  styleUrl: './session-list-component.css'
})
export class SessionListComponent implements OnInit {
  gymService = inject(GymService);
  alertService = inject(AlertService)
  router = inject(Router);
  catalog = EXERCISE_CATALOG;
  
  sessions: TrainingSession[] = [];
  availableExercises: string[] = [];
  filterExercise: string = "";

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.gymService.getSessions().subscribe(data => {
      this.sessions = data.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
    this.gymService.getExerciseList().subscribe(names => {
      this.availableExercises = names;
    });
  }

  get filteredSessions(): TrainingSession[] {
    if (!this.filterExercise) return this.sessions;
    return this.sessions.filter(session => 
      session.exercises.some(e => e.exerciseName === this.filterExercise)
    );
  }

  editSession(id: string | undefined) {
    if (id) {
      this.router.navigate(['/edit-session', id]);
    }
  }

  deleteSession(id: string | undefined) {
    if (!id) return;

    this.alertService.openConfirmDialog('Sei sicuro di voler eliminare questo allenamento?')
        .subscribe(confermato => {
      if (confermato) {
        this.gymService.deleteSession(id).subscribe(() => {
          this.sessions = this.sessions.filter(s => s.id !== id);
          this.alertService.openDialog('Allenamento eliminato con successo.');
        });
      }
    });
  }
}