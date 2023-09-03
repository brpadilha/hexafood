<h1 align="center">
    Hexafood
</h1>


## Índice

- <a href="#boat-sobre-o-projeto">Sobre o projeto</a>
- <a href="#hammer-tecnologias">Tecnologias</a>
- <a href="#rocket-como-rodar-esse-projeto">Como rodar esse projeto</a>
- <a href="#electric_plug-arquitetura-hexagonal-ports-and-adapters">Arquitetura Hexagonal (Ports and Adapters)</a>
- <a href="#open_file_folder-arquitetura-na-prática">Arquitetura na prática</a>
- <a href="#notebook-lógica-de-negócio-domínio-aplicada">Lógica de negócio (domínio) aplicada</a>
    - <a href="#identificação">Identificação</a>
    - <a href="#pedido">Pedido</a>
    - <a href="#pagamento">Pagamento</a>
- <a href="#no_entry_sign-exceções-e-validações">Exceções e Validações</a>
- <a href="#microscope-testabilidade">Testabilidade</a>
- <a href="#bookmark_tabs-licença">Licença</a>
- <a href="#wink-autores">Autores</a>
## :boat: Sobre o projeto

Esse projeto faz parte do trabalho "Tech Challenge - Fase 02", ministrado no segundo módulo do curso de Pós Graduação Software Architecture da FIAP em parceria com a Alura.

Para exercitar os conceitos apresentados nas matérias do curso, sendo elas sobre Kubernentes Clean Architecture, a aplicação backend desenovlvida em Typescript no framework NestJS, foi adaptada a fim de representar os conceitos da Arquitetura Limpa, e também foi criado scripts de configuração de um cluster kubernetes.

## :hammer: Tecnologias:

