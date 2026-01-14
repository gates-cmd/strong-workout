import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PerformedExercise, TrainingSession } from '../../interfaces';
import { GymService } from '../../services/gym.service';
import { AlertService } from '../../services/alert-service';

@Component({
  selector: 'app-new-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-session-component.html',
  styleUrl: './new-session-component.css'
})
export class NewSessionComponent implements OnInit {
  gymService = inject(GymService);
  alertService = inject(AlertService);
  
  router = inject(Router);
  route = inject(ActivatedRoute);
  
  availableExercises: string[] = [];
  
  selectedExerciseName: string = '';
  isCustomExercise: boolean = false;
  customExerciseName: string = '';
  sets: number = 3;
  reps: number = 10;
  weight: number = 0;

  currentSessionExercises: PerformedExercise[] = [];
  
  editingId: string | null = null; 
  pageTitle: string = '💪 Nuova Sessione';

  ngOnInit() {
    this.gymService.getExerciseList().subscribe(names => {
      this.availableExercises = names;
    });

    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.editingId = id;
      this.pageTitle = '✏️ Modifica Sessione';
      
      this.gymService.getSession(id).subscribe(session => {
        this.currentSessionExercises = session.exercises;
      });
    }
  }

  onSelectChange(event: any) {
    const value = event.target.value;

    if (value === 'ALTRO') {
      this.isCustomExercise = true;
      this.customExerciseName = '';
    } else {
      this.isCustomExercise = false;
      this.customExerciseName = ''; 
    }
  }

  addExercise() {
    const finalName = this.isCustomExercise ? this.customExerciseName : this.selectedExerciseName;

    if (finalName && finalName.trim().length > 0) {
      this.currentSessionExercises.push({
        exerciseName: finalName.trim(),
        sets: this.sets,
        reps: this.reps,
        weightKg: this.weight
      });

      this.selectedExerciseName = ''; 
      this.customExerciseName = '';
      this.isCustomExercise = false;
    }
  }

  removeExercise(index: number) {
    this.currentSessionExercises.splice(index, 1);
  }

  saveSession() {
    if (this.currentSessionExercises.length === 0) {
      this.alertService.openDialog('La lista esercizi è vuota!')
      return;
    }

    const sessionData: TrainingSession = {
      id: this.editingId ? this.editingId : undefined,
      date: new Date().toISOString(), 
      exercises: this.currentSessionExercises
    };

    if (this.editingId) {
      this.gymService.updateSession(sessionData).subscribe(() => {
        this.alertService.openDialog('Allenamento aggiornato con successo!');
        this.router.navigate(['/']);
      });
    } else {
      this.gymService.createSession(sessionData).subscribe(() => {
        this.alertService.openDialog('Nuovo allenamento salvato!')
        this.router.navigate(['/']);
      });
    }
  }
}