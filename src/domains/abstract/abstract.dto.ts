import { ApiProperty } from '@nestjs/swagger';
import { Dtos } from '../dtos';
import { Entities } from '../entities';

const toDto = <T extends Entities>(obj: T): Dtos => {
  for (const field in obj) {
    if (field.indexOf('_') !== -1) {
      const newName = field.replace(/(_\w)/g, (k) => k[1].toUpperCase());
      obj = { ...obj, [newName]: obj[field] };
      delete obj[field];
    }
  }
  return obj as unknown as Dtos;
};

export class Dto<T extends Entities> {
  @ApiProperty({ example: '29e051de-91eb-460c-a470-febbc4fb8816' })
  id!: string;

  constructor(data: T) {
    Object.assign(this, toDto(data));
  }
}
