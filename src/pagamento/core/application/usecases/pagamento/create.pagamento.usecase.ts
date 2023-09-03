import { Inject } from '@nestjs/common';

import { MERCADO_PAGO_CLIENT } from '../../ports/clients/mercadopago.client';
import { IPagamentosClientRepository } from 'src/pagamento/core/domain/pagamento/repository/pagamentos-client.repository';
import { FindPedidoByIdUseCase } from 'src/pedido/core/application/usecases/pedidoUseCase/find.pedido.by.id.usecase';
import { PagamentosException } from '../../exceptions/pagamentos.exception';
import { CreatePagamentoDto } from './pagamentoDto';
import { IPagamentosRepository, PAGAMENTOS_REPOSITORY } from 'src/pagamento/core/domain/pagamento/repository/pagamentos.repository';
import { Pagamento } from 'src/pagamento/core/domain/pagamento/entity/pagamento.entity';
  
export class CreatePagamentoUseCase {
  constructor(
    @Inject(PAGAMENTOS_REPOSITORY)
    private pagamentosRepository: IPagamentosRepository,

    @Inject(MERCADO_PAGO_CLIENT)
    private pagamentosClient: IPagamentosClientRepository,
    private findPedidoByIdUseCase: FindPedidoByIdUseCase 
  ) {}

  async execute(data: CreatePagamentoDto) {
    const description = `Hexafood - pedido ${data.id_pedido} - MercadoPago`;
    const pedido = await this.findPedidoByIdUseCase.findById(data.id_pedido);
    if (!pedido) {
      throw new PagamentosException('O Pedido informado não existe.');
    }
    const transacao = await this.pagamentosClient.createPagamento({...data, status: 'pendente'});

    return this.pagamentosRepository.createPagamento(
      new Pagamento(data.id_cliente, data.id_pedido, transacao.id, description, 'mercado_pago', data.valor, 'pendente')
    )
  }
}


