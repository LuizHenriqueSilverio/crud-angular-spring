import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { catchError, tap } from 'rxjs';
import { FormUtilsService } from 'src/app/shared/form/form-utils.service';

import { Course } from '../../model/course';
import { Lesson } from '../../model/lesson';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent {

    form!: FormGroup;

    constructor(
      private formBuilder: NonNullableFormBuilder,
      private service: CoursesService,
      private _snackBar: MatSnackBar,
      private location: Location,
      private route: ActivatedRoute,
      public formUtils: FormUtilsService
      ) {

    }

    ngOnInit(): void {
      const course: Course = this.route.snapshot.data['course'];
      this.form = this.formBuilder.group({
        _id: [course._id],
        name: [course.name, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        category: [course.category , [Validators.required]],
        lessons: this.formBuilder.array(this.retrieveLessons(course), Validators.required)
      });
    }

    private retrieveLessons(course: Course) {
      const lessons = [];
      if(course?.lessons) {
        course.lessons.forEach(lesson => {
          lessons.push(this.createLesson(lesson));
        });
      }else {
        lessons.push(this.createLesson());
      }
      return lessons;
    }

    private createLesson(lesson: Lesson = {id: '', name: '', youtubeUrl: ''}) {
      return this.formBuilder.group({
        id: [lesson.id],
        name: [lesson.name, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        youtubeUrl: [lesson.youtubeUrl, [Validators.required, Validators.minLength(10), Validators.maxLength(20)]]
      });
    }

    getLessonsFromArray() {
      return (<UntypedFormArray>this.form.get('lessons')).controls;
    }

    addNewLesson() {
      const lessons = this.form.get('lessons') as UntypedFormArray;
      lessons.push(this.createLesson());
    }

    removeLesson(index: number): void {
      const lessons = this.form.get('lessons') as UntypedFormArray;
      lessons.removeAt(index);
    }

    onSubmit(): void {
      if(this.form.valid) {
        this.service.save(this.form.value)
        .pipe(
          tap(result => this.onSuccess()),
          catchError(error => {
            this.onError();
            return ([]);
          })
        ).subscribe();
      }else {
        this.formUtils.validateAllFormFields(this.form);
      }
    }

    onCancel(): void {
      this.location.back();
    }

    private onSuccess(): void {
      this._snackBar.open('Curso salvo com sucesso', 'Fechar', {
        duration: 5000,
      });
      this.location.back();
    }

    private onError(): void {
      this._snackBar.open('Erro ao salvar o curso', 'Fechar')
    }

}
