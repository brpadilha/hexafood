import { IPedidosRepository } from "src/pedido/core/domain/repository/pedidos.repository";
import { ProdutoException } from "../../exceptions/produto.exception";

export class FindAllProdutosUseCase {
  constructor(private produtosRepository: IPedidosRepository) {}

  async execute() {
    const produtos =  this.produtosRepository.findAll();
    if (!produtos) {
      throw new ProdutoException('Não há produtos cadastrados.');
    }
    return produtos;
  }
}
