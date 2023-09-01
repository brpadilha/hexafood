import { Inject } from '@nestjs/common';

import { MERCADO_PAGO_CLIENT } from '../../ports/clients/mercadopago.client';
import { IPagamentosClientRepository } from 'src/pagamento/core/domain/pagamento/repository/pagamentos-client.repository';
import { PagamentosException } from '../../exceptions/pagamentos.exception';
import { PagamentoDto } from './pagamentoDto';
import { IPagamentosRepository, PAGAMENTOS_REPOSITORY } from 'src/pagamento/core/domain/pagamento/repository/pagamentos.repository';
import { FindPagamentoUseCase } from './find.pagamento.usecase';

export class UpdatePagamentoUseCase {
  constructor(
    @Inject(PAGAMENTOS_REPOSITORY)
    private pagamentosRepository: IPagamentosRepository,

    @Inject(MERCADO_PAGO_CLIENT)
    private pagamentosClient: IPagamentosClientRepository,
    private findPagamentoByIdUseCase: FindPagamentoUseCase
  ) { }

  async execute(data: PagamentoDto) {
    const pedido = await this.findPagamentoByIdUseCase.execute(data.id);
    if (!pedido) {
      throw new PagamentosException('O Pedido informado não existe.');
    }
    // listener de pagamento
    // atualizar pagamento
    let StatusPedido = 'pendente';
    let listener = 'APROVADO'
    if(listener !== 'APROVADO') {
      StatusPedido = 'reprovado'
    }else {
      StatusPedido = 'aprovado'
    }
    return this.pagamentosRepository.update(data.id, StatusPedido)
  }
}


