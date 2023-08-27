import { Inject } from '@nestjs/common';
import { InputCategoriaDto } from './categoria.dto';
import { ICategoriasRepository } from 'src/pedido/core/domain/repository/categorias.repository';
import { Categoria } from 'src/pedido/core/domain/entity/categoria.entity';
import { CategoriaException } from '../../exceptions/categoria.exception';

export class CreateCategoriaUseCase {
  constructor(
    @Inject('ICategoriasRepository')
    private categoriasRepository: ICategoriasRepository
    ) {}

  async create(createCategoriaDto: InputCategoriaDto) {
    
    const exists = await this.categoriasRepository.existsByName(createCategoriaDto.nome);
    if (exists) {
      throw new CategoriaException('Categoria já cadastrada');
    }

    const categoria = await this.categoriasRepository.create(
      new Categoria(createCategoriaDto.nome),
    );

    return categoria;
  }
}

