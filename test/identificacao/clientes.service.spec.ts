import { Test, TestingModule } from '@nestjs/testing';
import { IClientesRepository } from '../../src/identificacao/core/application/ports/repositories/clientes.repository';
import { ClientesService } from '../../src/identificacao/core/application/services/clientes.service';
import { InMemoryClientesRepository } from '../../src/identificacao/adapter/driven/infrastructure/in-memory-clientes.repository';
import { Cliente } from '../../src/identificacao/core/domain/entities/cliente.entity';

describe('ClientesService', () => {
  let service: ClientesService;
  let repository: IClientesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IClientesRepository,
          useClass: InMemoryClientesRepository,
        },
        ClientesService,
      ],
    }).compile();

    repository = module.get<IClientesRepository>(IClientesRepository);
    service = module.get<ClientesService>(ClientesService);
  });

  describe('create', () => {
    it('should create a new client and return it', async () => {
      const clienteData: Cliente = { id: 1, nome: 'Sr. Teste 1', cpf: '123' };
      const result = await service.create(clienteData);
      expect(result).toEqual(clienteData);
    });
  });
});
