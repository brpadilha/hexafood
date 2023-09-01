import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePagamentoDto } from '../../core/application/usecases/pagamento/pagamentoDto';
import { CreatePagamentoUseCase } from 'src/pagamento/core/application/usecases/pagamento/create.pagamento.usecase';
import { FindPagamentoUseCase } from 'src/pagamento/core/application/usecases/pagamento/find.pagamento.usecase';

@ApiTags('pagamentos')
@Controller('pagamentos')
export class PagamentosController {
  constructor(
    private readonly createPagamentoUseCase: CreatePagamentoUseCase,
    private readonly findPagamentoUseCase: FindPagamentoUseCase

  ) {}
  
  @Post()
  create(@Body() createPagamentoDto: CreatePagamentoDto) {
    return this.createPagamentoUseCase.execute(createPagamentoDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findPagamentoUseCase.execute(+id);
  }

}
