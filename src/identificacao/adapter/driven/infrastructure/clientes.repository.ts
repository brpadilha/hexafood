import { PrismaClient } from '@prisma/client';
import { Cliente } from '../../../core/domain/entities/cliente.entity';
import { IClientesRepository } from './../../../core/application/ports/repositories/clientes.repository';

export class ClientesRepository implements IClientesRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL, 
        },
      },
    });
  }

  async create(data: Cliente): Promise<Cliente> {
    return this.prisma.cliente.create({ data });
  }

  async findUnique(cpf: string): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({
      where: { cpf },
    });
  }

  async existsByCpf(cpf: string): Promise<boolean> {
    const exist = await this.prisma.cliente.count({
      where: { cpf },
    });
    return exist > 0;
  }

  async findById(id: number): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({
      where: { id },
    });
  }
}
