import { forwardRef, Module } from '@nestjs/common';
import { PagamentosController } from './infraestructure/controller/pagamentos.controller';
import { PagamentosService } from './core/application/services/pagamentos.service';
import { PAGAMENTOS_REPOSITORY } from './core/domain/pagamento/repository/pagamentos.repository';
import { PagamentosRepository } from './infraestructure/gateway/pagamentos.repository';
import {
  MERCADO_PAGO_CLIENT,
  MercadoPagoClient,
} from './core/application/ports/clients/mercadopago.client';
import { PedidoModule } from 'src/pedido/pedido.module';
import { ValidationFilter } from './infraestructure/filter/validation.filter';
import { APP_FILTER } from '@nestjs/core';
import { IdentificacaoModule } from 'src/identificacao/identificacao.module';
import { FindPedidoByIdUseCase } from 'src/pedido/core/application/usecases/pedidoUseCase/find.pedido.by.id.usecase';

@Module({
  imports: [ forwardRef(() => PedidoModule), forwardRef(() => IdentificacaoModule)],
  controllers: [PagamentosController],
  providers: [
    { provide: PAGAMENTOS_REPOSITORY, useClass: PagamentosRepository },
    { provide: MERCADO_PAGO_CLIENT, useClass: MercadoPagoClient },
    { provide: APP_FILTER, useClass: ValidationFilter },
    {
      provide: FindPedidoByIdUseCase,
      useClass: FindPedidoByIdUseCase,
    },
    PagamentosService,
  ],
  exports: [PagamentosService], // Exportando o serviço para uso em outros módulos
})
export class PagamentoModule {}
