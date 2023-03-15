import {
  Controller,
  Get,
  Header,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Stuff } from './stuff.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { StuffQueryFilter } from './stuff-query-filter.dto';

@ApiTags('Stuff')
@UseGuards(AuthGuard)
@ApiSecurity('oauthServer')
@ApiExtraModels(Stuff)
@Controller('/:shopId/stuff')
export class StuffController {
  @ApiOperation({ summary: 'getPaginatedItems' })
  @ApiParam({
    name: 'shopId',
    description: 'd47efa7b-07f1-469b-8c8a-4473f632ed38',
  })
  @ApiQuery({ name: 'offset', description: 'a number >= 0' })
  @ApiQuery({ name: 'limit', description: 'a number >= 1' })
  @ApiQuery({ type: StuffQueryFilter })
  @ApiOkResponse({
    schema: {
      properties: {
        kind: {
          type: 'string',
          example: 'stuff',
        },
        total: {
          type: 'number',
          example: 10,
        },
        items: {
          type: 'array',
          items: { $ref: getSchemaPath(Stuff) },
        },
        pagination: {
          type: 'object',
          properties: {
            offset: { type: 'number', example: 0 },
            limit: { type: 'number', example: 10 },
          },
        },
        links: {
          type: 'object',
          properties: {
            first: {
              type: 'string',
              example: `/0192361a-dc21-409b-90a8-caf86efea948/stuff?offset=0&limit=10`,
            },
            last: {
              type: 'string',
              example: `/0192361a-dc21-409b-90a8-caf86efea948/stuff?offset=3000&limit=10`,
            },
            prev: {
              type: 'string',
              example: `/0192361a-dc21-409b-90a8-caf86efea948/stuff?offset=1910&limit=10`,
            },
            next: {
              type: 'string',
              example: `/0192361a-dc21-409b-90a8-caf86efea948/stuff?offset=1930&limit=10`,
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  // Do not forget to valide input data... in this meetup talk we don't dig further
  // @CheckIn(validateStuff.queryString)
  // @CheckOut(validateStuff.paginatedItems)
  // @QueryFilter('stuff-query-filter')
  @Header('Cache-Control', 'no-store')
  @Get()
  getPaginatedItems(
    @Param('shopId') shopId: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('filter') filter: IQueryFilter,
  ) {
    return {
      shopId,
      type: 'stuff',
      offset: +offset,
      limit: +limit,
      filter,
    };
  }

  @ApiOperation({ summary: 'getSingleItem' })
  @ApiParam({
    name: 'shopId',
    description: '0192361a-dc21-409b-90a8-caf86efea948',
  })
  @ApiParam({
    name: 'shopContentId',
    description: '0192361a-dc21-409b-90a8-caf86efea948',
  })
  @ApiOkResponse({
    schema: {
      properties: {
        kind: {
          type: 'string',
          example: 'stuff',
        },
        item: {
          type: 'object',
          $ref: getSchemaPath(Stuff),
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Content not found in database',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Header('Cache-Control', 'no-store')
  @Get(':shopContentId')
  getSingleItem(
    @Param('shopId') shopId: string,
    @Param('shopContentId') shopContentId: string,
  ) {
    // mock for the example
    return {
      id: shopId,
      idStuffProduct: '123456-654321',
      idStuff: +shopContentId,
      idProduct: 654321,
      idProductAttribute: 0,
      uniqueProductId: '123456-7-ab',
      quantity: 0,
    } as Stuff;
  }
}

export interface IQueryFilter {
  [key: string]: any;
}
