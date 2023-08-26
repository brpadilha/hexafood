import { PrismaClient } from '@prisma/client';
import { IPagamentosRepository } from '../../core/domain/pagamento/repository/pagamentos.repository';
import { Pagamento } from '../../core/domain/pagamento/entity/pagamento.entity';
import { PagamentoFactory } from 'src/pagamento/core/domain/pagamento/factory/pagamento.factory';

export class PagamentosRepository implements IPagamentosRepository {
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
  async createPagamento(data: Pagamento): Promise<Pagamento> {
    const createdPagamento = this.prisma.pagamento.create({
      data: {
        id_pedido: data.id_pedido,
        id_transacao: data.id_transacao,
        descricao: data.descricao,
        plataforma: data.plataforma,
        valor: data.valor,
        id_cliente: data.id_cliente || null,
      },
    });

    return PagamentoFactory.create(createdPagamento);
  }

  findAll(): Promise<Pagamento[]> {
    return this.prisma.pagamento.findMany().then((results) => {
      return results.map((result) => {
        const pagamento = PagamentoFactory.create(result);
        pagamento.createdAt = result.createdAt;
        pagamento.updatedAt = result.updatedAt;
        return pagamento;
      });
    });
  }

  findById(id: number): Promise<Pagamento | null> {
    return this.prisma.pagamento.findFirst({ where: { id } }).then((result) => {
      if (result) {
        const pagamento = PagamentoFactory.create(result);
        pagamento.createdAt = result.createdAt;
        pagamento.updatedAt = result.updatedAt;
        return pagamento;
      }
      return null;
    });
  }

  async remove(id: number) {
    return this.prisma.pagamento.delete({
      where: {
        id,
      },
    });
    
  }
}
