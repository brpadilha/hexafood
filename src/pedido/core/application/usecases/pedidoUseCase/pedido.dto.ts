import { ApiProperty } from '@nestjs/swagger';
import { CreateItemDTO } from '../item.dto';

export class InputPedidoDTO {
  @ApiProperty()
  id_cliente?: number;
  @ApiProperty({ type: () => [CreateItemDTO] })
  itens: CreateItemDTO[];
}

export class OutputPedidoDTO {
  @ApiProperty()
  id_cliente?: number;
  @ApiProperty({ type: () => [CreateItemDTO] })
  itens: CreateItemDTO[];
}


export class PedidoDTO {
  @ApiProperty()
  id_cliente?: number;
  @ApiProperty({ type: () => [CreateItemDTO] })
  itens: CreateItemDTO[];
}