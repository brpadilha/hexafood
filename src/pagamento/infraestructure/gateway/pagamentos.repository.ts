import { PrismaClient } from '@prisma/client';
import { IPagamentosRepository } from '../../core/domain/pagamento/repository/pagamentos.repository';
import { Pagamento } from '../../core/domain/pagamento/entity/pagamento.entity';
import { PagamentoFactory } from 'src/pagamento/core/domain/pagamento/factory/pagamento.factory';

export class PagamentosRepository implements IPagamentosRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
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
        status: data.status,
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

  async findById(id: number): Promise<Pagamento | null> {
    const pagamento = await this.prisma.pagamento.findUnique({ where: { id } })
    if (pagamento) {
      console.log(pagamento)
      return PagamentoFactory.create(pagamento);
    }
      return null;
    // .then((result) => {
    //   if (result) {
    //     const pagamento = PagamentoFactory.create(result);
    //     pagamento.createdAt = result.createdAt;
    //     pagamento.updatedAt = result.updatedAt;
    //     return pagamento;
    //   }
    //   return null;
    // });
  }

  async remove(id: number) {
    return this.prisma.pagamento.delete({
      where: {
        id,
      },
    });
    
  }

  async update(id: number, status: string) {
    return this.prisma.pagamento.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
}
