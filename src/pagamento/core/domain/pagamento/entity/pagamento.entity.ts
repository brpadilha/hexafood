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

  constructor(id_cliente: number, id_pedido: number, id_transacao: bigint, descricao: string, plataforma: string, valor: number) {
    this.id_cliente = id_cliente;
    this.id_pedido = id_pedido;
    this.id_transacao = id_transacao;
    this.descricao = descricao;
    this.plataforma = plataforma;
    this.valor = valor;
  }

  validate() {
    if (!this.id_cliente) {
      throw new Error('O id_cliente não pode ser vazio');
    }
    if (!this.id_pedido) {
      throw new Error('O id_pedido não pode ser vazio');
    }
    if (!this.id_transacao) {
      throw new Error('O id_transacao não pode ser vazio');
    }
    if (!this.descricao) {
      throw new Error('O descricao não pode ser vazio');
    }
    if (!this.plataforma) {
      throw new Error('O plataforma não pode ser vazio');
    }
    if (!this.valor) {
      throw new Error('O valor não pode ser vazio');
    }
  }
}


