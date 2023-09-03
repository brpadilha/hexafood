import { IProdutosRepository } from "src/pedido/core/domain/repository/produtos.repository";
import { ProdutoException } from "../../exceptions/produto.exception";
import { Inject } from '@nestjs/common';

export class FindByIdCategoriaUseCase {
  constructor(
    @Inject(IProdutosRepository)

    private produtosRepository: IProdutosRepository) {}

  async execute(id_categoria: number) {
    return this.produtosRepository
      .findByIdCategoria(id_categoria)
      .then((produtos) => {
        if (!produtos || produtos.length === 0) {
          throw new ProdutoException('A categoria informada não existe');
        }
        return produtos;
      });
  }
}