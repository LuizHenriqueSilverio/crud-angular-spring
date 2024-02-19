import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'Frontend': return 'code';
      case 'Backend': return 'data_object';
      case 'FullStack': return 'dvr';
    }
    return 'code';
  }

}
