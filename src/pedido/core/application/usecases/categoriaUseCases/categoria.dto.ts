
import { ApiProperty } from '@nestjs/swagger';

export class InputCategoriaDto {
  @ApiProperty()
  nome: string;
}


export class OutputCategoriaDto {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  nome: string;
}
