import { IProdutosRepository } from 'src/pedido/core/domain/repository/produtos.repository';
import { ExistProdutoUseCase } from './exist.produto.usecase';
import { InputProdutoDto } from './produto.dto';

export class UpdateProdutoUseCase {
  constructor(private produtosRepository: IProdutosRepository, 
    private readonly existProdutoUseCase: ExistProdutoUseCase) 
  {}

  async execute(id: number, produtoDto: InputProdutoDto) {
     if (this.existProdutoUseCase.execute(id))
         return this.produtosRepository.update(id, produtoDto);
  }
}

  