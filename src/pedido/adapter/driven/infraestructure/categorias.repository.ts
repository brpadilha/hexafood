import { PrismaClient } from '@prisma/client';
import { Categoria } from '../../../core/domain/entities/categoria.entity';
import { ICategoriasRepository } from '../../../core/application/ports/repositories/categorias.repository';
import { CategoriaDto } from '../dto/categoria.dto';

export class CategoriasRepository implements ICategoriasRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL, 
        },
      },
    });
  }
  
  async create(createCategoriaDto: CategoriaDto): Promise<Categoria>{
    return this.prisma.categoria.create({
      data: {
        nome: createCategoriaDto.name
      },
    })
  };

  async findOne(id : number): Promise<Categoria | null> {
    return this.prisma.categoria.findUnique({
      where: { id },
    });
  };

  async findAll(): Promise<Categoria[] | null> {
    var categorias = await this.prisma.categoria.findMany();
    return categorias;
  };

  async update(id: number, updateCategoriaDto: CategoriaDto): Promise<Categoria | null> {
    var item = this.prisma.categoria.findUnique({
      where: { id },
    });

    return this.prisma.categoria.update(
      {
        where: {
          id
        },
        data: {
          nome: updateCategoriaDto.name,
        },
      }
    )
  };

  async remove(id: number): Promise<Categoria | null> {
    return this.prisma.categoria.delete({
      where: {
        id
      },
    })
  };
}



