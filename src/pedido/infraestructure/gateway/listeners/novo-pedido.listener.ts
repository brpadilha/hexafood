import { Inject, Injectable } from '@nestjs/common';
import { NovoPedidoEvent } from '../../../core/application/events/novo-pedido.event';
import { OnEvent } from '@nestjs/event-emitter';
import { StatusPedido } from '../../../core/domain/enum/status-pedido.enum';
import { CreatePagamentoUseCase } from 'src/pagamento/core/application/usecases/pagamento/create.pagamento.usecase';
import { UpdatePedidoUseCase } from 'src/pedido/core/application/usecases/pedidoUseCase/update.pedido.usecase';
import { SqsQueueService } from '../sqs/sqs-queue.service';
import { IQueueService } from '../../queue/queue.service';

@Injectable()
export class NovoPedidoListener {
  constructor(
    private createPagamentoUseCase: CreatePagamentoUseCase,
    @Inject('IQueueService')
    private queueService: IQueueService
  ) { }

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

    this.queueService.sendMessage(
      process.env.AWS_SQS_NOVO_PEDIDO_QUEUE_NAME,
      JSON.stringify(pedido)
    );

    return this.createPagamentoUseCase.execute(
      pagamentoDto,
    );
  }
}
