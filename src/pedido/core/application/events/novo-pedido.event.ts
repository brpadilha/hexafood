import { Pedido } from '../../domain/entity/pedido.entity';
import { OutputPedidoDTO, PedidoDTO } from '../usecases/pedidoUseCase/pedido.dto';

export class NovoPedidoEvent {
  constructor(public pedido: Pedido) {}
}
