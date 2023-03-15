import { IStuff } from './stuff.type';
import { DBStuff } from './stuff.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Dto } from '../abstract/abstract.dto';

export class Stuff extends Dto<DBStuff> implements IStuff {
  @ApiProperty({ example: '29e051de-91eb-460c-a470-febbc4fb8816' })
  id!: string;
  @ApiProperty({ example: '123456-654321' })
  idStuffProduct!: string;
  @ApiProperty({ example: 123456 })
  idStuff!: number;
  @ApiProperty({ example: 654321 })
  idProduct!: number;
  @ApiProperty({ example: 0 })
  idProductAttribute?: number;
  @ApiProperty({ example: '123456-7-ab' })
  uniqueProductId?: string;
  @ApiProperty({ example: 0 })
  quantity?: number;
}
