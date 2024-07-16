import { Pipe, PipeTransform } from '@angular/core';
import { Tags } from '@app/interfaces/tags';

@Pipe({
  name: 'formatTags'
})
export class FormatTagsPipe implements PipeTransform {

  transform(value: Tags): string {
    if (!value) {
      return '';
    }
    // Replace underscores with spaces
    return value.replace(/_/g, ' ');
  }

}
