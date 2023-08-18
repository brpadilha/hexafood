import { forwardRef, Module } from '@nestjs/common';
import { ProdutosController } from './adapter/driver/produtos.controller';
import { ProdutosRepository } from './adapter/driven/infraestructure/produtos.repository';
import { IProdutosRepository } from './core/application/ports/repositories/produtos.repository';
import { ProdutosService } from './core/application/services/produtos.service';
import { CategoriasService } from './core/application/services/categorias.service';
import { CategoriasController } from './adapter/driver/categorias.controller';
import { ICategoriasRepository } from './core/application/ports/repositories/categorias.repository';
import { CategoriasRepository } from './adapter/driven/infraestructure/categorias.repository';
import { APP_FILTER } from '@nestjs/core';
import { ValidationFilter } from './adapter/driven/filters/validation.filter';
import { PedidosRepository } from './adapter/driven/infraestructure/pedidos.repository';
import { IPedidosRepository } from './core/application/ports/repositories/pedidos.repository';
import { PedidosService } from './core/application/services/pedidos.service';
import { PedidosController } from './adapter/driver/pedidos.controller';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NovoPedidoListener } from './core/application/listeners/novo-pedido.listener';
import { PagamentoModule } from 'src/pagamento/pagamento.module';
import { IdentificacaoModule } from 'src/identificacao/identificacao.module';
import { FindClienteUseCase } from 'src/identificacao/core/application/usecases/cliente/find.cliente.usecase';

@Module({
  imports: [ forwardRef(() => PagamentoModule), IdentificacaoModule],
  controllers: [ProdutosController, CategoriasController, PedidosController],
  providers: [
    { provide: IProdutosRepository, useClass: ProdutosRepository },
    { provide: ICategoriasRepository, useClass: CategoriasRepository },
    { provide: IPedidosRepository, useClass: PedidosRepository },
    {
      provide: APP_FILTER,
      useClass: ValidationFilter,
    },
    {
      provide: 'EventEmitter',
      useExisting: EventEmitter2,
    },
    ProdutosService,
    CategoriasService,
    PedidosService,
    NovoPedidoListener,
    FindClienteUseCase
  ],
  exports: [PedidosService],
})
export class PedidoModule {}
