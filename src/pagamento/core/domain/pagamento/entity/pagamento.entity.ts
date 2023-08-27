import { Cliente } from '../../../../../identificacao/core/domain/cliente/entity/cliente.entity';
import { Pedido } from 'src/pedido/core/domain/entity/pedido.entity';

export class Pagamento {
  id?: number;
  id_cliente?: number;
  id_pedido: number;
  id_transacao: bigint;
  descricao: string;
  plataforma: string;
  valor: number;
  updatedAt?: Date;
  createdAt?: Date;
  cliente?: Cliente;
  pedido?: Pedido;
}
