import { IProdutosRepository } from 'src/pedido/core/domain/repository/produtos.repository';
import { FindByIdProdutoUseCase } from './find.by.id.produto.usecase';

export class ExistProdutoUseCase {
  constructor(private produtosRepository: IProdutosRepository,
    private readonly findByIdProdutoUseCase: FindByIdProdutoUseCase) {}

  async execute(id: number) {
    const produto = await this.findByIdProdutoUseCase.execute(id);
    if (!produto) {
      return false;
    }
    return true;
  }
}
