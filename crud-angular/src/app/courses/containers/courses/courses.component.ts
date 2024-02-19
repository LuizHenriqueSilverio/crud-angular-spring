import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, first, Observable, of, tap } from 'rxjs';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';

import { Course } from '../../model/course';
import { CoursesService } from '../../services/courses.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {

  courses$: Observable<Course[]> | null = null;


  constructor(
    private coursesService : CoursesService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.refresh();
  }

  ngOnInit(): void {
  }

  onError(errorMsg : string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }

  refresh(): void {
    this.courses$ = this.coursesService.listAll().pipe(
      first(),
      catchError(error => {
        this.onError('Erro ao carregar cursos.');
        return of([]);
      })
    );
  }

  onAdd(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEdit(course: Course): void {
    this.router.navigate(['edit', course._id], { relativeTo: this.route });
  }

  onRemove(course: Course): void {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Deseja realmente remover o curso?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result === true){
        this.coursesService.remove(course._id)
        .pipe(
          first(),
          tap(() =>  this.snackBar.open('Curso removido com sucesso.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          })),
        catchError(error => {
          this.onError('Erro ao remover curso.');
          return of({});
        })
        ).subscribe(() => this.refresh());
      }
    });
  }
}
