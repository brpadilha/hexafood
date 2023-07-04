import { ApiProperty } from "@nestjs/swagger";

export class Pagamento {
  id_cliente?: number;
  id_pedido: number;
  id_transacao: number;
  descricao: string;
  plataforma: string;
  valor: number;
  updatedAt?: Date;
  createdAt?: Date;
}

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
    nome?: string
    email?: string
    cpf?: string
  }
}