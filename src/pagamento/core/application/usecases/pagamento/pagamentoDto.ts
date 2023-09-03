import { ApiProperty } from '@nestjs/swagger';
import { Pagamento } from '../../../domain/pagamento/entity/pagamento.entity';

export class PagamentoDto extends Pagamento {
  id?: number;
}

export class CreatePagamentoDto {
  id?: number;
  @ApiProperty()
  valor: number;

  @ApiProperty()
  id_pedido: number;

  @ApiProperty()
  cpf?: string;

  cliente?: {
    id?: number;
    nome?: string;
    cpf?: string;
  };
  id_cliente?: number;

  status?: string;
}
