import { Cliente } from '../../../core/domain/entities/cliente.entity';
import { IClientesRepository } from '../../../core/application/ports/repositories/clientes.repository';

export class InMemoryClientesRepository implements IClientesRepository {
  private clientes: Cliente[] = [{ id: 1, nome: 'Sr. Teste 1', cpf: '123' }];

  async create(data: Cliente): Promise<Cliente> {
    const cliente = { ...data };
    this.clientes.push(cliente);
    return cliente;
  }

  async findUnique(cpf: string): Promise<Cliente | null> {
    const cliente = this.clientes.find((c) => c.cpf == cpf);
    if (!cliente) {
      throw new Error(`Cliente com cpf ${cpf} não encontrado!`);
    }
    return cliente;
  }
}
