import { PrismaClient } from '@prisma/client';
import { Cliente } from '../../../core/domain/entities/cliente.entity';
import { IClientesRepository } from './../../../core/application/ports/repositories/clientes.repository';

export class ClientesRepository implements IClientesRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: Cliente): Promise<Cliente> {
    return this.prisma.cliente.create({ data });
  }

  async findUnique(cpf: string): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({
      where: { cpf },
    });
  }
}
