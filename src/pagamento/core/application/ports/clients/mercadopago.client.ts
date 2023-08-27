import { Inject, Injectable } from '@nestjs/common';
import {
  IPagamentosRepository,
  PAGAMENTOS_REPOSITORY,
} from '../../../domain/pagamento/repository/pagamentos.repository';

import mercadopago from '../../../../../mocks/mercadoPagoMockService';
import {
  CreatePagamentoDto,
  PagamentoDto,
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
    const description = `Hexafood - pedido ${id_pedido} - MercadoPago`;

    const { nome, email, cpf } = cliente;
    const nameParts = nome.split(' ');

    const payer =
      (nome && email) || cpf
        ? {
            ...(cpf &&
              ({ identification: { type: 'CPF', number: cpf } } as const)),
            ...(nome && {
              first_name: nameParts[0],
              last_name:
                nameParts.length > 1 ? nameParts[nameParts.length - 1] : '',
            }),
            ...(email && { email }),
          }
        : null;

    return mercadopago.payment.create({
      transaction_amount: valor,
      description,
      payment_method_id: 'pix',
      ...(payer && { payer }),
    });

    // return this.pagamentosRepository.createPagamento({
    //   valor: valor,
    //   id_pedido: id_pedido,
    //   id_transacao: mpTransaction.id,
    //   plataforma: 'mercadopago',
    //   descricao: description,
    // });
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
}
