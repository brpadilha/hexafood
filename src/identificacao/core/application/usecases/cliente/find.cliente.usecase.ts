import { IClientesRepository } from 'src/identificacao/core/domain/cliente/repository/clientes.repository';

export class FindClienteUseCase {
  constructor(private clientesRepository: IClientesRepository) {}

  async execute(id: number) {
    return this.clientesRepository.findById(id);
  }
}
