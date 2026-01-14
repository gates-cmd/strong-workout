import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GymService } from '../../services/gym.service';
import { TrainingSession } from '../../interfaces';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './progress-bar-component.html',
  styleUrl: './progress-bar-component.css'
})
export class ProgressBarComponent implements OnInit {
  gymService = inject(GymService);

  sessions: TrainingSession[] = [];
  availableExercises: string[] = [];
  selectedExercise: string = '';

  public commonOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f4f4f5' } },
      x: { grid: { display: false } }
    }
  };

  public weightChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  public repsChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  public setsChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  ngOnInit() {
    this.gymService.getSessions().subscribe(data => {
      this.sessions = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    this.gymService.getExerciseList().subscribe(names => {
      this.availableExercises = names;
    });
  }

  updateChart() {
    if (!this.selectedExercise) return;

    const labels: string[] = [];
    const weights: number[] = [];
    const reps: number[] = [];
    const sets: number[] = [];

    this.sessions.forEach(session => {
      const exercise = session.exercises.find(e => e.exerciseName === this.selectedExercise);
      
      if (exercise) {
        const dateObj = new Date(session.date);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        labels.push(`${day}/${month}`);

        weights.push(exercise.weightKg);
        reps.push(exercise.reps);
        sets.push(exercise.sets);
      }
    });

    const createDataset = (label: string, data: number[], color: string) => ({
      data: data,
      label: label,
      fill: true,
      tension: 0.4,
      borderColor: color,
      backgroundColor: color + '33',
      pointBackgroundColor: '#ffffff',
      pointBorderColor: color,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: '#f4f4f5'
    });
    
    this.weightChartData = {
      labels: labels,
      datasets: [createDataset('Carico (Kg)', weights, '#FD3DB5')]
    };

    this.repsChartData = {
      labels: labels,
      datasets: [createDataset('Ripetizioni', reps, '#b033ea')]
    };

    this.setsChartData = {
      labels: labels,
      datasets: [createDataset('Serie Totali', sets, '#4c0495')]
    };
  }
}