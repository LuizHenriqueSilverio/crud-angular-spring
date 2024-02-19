import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Course } from '../../model/course';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss']
})
export class CoursesListComponent {

  @Input() courses: Course[] = [];
  @Output() add = new EventEmitter(false);
  @Output() edit = new EventEmitter(false);
  @Output() delete = new EventEmitter(false);

  readonly displayedColumns: string[] = ['name', 'category', 'actions'];

  constructor() { }

  ngOnInit(): void {
  }

  onAdd(): void {
    this.add.emit(true);
  }

  onEdit(course: Course): void {
    this.edit.emit(course);
  }

  onDelete(course: Course): void {
    this.delete.emit(course);
  }
}
