
import { IPedidosRepository } from "src/pedido/core/domain/repository/pedidos.repository";
import { Inject } from '@nestjs/common';
import { StatusPedido } from "src/pedido/core/domain/enum/status-pedido.enum";
import { Pedido } from "src/pedido/core/domain/entity/pedido.entity";
import { FindPedidoByIdUseCase } from "./find.pedido.by.id.usecase";

export class IniciarPreparacaoPedidoUseCase {
    constructor(
      @Inject(IPedidosRepository)
      private pedidosRepository: IPedidosRepository,
      private findPedidoByIdUseCase: FindPedidoByIdUseCase,
    ) {}
  
async execute(id: number): Promise<Pedido> {
    const pedido = await this.findPedidoByIdUseCase.findById(id);
   console.log("chegou aqui");

    pedido.status = StatusPedido.EM_PREPARACAO;
    return this.pedidosRepository.update(id, pedido);
  }

  // converterId(id: string ){
  //   const idAsNumber = parseInt(id, 10);
  //   if (isNaN(idAsNumber)) {
  //     throw new BadRequest(`Invalid id: ${id}`);
  //   }
  // }
}