- **[Typescript](https://www.typescriptlang.org)**
- **[NestJS](https://nestjs.com/)**
- **[PostgreSQL](https://www.postgresql.org/)**
- **[JestJS](https://jestjs.io/pt-BR/)**

## :rocket: Como rodar esse projeto

Se você estiver usando Windows, vai precisar do WSL para rodar esse projeto de forma prática. Para isso, você pode instalá-lo seguindo o seguinte [tutorial](https://learn.microsoft.com/pt-br/windows/wsl/install). Também será necessário uma distribuição linux para utilizar o WSL. Recomendo o Ubuntu que pode ser baixando na própria Microsoft Store no [link](https://apps.microsoft.com/store/detail/ubuntu/9PDXGNCFSCZV).
Depois, vai precisar do Docker, o qual a versão de Windows pode ser encontrada [aqui](https://docs.docker.com/desktop/install/windows-install/).
Então, clone o projeto dentro do WSL, vá para pasta dele e execute o comando:

```
docker compose build --no-cache
```

Após a construção da imagem, basta executar o comando:

```
docker compose up
```

O projeto estará executando no endereço http://localhost:3000/.

Para limpar o volume db do docker, execute o comando:
docker-compose down -v

## :electric_plug: Infraestrutura K8S

O Kubernetes(K8S) é uma plataforma de orquestração de contêineres open-source que automatiza o deployment, o escalonamento e a gestão de aplicações contêinerizadas. Ele agrupa contêineres que compõem uma aplicação em unidades lógicas para fácil gestão e descoberta de serviços, oferecendo recursos poderosos como balanceamento de carga, armazenamento persistente e monitoramento, tudo isso de forma declarativa através de arquivos de configuração.

Atendendo aos critérios do Tech Challenge - Fase 02, foi aprovisionado um cluster K8S com as seguintes configurações:

- Deployment da aplicação com ao menos 2 pods;
- Service Load Balancer do tipo NLB ou ALB
- Configurações de acesso aos servicos parametrizados via Secrets

<br>
<h4 align="center">
    <img alt="Representação visual de arquitetura hexagonal" title="arquitetura-hexagonal" src=".github/readme/cluster_hexafood.jpg" width="1864px" />
</h4>
<br>

Além dos critérios do desafio, foi criado um Job para execução das migrations. Dessa forma, como boa prática separamos essa responsabilidade do ciclo de vida de aprovisionamento dos pods da API. 

```yaml
metadata:
  name: api-migration
spec:
  template:
    spec:
      containers:
        - name: api-migration
          image: marayza/hexafoodk8s:v15
          command: ['/bin/sh', '-c']
          args:
            - './wait-for-it.sh postgres-service:5432 -- yarn prisma migrate dev && yarn prisma db seed'
          envFrom:
            - secretRef:
                name: postgres-secret
      restartPolicy: OnFailure
```

## :open_file_folder: Clean Architecture

A Clean Architecture é um conjunto de princípios de design de software que busca promover a separação de preocupações e a criação de sistemas desacoplados e testáveis. Concebida por Robert C. Martin ("Uncle Bob"), essa arquitetura prioriza a independência de frameworks, interfaces de usuário e bancos de dados, colocando as regras de negócio no centro do design. Assim, permite uma maior flexibilidade e facilidade de manutenção, tornando o sistema mais robusto e adaptável a mudanças.

Durante a Fase 01, foi utilizado a Arquitetura Hexagonal (Ports and Adpaters), o que facilitou a conversão da aplicação para Clean Architecture. Pois ambas pregam a cerca do isolamento do coração da aplicação com o mundo exterior. Tudo que for inerente a lógica do negócio e do domínio, deve ser considerado um detalhe, e por isso o design de código deve se guiar pelo desacoplamento. 

Conforme a modelagem do fluxo de realização de pedido obtida através da técnica do Event Storming do DDD (disponível para melhor visualização [aqui](https://miro.com/app/board/uXjVMK9Pt7E=/)), foram identificados três agregados os quais consideramos também potenciais candidatos a serem Contextos Delimitados:

- Identificação
- Pedido
- Pagamento
<br>
<h4 align="center">
    <img alt="Event Storming do fluxo de pedidos do sistema" title="event-storming" src=".github/readme/event-storming.jpg" width="1864px" />
</h4>
<br>
Dessa forma, visando aproveitar a estrutura modular do NestJS, os três foram separados em módulos:

```
.
├── src (separação do código fonte por módulos)
│   ├── identificacao
│   ├── pedido
│   └── pagamento
├── test
│   └── [arquivos de teste]
├── package.json
├── package-lock.json
└── README.md

```

Adentrando no módulo Identificação para exemplificação, temos a representação da arquitetura partindo de dois diretórios:

- Infrastructure: onde estarão todos os detalhes de implementação, como gateways que se comunicam com mundo exterior e recursos inerentes a regra de negócio;
- Core: onde estará o coração do software, isolando o que concerne o domínio da aplicação (domain), nesse caso as entidades que representam o negócio, e a lógica da aplicação (application), a qual visando atender ao Princípio da Responsabilidade Única (SRP) da Clean Architecture, é separada Casos de Uso (Use Cases). 

```
.
├── src
│   ├── identificacao
│   │   ├── infrastructure
│   │   │   ├── controller
│   │   │   │   └── clientes.controller.ts
│   │   │   ├── filter
│   │   │   └── gateway
│   │   └── core
│   │       ├── application
│   │       │   ├── exceptions
│   │       │   └── use-cases
│   │       │       ├── create.cliente.usecase.ts
│   │       │       ├── find.cliente.usecase.ts
│   │       │       ├── identify.cliente.usecase.ts
│   │       │       └── dto
│   │       └── domain
│   │           ├── entities
│   │           │   └── cliente.entity.ts
│   │           ├── factory
│   │           └── repository
│   │               └── clientes.repository.ts

```
Para se comunicar com o mundo exterior, assim como na Arquitetura Hexagonal a camada interna deve continuar utilizando "Ports". Com isso, pode-se traçar uma "fronteira" que separa o que é lógica do domínio e detalhe de implementação, o que representa essa separação de fato é o uso de interfaces, como no caso do IClienteResository que é utilizado para abstrair a necessidade da lógica de aplicação interagir com banco de dados (mundo externo). Essa separação fica melhor descrita visualmente na figura a seguir:
<br>
<h4 align="center">
    <img alt="Event Storming do fluxo de pedidos do sistema" title="event-storming" src=".github/readme/clean_hexa.jpg" width="1864px" />
</h4>
<br>

Além da organização de diretórios, foi adotado outras boas práticas a fim de reforçar os conceitos da Clean Architecture. Cada Use Case é representado por um arquivo diferente, e todos seguem o design Command Pattern, tendo um método único "execute" para representara execução do caso de uso. Dessa forma, o código se torna mais organizado estimulando a coesão e o Princípio da Responsabilidade Única. 
```typescript
export class CreateClienteUseCase {

  ...

  async execute(data: InputClienteDto): Promise<OutputClienteDto> {
    const exists = await this.clientesRepository.existsByCpf(data.cpf);
    if (exists) {
      throw new ClienteException('Cliente já cadastrado');
    }
    const cliente = await this.clientesRepository.create(
      new Cliente(data.nome, data.cpf),
    );
    return {
      id: cliente.id,
      nome: cliente.nome,
      cpf: cliente.cpf,
    };
  }
}
```
A fim de isolar cada camada da arquitetura, cada use case deve trabalhar com DTOs (Data Transfer Objects). Dessa forma as camadas internas não ficam expostas a cada mais externas, a fim de diminuir o acoplamento do código.

Outra boa prática adotada foi o uso Factories para abstração de complexidades referentes a criação de objetos. Por exemplo, a entidade Cliente pode ser criada sem ter um ID e sem ter a data de criação, pois quem fornece essas informações é o repositório onde a entidade é registrada (como o banco de dados). Em outra situação, quando a entidade é carregada do repositório, ela já terá essas informações. 

Desta forma, para abstrair essa complexidade na hora de instanciar uma entidade Cliente no sistema, de ter que verificar se os valores estão presentes ou não, foi criado uma Factory com o objetivo de instanciar entidades "Cliente" a partir de uma conjunto bruto de dados:
```typescript
export class ClienteFactory {
  static create(data: any): Cliente {
    const cliente = new Cliente(data.nome, data.cpf);
    cliente.id = data.id || null;
    cliente.createdAt = data.createdAt || null;
    return cliente;
  }
}

```

## :notebook: Lógica de negócio (domínio) aplicada

Esse projeto consistem uma API para atender as necessidades de uma lanchonete que deseja automatizar os seus pedidos através de dispositivos de autoatendimento. Baseando-se na modelagem do Event Storming, foram identidicados os seguintes casos de uso:

### Identificação

Primeiramente tem-se a fase da identificação, na qual o cliente poderá ou não estar se identificando. Caso ele seja um novo cliente, ele poderá ser cadastrar conforme endpoint (cada um já está linkado com a referência no swagger para testes, considerando que ele está sendo executado em http://localhost:3000):

[/clientes](http://localhost:3000/api/#/clientes/ClientesController_create)

```json
{
  "nome": "Senhor Teste 1",
  "cpf": "12345678910"
}
```

O sistema efetuará as seguintes validações:

- O CPF não pode conter menos de 11 dígitos
- O CPF não pode ter sido cadastrado em outro cliente

Caso o cliente já seja cadastrado, ele poderá se identificar pelo endpoint:

[/clientes/{cpf}](http://localhost:3000/api/#/clientes/ClientesController_findByCPF)

Também é possível que o cliente prossiga sem se identificar. Dessa forma, o autoatendimento apenas não informará a identificação do mesmo na hora de efetuar o pedido.

### Pedido

Para composição do pedido, primeiramente é necessário consultar as categorias cadastradas no sistema:

[/categorias](http://localhost:3000/api/#/categorias/CategoriasController_findAll)
O cliente poderá escolher entre umas das categorias do sistema:

```json
[
  {
    "id": 1,
    "nome": "Lanche"
  },
  {
    "id": 2,
    "nome": "Acompanhamento"
  },
  {
    "id": 3,
    "nome": "Bebida"
  },
  {
    "id": 4,
    "nome": "Sobremesa"
  }
]
```

Com a categoria escolhida, o sistema deverá listar os produtos filtrados, os quais o usuário poderá estar adicionando aos itens do pedido, na sequência e quantidade que desejar:

[/produtos/{id_categoria}](http://localhost:3000/api/#/produtos/ProdutosController_findByIdCategoria)

```json
[
  {
    "id": 4,
    "nome": "Hexa Dog",
    "id_categoria": 1,
    "valor": 12.9,
    "descricao": "Cachorro quente minimalista",
    "imagem": "https://images.unsplash.com/photo-1612392062422-ef19b42f74df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    "createdAt": "2023-07-05T01:39:43.422Z",
    "updatedAt": "2023-07-05T01:39:43.422Z"
  },
  ...
]
```

Após escolher todos itens necessário, o autoatendimento deve submeter o pedido completo no seguinte endpoint:

[/pedidos](http://localhost:3000/api/#/pedidos/PedidosController_createManyProdutos)

```json
{
  "id_cliente": 1,
  "itens": [
    {
      "quantidade": 1,
      "id_produto": 4
    },
    {
      "quantidade": 3,
      "id_produto": 7
    },
    {
      "quantidade": 2,
      "id_produto": 9
    },
    {
      "quantidade": 3,
      "id_produto": 11
    }
  ]
}
```

O pedido consiste na identificação do cliente (se estiver identificado), e os itens escolhidos com a quantidade de cada um.

O pedido será submetido a uma etapa de processamento do pagamento que será explicada no próximo tópico. Por hora, nesse momento será exemplificado a etapa pós pagamento.

Após o processamento do pagamento, o pedido tem o seu STATUS alterado para "RECEBIDO". Dessa forma, ele deve estar disponível para consulta de pedidos pendentes no painel da cozinha, através do seguinte endpoint:

[/pedidos/consultar_pedidos_pendentes](http://localhost:3000/api/#/pedidos/PedidosController_consultarPedidosPendentes)

```json
[
  {
      "codigo_pedido": "ZG53O3",
      "status": "RECEBIDO",
      "id": 9,
      "createdAt": "2023-07-08T23:28:13.810Z",
      "updatedAt": "2023-07-08T23:28:13.810Z",
      "cliente": {
        "id": 1,
        "nome": "Sammy Abshire",
        "cpf": "50808605066",
        "createdAt": "2023-07-08T19:25:03.451Z"
      },
      "valor_total": 153.9,
      "itens": [
        {
          "id": 25,
          "quantidade": 3,
          "valor": 14.5,
          "id_produto": 11,
          "produto": {
            "id": 11,
            "nome": "Hexa Brownie",
          }
        },
        ...
      ]
    }
  ...
]
```
Dessa forma, o pedido entra numa fila e fica disponível de acordo com a ordem de criação (o pedido mais antigo para o mais recente) para que algum usuário atuante da Cozinha, inicie a preparação. Ele deve dar algum comando para painel, para que o status do pedido seja atualizado no seguinte endpoint:

[/pedidos/{id}/iniciar_preparacao](http://localhost:3000/api/#/pedidos/PedidosController_iniciarPreparacaoPedido)
```json
{
  "id": 9,
  "codigo_pedido": "ZG53O3",
  "valor_total": 153.9,
  "status": "EM_PREPARACAO",
  "createdAt": "2023-07-08T23:28:13.810Z",
  "updatedAt": "2023-07-08T23:28:13.810Z",
  "id_cliente": 1
}
```
Dessa forma o STATUS do pedido passa para a "EM_PREPARACAO". 
Ao finalizar a preparação, o usuário da Cozinha deve chamar o endpoint:

[/pedidos/{id}/finalizar_preparacao](http://localhost:3000/api/#/pedidos/PedidosController_finalizarPreparacaoPedido)
```json
{
  "id": 9,
  "codigo_pedido": "ZG53O3",
  "valor_total": 153.9,
  "status": "PRONTO",
  "createdAt": "2023-07-08T23:28:13.810Z",
  "updatedAt": "2023-07-08T23:28:13.810Z",
  "id_cliente": 1
}
```
O STATUS do pedido passa a ser "PRONTO", o que significa ele já pode ser retirado pelo cliente. Quando isso acontecer, deve ser dado o comando para atualizar o STATUS do pedido novamente:

[/pedidos/{id}/finalizar_pedido](http://localhost:3000/api/#/pedidos/PedidosController_finalizarPedido)
```json
{
  "id": 9,
  "codigo_pedido": "ZG53O3",
  "valor_total": 153.9,
  "status": "FINALIZADO",
  "createdAt": "2023-07-08T23:28:13.810Z",
  "updatedAt": "2023-07-08T23:28:13.810Z",
  "id_cliente": 1
}
```
O pedido passa para "FINALIZADO" e se encerra o fluxo. 

Em todo processo é possível consultar pedido atual através do código gerado pelo sistema, através do seguinte endpoint:

[/pedidos/{codigo_pedido}](http://localhost:3000/api#/pedidos/PedidosController_consultarPedidoPorCodigo)

### Pagamento ###
Antes do pedido prosseguir para cozinha para preparação, ele deve ter seu pagamento processado. Como isso é feito por um sistema externo, foi optado por fazer isso de forma assíncrona. 

Quando um pedido é criado, primeiramente é definido um STATUS de "INICIADO", e disparado um evento no sistema. Foi utilizado um recurso do nestjs chamado "event-emitter", para diminuir acoplamento e separar responsabilidades. O funcionamento se dá seguinte forma: 
```ts
async createNewPedido(pedidoDto: PedidoDTO) {
  //logica de validação e criação de um novo pedido
  ...
  pedido.status = StatusPedido.INICIADO;
  ...
  
  console.log('Novo pedido criado: ', pedido);
  this.eventEmitter.emit('novo.pedido', new NovoPedidoEvent(pedido));

  return pedido;
}
```
Na criação do pedido é disparado o evento NovoPedidoEvent que recebe o pedido criado como parâmetro. Dessa forma, é possível implementar uma outra classe que ficará escutando esses eventos, e dessa forma executará uma lógica adicional. Nesse caso, definimos o NovoPedidoListener:
```ts
@Injectable()
export class NovoPedidoListener {
  constructor(
    @Inject(IPedidosRepository)
    private pedidosRepository: IPedidosRepository,
    private pagamentosService: PagamentosService,
  ) {}

  @OnEvent('novo.pedido')
  async handle(event: NovoPedidoEvent) {
    const pedido = event.pedido;
    //lógica de criação de DTO para criação do pagametno
   ...

   //Tenta criar um novo pagamento
    try {
      const pagamento = await this.pagamentosService.createPagamento(
        pagamentoDto,
      );
      console.log('Pagamento criado: ', pagamento);
      //Se der certo, atualiza o status do pedido para RECEBIDO
      pedido.status = StatusPedido.RECEBIDO;
      await this.pedidosRepository.update(pedido.id, pedido);
      console.log('Pedido atualizado: ', pedido);
    } catch (error) {
      console.log(error);
      //Se der algum erro no pagamento, atualiza o status do pedido para CANCELADO
      pedido.status = StatusPedido.CANCELADO;
      await this.pedidosRepository.update(pedido.id, pedido);
      console.log('Pedido atualizado: ', pedido);
    }
  }
}

```
O NovoPedidoListener tenta se comunicar com o cliente de pagamento através da classe PagamentosService do módulo de Pagamentos. A lógica de comunicação com o gateway do Mercado pago está implementada nessa classe. Se por acaso algum erro acontecer durante o processamento do pagamento,o pedido passa ter o STATUS "CANCELADO" e não vai para fila de preparação. Futuramente, lógicas adicionais para tratento de pedidos cancelados podem ser implementadas.

## :no_entry_sign: Exceções e Validações

Assim como no DDD, um dos principais objetivos da Arquitetura Hexagonal é separar a complexidade de implementação (camada de infraestrutura) da camada de negócio. Isso deve nortear todo design de código, incluindo as validações e exceções.

Nesse projeto a validação é feita pela camada de domínio, mas em específico nas classes services. Quando algo não passar por alguma validação, do ponto de vista de negócio isso é uma exceção. Dessa forma, é disparado uma exceção personalizada, conforme exemplo a seguir:
```ts
async create(cliente: Cliente) {
    if (!cliente.nome || cliente.nome.trim() === '')
      throw new ClienteException('O nome não pode ser vazio');

    if (!cliente.cpf || cliente.cpf.length != 11)
      throw new ClienteException('CPF precisa ter exatamente 11 caracteres');

    if (cliente.cpf && (await this.clientesRepository.existsByCpf(cliente.cpf)))
      throw new ClienteException('CPF já cadastrado.');

    return this.clientesRepository.create(cliente);
  }
```

Nessa abordagem, a camada de domínio apenas dispara a exceção e não se preocupa o que fazer com essa exceção. Ou seja, ela informa que houve uma exceção para outra camada que a chamou, agora fica a critério dessa outra camada tratar essa exceção. 

Nesse projeto, foi utilizado um recurso do próprio NestJS para tratamento de exceções chamado "ExceptionFilter". Foi criado uma classe chamada "ValidationFilter" captura automaticamente as exceções de validação, e retorna uma mensagem formatada para API com status code 400:
```ts
@Catch(ClienteException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(400).json({
      statusCode: 400,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception.message,
    });
  }
}
```
```json
{
  "statusCode": 400,
  "timestamp": "2023-07-09T20:50:02.056Z",
  "path": "/clientes",
  "error": "O nome não pode ser vazio"
}
```
Dessa forma, transferimos a complexidade de implementação de um retorno da API para camada de infraestrutura, mantendo a camada de domínio desacoplada e limpa.
## :microscope: Testabilidade

Considerando o uso de portas para a camada de serviços do coração do software se comunicar com serviços externos, torna-se o possível do uso de injeção de dependência para mudar o comportamento padrão do sistema e dessa forma fazer testes de unidades totalmente independentes. Como por exemplo no teste de ClientesService foi injetado um repositório de clientes em memória para que não precisássemos de banco de dados durante os testes de unitários, dessa forma reforçando o conceito de pirâmide testes:

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { IClientesRepository } from '../../src/identificacao/core/application/ports/repositories/clientes.repository';
import { ClientesService } from '../../src/identificacao/core/application/services/clientes.service';
import { InMemoryClientesRepository } from '../../src/identificacao/adapter/driven/infrastructure/in-memory-clientes.repository';
import { Cliente } from '../../src/identificacao/core/domain/clientes/entities/cliente.entity';

describe('ClientesService', () => {
  let service: ClientesService;
  let repository: IClientesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        //Nessa parte do código, injetamos o adapter InMemoryClientesRepository na porta IClientesRepository, para alterar o comportamento padrão do sistema e realizar os testes de unidade de ClientesService
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
```

## :bookmark_tabs: Licença

Este projeto esta sobe a licença MIT. Veja a [LICENÇA](https://opensource.org/licenses/MIT) para saber mais.

## :wink: Autores

Feito com ❤️ por:

- [Bruno Padilha](https://www.linkedin.com/in/brpadilha/)
- [Lucas Siqueira](https://www.linkedin.com/in/lucassouzatidev/)
- [Marayza](https://www.linkedin.com/in/marayza-gonzaga-7766251b1/)
- [Mario Celso]()
- [Rafael Silveira](https://github.com/rafasilveira)

[Voltar ao topo](#índice)