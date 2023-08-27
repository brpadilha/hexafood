import { Inject, Injectable } from '@nestjs/common';
import { NovoPedidoEvent } from '../../../core/application/events/novo-pedido.event';
import { OnEvent } from '@nestjs/event-emitter';
import { PagamentosService } from '../../../../pagamento/core/application/services/pagamentos.service';
import { StatusPedido } from '../../../core/domain/enum/status-pedido.enum';
import { IPedidosRepository } from '../../../core/domain/repository/pedidos.repository';
import { CreatePedidoUseCase } from 'src/pedido/core/application/usecases/pedidoUseCase/create.pedido.usecase';
import { CreatePagamentoUseCase } from 'src/pagamento/core/application/usecases/pagamento/create.pagamento.usecase';

@Injectable()
export class NovoPedidoListener {
  constructor(
    @Inject(IPedidosRepository)
    private pedidosRepository: IPedidosRepository,
    private pagamentosService: PagamentosService,

  ) {}

  @OnEvent('novo.pedido')
  async handle(event: NovoPedidoEvent) {
    const pedido = event.pedido;
    const pagamentoDto = {
      valor: pedido.valor_total,
      id_pedido: pedido.id,
      cliente: null,
    };

    if (pedido.cliente) {
      pagamentoDto.cliente = {
        id: pedido.cliente.id,
        nome: pedido.cliente.nome,
        cpf: pedido.cliente.cpf,
      };
    }
    try {
      const pagamento = await this.pagamentosService.createPagamento(
        pagamentoDto,
      );
      console.log('Pagamento criado: ', pagamento);
      pedido.status = StatusPedido.RECEBIDO;
      await this.pedidosRepository.update(pedido.id, pedido);
      console.log('Pedido atualizado: ', pedido);
    } catch (error) {
      console.log(error);
      pedido.status = StatusPedido.CANCELADO;
      await this.pedidosRepository.update(pedido.id, pedido);
      console.log('Pedido atualizado: ', pedido);
    }
  }
}
