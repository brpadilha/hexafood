import { Injectable } from '@nestjs/common';

import { CreateCategoriaDto } from '../dto/categorias/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/categorias/update-categoria.dto';

@Injectable()
export class CategoriasService {
  create(createCategoriaDto: CreateCategoriaDto) {
    return 'This action adds a new categoria';
  }

  findAll() {
    return `This action returns all Categorias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoria`;
  }

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return `This action updates a #${id} categoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoria`;
  }
}