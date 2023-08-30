import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePagamentoDto } from '../../core/application/usecases/pagamento/pagamentoDto';

@ApiTags('pagamentos')
@Controller('pagamentos')
export class PagamentosController {
  constructor() {}


  // export class ClientesController {
  //   constructor(
  //     private readonly createClienteUseCase: CreateClienteUseCase,
  //     private readonly identiyClienteUseCase: IndentifyClienteUseCase,
  //   ) {}
  
  // @Post()
  // create(@Body() createPagamentoDto: CreatePagamentoDto) {
  //   return this.pagamentosService.createPagamento(createPagamentoDto);
  // }

  // @Get()
  // findAll() {
  //   return this.pagamentosService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.pagamentosService.findById(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.pagamentosService.remove(+id);
  // }
}
