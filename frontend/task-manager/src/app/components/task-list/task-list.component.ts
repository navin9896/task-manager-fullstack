import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Input() isLoading = false;
  @Output() editTask = new EventEmitter<Task>();
  @Output() toggleComplete = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();

  trackById(index: number, task: Task): string {
    return task._id;
  }
}

