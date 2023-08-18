import { Injectable, Inject } from '@nestjs/common';
import { Item, Pedido } from '../../domain/entities/pedido.entity';
import { IPedidosRepository } from './../ports/repositories/pedidos.repository';
import { PedidoDTO } from 'src/pedido/adapter/driven/dto/pedido.dto';
import { ProdutosService } from './produtos.service';
import EventEmitter from 'events';
import { NovoPedidoEvent } from '../events/novo-pedido.event';
import { StatusPedido } from '../../domain/enum/status-pedido.enum';
import { PedidoException } from '../exceptions/pedido.exception';
import { FindClienteUseCase } from 'src/identificacao/core/application/usecases/cliente/find.cliente.usecase';

@Injectable()
export class PedidosService {
  constructor(
    @Inject(IPedidosRepository)
    private pedidosRepository: IPedidosRepository,
    private produtosService: ProdutosService,
    private findClienteUseCase: FindClienteUseCase,
    @Inject('EventEmitter')
    private eventEmitter: EventEmitter,
  ) {}

  async createNewPedido(pedidoDto: PedidoDTO) {

    const pedido: Pedido = await this.validarCamposPedido(pedidoDto);

    const { id } = await this.pedidosRepository.create(pedido);
    pedido.id = id;
    console.log('Novo pedido criado: ', pedido);
    this.eventEmitter.emit('novo.pedido', new NovoPedidoEvent(pedido));

    return pedido;
  }

  async listAllPedidos(): Promise<PedidoDTO[]> {
    const pedidos = await this.pedidosRepository.findAll();
    return pedidos.map((pedido) => ({
      id_cliente: pedido.id_cliente,
      status: pedido.status.toString(),
      valor_total: pedido.valor_total,
      itens: pedido.itens.map((item) => ({
        quantidade: item.quantidade,
        valor: item.valor,
        id_produto: item.id_produto,
      })),
    }));
  }


  consultarPedidosPendentes(): PedidoDTO[] | PromiseLike<PedidoDTO[]> {
    return this.pedidosRepository.findAll(StatusPedido.RECEBIDO);
  }
  async iniciarPreparacao(id: number): Promise<Pedido> {
    const pedido = await this.pedidosRepository.findById(id);
    pedido.status = StatusPedido.EM_PREPARACAO;
    return this.pedidosRepository.update(id, pedido);
  }
  async finalizarPreparacao(id: number): Promise<Pedido> {
    const pedido = await this.pedidosRepository.findById(id);
    pedido.status = StatusPedido.PRONTO;
    return this.pedidosRepository.update(id, pedido);
  }
  async finalizarPedido(id: number): Promise<Pedido> {
    const pedido = await this.pedidosRepository.findById(id);
    pedido.status = StatusPedido.FINALIZADO;
    return this.pedidosRepository.update(id, pedido);
  }

  findById(id: number) {
    return this.pedidosRepository.findById(id);
  }

  private async validarCamposPedido (pedidoDto: PedidoDTO): Promise<Pedido> {
    const productIds = pedidoDto.itens.map((item) => item.id_produto);
    const produtos = await this.produtosService.findProdutosByIds(productIds);

    const pedido = new Pedido();

    pedido.id_cliente = pedidoDto.id_cliente === 0 ? null : pedidoDto.id_cliente;

    if (pedido.id_cliente > 0) {
      const cliente = await this.findClienteUseCase.execute(pedidoDto.id_cliente);
      if(!cliente){
        throw new PedidoException(`Cliente não cadastrado. Id_cliente: ${pedidoDto.id_cliente}`);
      }
      pedido.cliente = cliente;
    }

    pedido.itens = pedidoDto.itens.map((item) => {
      const produto = produtos.find((p) => p.id === item.id_produto);
      if (!produto) {
        throw new PedidoException(`Produto não cadastrado. id_produto: ${item.id_produto}`);
      }
      return {
        quantidade: item.quantidade,
        valor: produto.valor,
        id_produto: item.id_produto,
      };
    });

    pedido.valor_total = this.calculaValorTotal(pedido.itens);
    
    return pedido;
  }

  private calculaValorTotal(itens: Item[]): number {
    return itens.reduce(
      (total, item) => total + item.quantidade * item.valor,
      0,
    );
  }
  consultarPedidoPorCodigo(codigo_pedido: string) {
    return this.pedidosRepository.findByCodigo(codigo_pedido);
  }
}
