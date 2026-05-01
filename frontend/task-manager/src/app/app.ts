import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Task } from './models/task.model';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, TaskFormComponent, TaskListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  isLoading = false;
  isSaving = false;
  filter: 'all' | 'pending' | 'completed' = 'all';

  constructor(
    private readonly taskService: TaskService,
    private readonly toastr: ToastrService
  ) {
    this.loadTasks();
  }

  get filteredTasks(): Task[] {
    if (this.filter === 'all') return this.tasks;
    return this.tasks.filter((task) => task.status === this.filter);
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService
      .getTasks('all')
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
        },
        error: (error: Error) => {
          this.toastr.error(error.message, 'Error');
        },
      });
  }

  setFilter(filter: 'all' | 'pending' | 'completed'): void {
    this.filter = filter;
  }

  onCreateTask(payload: { title: string; description: string }): void {
    this.isSaving = true;
    this.taskService
      .createTask(payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (task) => {
          this.tasks = [task, ...this.tasks];
          this.toastr.success('Task added.', 'Success');
        },
        error: (error: Error) => {
          this.toastr.error(error.message, 'Error');
        },
      });
  }

  onStartEdit(task: Task): void {
    this.selectedTask = task;
  }

  onCancelEdit(): void {
    this.selectedTask = null;
  }

  onUpdateTask(payload: { title: string; description: string }): void {
    if (!this.selectedTask) return;

    this.isSaving = true;
    this.taskService
      .updateTask(this.selectedTask._id, payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (updatedTask) => {
          this.tasks = this.tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task));
          this.selectedTask = null;
          this.toastr.success('Task updated.', 'Success');
        },
        error: (error: Error) => {
          this.toastr.error(error.message, 'Error');
        },
      });
  }

  onToggleComplete(task: Task): void {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    this.taskService.updateTask(task._id, { status: nextStatus }).subscribe({
      next: (updatedTask) => {
        this.tasks = this.tasks.map((item) => (item._id === updatedTask._id ? updatedTask : item));
        if (this.selectedTask?._id === updatedTask._id) this.selectedTask = updatedTask;
        this.toastr.success(`Task marked ${updatedTask.status}.`, 'Success');
      },
      error: (error: Error) => this.toastr.error(error.message, 'Error'),
    });
  }

  onDeleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task._id !== taskId);
        if (this.selectedTask?._id === taskId) this.selectedTask = null;
        this.toastr.success('Task deleted.', 'Success');
      },
      error: (error: Error) => this.toastr.error(error.message, 'Error'),
    });
  }
}
