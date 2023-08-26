import { PrismaClient } from '@prisma/client';
import { Produto } from '../../../core/domain/entities/produto.entity';
import { ProdutoDto } from '../dto/produto.dto';
import { IProdutosRepository } from './../../../core/application/ports/repositories/produtos.repository';

export class ProdutosRepository implements IProdutosRepository {
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

  async createManyProdutos(produtos: ProdutoDto[]) {
    return this.prisma.produto.createMany({
      data: produtos,
    });
  }

  async findAll(): Promise<Produto[] | null> {
    var categorias = await this.prisma.produto.findMany();
    return categorias;
  };

  async findByIdCategoria(idCategoria: number) {
    return this.prisma.produto.findMany({
      where: {
        id_categoria: Number(idCategoria),
      },
    });
  }

  async update(id: number, produto: ProdutoDto): Promise<Produto | null> {
    const item = this.prisma.produto.findUnique({
      where: { id },
    });

    return this.prisma.produto.update({
      where: {
        id,
      },
      data: {
        nome: produto.nome,
        valor: produto.valor,
        descricao: produto.descricao,
        imagem: produto.imagem,
        id_categoria: produto.id_categoria,
      },
    });
  }

  async remove(id: number): Promise<Produto | null> {
    return this.prisma.produto.delete({
      where: {
        id,
      },
    });
  }

  async findByIds(ids: number[]): Promise<Produto[] | null> {
    return this.prisma.produto.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
