import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() selectedTask: Task | null = null;
  @Input() isSaving = false;
  @Output() createTask = new EventEmitter<{ title: string; description: string }>();
  @Output() updateTask = new EventEmitter<{ title: string; description: string }>();
  @Output() cancelEdit = new EventEmitter<void>();

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(2000)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTask']) {
      if (this.selectedTask) {
        this.form.setValue({
          title: this.selectedTask.title,
          description: this.selectedTask.description ?? '',
        });
      } else {
        this.form.reset({ title: '', description: '' });
      }
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      title: this.form.getRawValue().title.trim(),
      description: this.form.getRawValue().description.trim(),
    };

    if (this.selectedTask) {
      this.updateTask.emit(payload);
      return;
    }

    this.createTask.emit(payload);
    this.form.reset({ title: '', description: '' });
  }
}

