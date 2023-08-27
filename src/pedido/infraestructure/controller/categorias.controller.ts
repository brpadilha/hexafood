import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindAllCategoriaUseCase } from 'src/pedido/core/application/usecases/categoriaUseCases/find.all.categoria.usecase';


@ApiTags('categorias')
@Controller('categorias')
export class CategoriasController {
  constructor(
       private readonly findAllCategoriaUseCase: FindAllCategoriaUseCase
    ) {}

  @Get()
  findAll() {
    return this.findAllCategoriaUseCase.execute();
  }

  // @Post()
  // create(@Body() createCategoriaDto: CategoriaDto) {
  //   return this.CategoriasService.create(createCategoriaDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.CategoriasService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCategoriaDto: CategoriaDto) {
  //   return this.CategoriasService.update(+id, updateCategoriaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.CategoriasService.remove(+id);
  // }
}
