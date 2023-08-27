import { PrismaClient } from '@prisma/client';
import { IPagamentosRepository } from '../../core/domain/pagamento/repository/pagamentos.repository';
import { Pagamento } from '../../core/domain/pagamento/entity/pagamento.entity';
import { PagamentoDto } from '../../core/application/usecases/pagamento/pagamentoDto';

export class PagamentosRepository implements IPagamentosRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  createPagamento(data: Pagamento): Promise<Pagamento> {
    return this.prisma.pagamento.create({
      data: {
        id_pedido: data.id_pedido,
        id_transacao: data.id_transacao,
        descricao: data.descricao,
        plataforma: data.plataforma,
        valor: data.valor,
        id_cliente: data.id_cliente || null,
      },
    });
  }

  findAll(): Promise<Pagamento[]> {
    return this.prisma.pagamento.findMany().then((results) => {
      return results.map((result) => {
        const pagamento = new Pagamento();
        pagamento.id = result.id;
        pagamento.id_cliente = result.id_cliente;
        pagamento.valor = result.valor;
        pagamento.id_pedido = result.id_pedido;
        pagamento.id_transacao = result.id_transacao;
        pagamento.descricao = result.descricao;
        pagamento.plataforma = result.plataforma;
        pagamento.createdAt = result.createdAt;
        pagamento.updatedAt = result.updatedAt;
        return pagamento;
      });
    });
  }

  findById(id: number): Promise<Pagamento | null> {
    return this.prisma.pagamento.findFirst({ where: { id } }).then((result) => {
      if (result) {
        const pagamento = new Pagamento();
        pagamento.id = result.id;
        pagamento.id_cliente = result.id_cliente;
        pagamento.valor = result.valor;
        pagamento.id_pedido = result.id_pedido;
        pagamento.id_transacao = result.id_transacao,
        pagamento.descricao = result.descricao;
        pagamento.plataforma = result.plataforma;
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
