import { IProdutosRepository } from 'src/pedido/core/domain/repository/produtos.repository';
import { ExistProdutoUseCase } from './exist.produto.usecase';
import { InputProdutoDto } from './produto.dto';

export class DeleteProdutoUseCase {
  constructor(private produtosRepository: IProdutosRepository, 
    private readonly existProdutoUseCase: ExistProdutoUseCase) 
  {}

  async execute(id: number) {
     if (this.existProdutoUseCase.execute(id))
         return this.produtosRepository.remove(id);
  }
}

  