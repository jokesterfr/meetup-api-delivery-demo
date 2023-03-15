import { ApiProperty } from '@nestjs/swagger';
import { Stuff } from './stuff.dto';
export class StuffQueryFilter {
  @ApiProperty({ required: false })
  idStuffProduct?: string;
  @ApiProperty({
    required: false,
    description: 'idStuffStart, idStuffEnd',
  })
  idStuff?: number;
  idStuffStart?: number;
  idStuffEnd?: number;
  @ApiProperty({
    required: false,
    description: 'also available: idProductStart, idProductEnd',
  })
  idProduct?: number;
  idProductStart?: number;
  idProductEnd?: number;
  @ApiProperty({
    required: false,
    description:
      'also available: idProductAttributeStart, idProductAttributeEnd',
  })
  idProductAttribute?: number;
  idProductAttributeStart?: number;
  idProductAttributeEnd?: number;
  @ApiProperty({ required: false })
  uniqueProductId?: string;
  @ApiProperty({
    required: false,
    description: 'also available: quantityStart, quantityEnd',
  })
  quantity?: number;
  quantityStart?: number;
  quantityEnd?: number;
  @ApiProperty({
    type: 'string',
    required: false,
    description: 'any key of stuff',
  })
  sort?: keyof Stuff;
}
