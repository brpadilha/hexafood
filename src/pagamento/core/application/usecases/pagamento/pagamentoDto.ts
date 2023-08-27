import { ApiProperty } from '@nestjs/swagger';
import { Pagamento } from '../../../domain/pagamento/entity/pagamento.entity';

export class PagamentoDto extends Pagamento {
  id: number;
}

export class CreatePagamentoDto {
  @ApiProperty()
  valor: number;

  @ApiProperty()
  id_pedido: number;

  @ApiProperty()
  cliente?: {
    id?: number;
    nome?: string;
    email?: string;
    cpf?: string;
  };

  id_cliente?: number;
}
