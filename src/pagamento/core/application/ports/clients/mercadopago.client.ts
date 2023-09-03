import { Inject, Injectable } from '@nestjs/common';
import {
  IPagamentosRepository,
  PAGAMENTOS_REPOSITORY,
} from '../../../domain/pagamento/repository/pagamentos.repository';

import mercadopago from '../../../../../mocks/mercadoPagoMockService';
import {
  CreatePagamentoDto,
} from '../../usecases/pagamento/pagamentoDto';
import { Pagamento } from 'src/pagamento/core/domain/pagamento/entity/pagamento.entity';

export const MERCADO_PAGO_CLIENT = 'MercadoPagoClient';

@Injectable()
export class MercadoPagoClient implements IPagamentosRepository {
  constructor(
    @Inject(PAGAMENTOS_REPOSITORY)
    private pagamentosRepository: IPagamentosRepository,
  ) {
    mercadopago.configurations.setAccessToken('some-access-token');
  }

  async createPagamento({ valor, id_pedido, cliente }: CreatePagamentoDto) {
    const descricao = `Hexafood - pedido ${id_pedido} - MercadoPago`;
    const { nome, cpf } = cliente;
    const nameParts = nome.split(' ');

    const payer =
      (nome) || cpf
        ? {
            ...(cpf &&
              ({ identification: { type: 'CPF', number: cpf } } as const)),
            ...(nome && {
              first_name: nameParts[0],
              last_name:
                nameParts.length > 1 ? nameParts[nameParts.length - 1] : '',
            }),
          }
        : null;

    return await mercadopago.payment.create({
      transaction_amount: valor,
      description: descricao,
      payment_method_id: 'pix',
      ...(payer && { payer }),
    });

    // const pagamento = new Pagamento(
    //   cliente.id,
    //   id_pedido,
    //   Number(transaction.id),
    //   descricao,
    //   'MercadoPago',
    //   valor,
    //   transaction.status,
    // )
    
    // this.pagamentosRepository.createPagamento(pagamento);


  }

  findAll(): Promise<Pagamento[]> {
    return this.pagamentosRepository.findAll();
  }

  findById(id: number): Promise<Pagamento> {
    return this.pagamentosRepository.findById(id);
  }
  remove(id: number) {
    return this.pagamentosRepository.remove(id);
  }

  update(id: number, status: string) {
    return this.pagamentosRepository.update(id, status);
  }
}
