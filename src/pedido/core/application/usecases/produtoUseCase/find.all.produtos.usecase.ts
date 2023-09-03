import { ProdutoException } from "../../exceptions/produto.exception";
import { IProdutosRepository } from "src/pedido/core/domain/repository/produtos.repository";

export class FindAllProdutosUseCase {
  constructor(private produtosRepository: IProdutosRepository) {}

  async execute() {
    const produtos =  this.produtosRepository.findAll();
    if (!produtos) {
      throw new ProdutoException('Não há produtos cadastrados.');
    }
    return produtos;
  }
}
