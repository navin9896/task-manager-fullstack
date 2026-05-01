import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() editTask = new EventEmitter<Task>();
  @Output() toggleComplete = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();
}

