# Explorando os serviços da Microsoft Azure

## O que é a Microsoft Azure?

Microsoft Azure é uma plataforma de computação em nuvem completa e robusta fornecida pela Microsoft. Projetada para empresas de todos os tamanhos, a Azure oferece uma infraestrutura flexível, escalável e confiável para hospedar aplicações, serviços e cargas de trabalho na nuvem.

Com data centers globais em mais de 60 regiões, a Azure permite que as organizações implementem soluções com alta disponibilidade, baixa latência e conformidade regional. Sua abordagem "pague pelo que usar" auxilia empresas a otimizarem seus custos de TI, enquanto aproveita as mais recentes tecnologias sem investimento inicial em hardware ou infraestrutura.

A plataforma Azure fornece:

- **Infraestrutura como Serviço (IaaS)**: Recursos de computação, armazenamento e rede flexíveis
- **Plataforma como Serviço (PaaS)**: Ambientes de desenvolvimento e implantação completos
- **Software como Serviço (SaaS)**: Aplicações gerenciadas pela Microsoft
- **Inteligência Artificial (AI) e Machine Learning (ML)**: Serviços cognitivos e ferramentas de desenvolvimento de IA

### Principais serviços da Azure

- **Computação**: Virtual Machines, Azure App Service, Azure Functions, Azure Kubernetes Service (AKS)
- **Armazenamento**: Blob Storage, File Storage, Disk Storage, Table Storage, Queue Storage
- **Bancos de dados**: Azure SQL Database, Azure Cosmos DB, Azure Database for MySQL/PostgreSQL
- **Redes**: Virtual Network, Load Balancer, Application Gateway, VPN Gateway
- **IA e Machine Learning**: Azure Cognitive Services, Azure Machine Learning
- **DevOps**: Azure DevOps, GitHub Actions integration
- **Monitoramento**: Azure Monitor, Application Insights, Log Analytics
- **Segurança**: Azure Security Center, Key Vault, Azure Active Directory

## Sobre o Projeto

### Aplicação

Este sistema de chamados permite que usuários registrem problemas e solicitem suporte. Atendentes podem visualizar, responder e gerenciar os chamados. Algumas características:

- Autenticação e controle de acesso (usuários e atendentes)
- Interface amigável e responsiva para gestão de chamados
- Troca de mensagens entre usuário e atendente
- Upload de anexos (imagens, PDFs, documentos)

### Acesso Remoto

#### Frontend

🔗 [Link para acesso ao sistema](https://blue-pond-0fb9b830f.6.azurestaticapps.net/)

#### Backend

🔗 [Link da API](https://backend-mentoria-sysmap-gnb4ddebdtfpawag.brazilsouth-01.azurewebsites.net/)

### Executar localmente

Pré-requisitos:

- Node.js (versão 22 ou superior)
- Docker
- Git

```bash
# Clone o repositório
git clone https://github.com/tiagosouzac/exploring-azure-services
cd exploring-azure-services
```

##### Como executar o backend localmente

```bash
# Navegue até a pasta do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente e
# execute o Docker Compose para subir o banco de dados
docker compose up -d

# Execute as migrações do banco de dados
npx prisma migrate dev

# Inicie o servidor em modo de desenvolvimento
npm run dev

# O servidor estará disponível em http://localhost:3000
```

##### Como executar o frontend localmente

```bash
# Navegue até a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Edite o arquivo .env com suas configurações

# Inicie a aplicação em modo de desenvolvimento
npm run dev

# A aplicação estará disponível em http://localhost:5173
```

### Serviços Azure Utilizados

#### App Service

O Azure App Service foi utilizado para hospedar tanto o frontend quanto o backend da aplicação, aproveitando:

- Ambiente gerenciado para diferentes stacks (Node.js, .NET, etc.)
- Integração contínua e implantação contínua (CI/CD)
- Certificados SSL e domínios personalizados
- Escalabilidade automática com base na carga

#### SQL Database

Para armazenamento de dados, utilizamos o Azure SQL Database:

- Banco de dados relacional totalmente gerenciado
- Alta disponibilidade e performance
- Backups automáticos e recuperação pontual
- Segurança integrada com proteções contra ameaças

#### Blob Storage

Para armazenamento de anexos como imagens e PDFs:

- Armazenamento econômico e de alta escala para objetos não estruturados
- Controle de acesso granular para arquivos
- Integração com CDN para entrega rápida de conteúdo
- Várias opções de redundância para proteção de dados

#### Key Vault

Para gerenciamento seguro de segredos e credenciais:

- Armazenamento centralizado de chaves, segredos e certificados
- Integração com identidades gerenciadas para acesso seguro
- Políticas de acesso granulares baseadas em RBAC (Role-Based Access Control)
- Auditoria e registro de acesso aos segredos

#### Monitor e App Insights

Para monitoramento e diagnóstico da aplicação:

- Coleta de telemetria de desempenho em tempo real
- Detecção e diagnóstico de problemas
- Painéis personalizados para visualização de métricas
- Alertas automatizados para comportamentos anormais

#### CI/CD com GitHub Actions

Para automação do fluxo de desenvolvimento:

- Implantação automática após push para branches específicas
- Execução de testes antes da implantação
- Configuração de ambientes de desenvolvimento, homologação e produção
- Integração com o Azure para gerenciamento de credenciais seguras

## Recursos e Referências

- [Documentação do Microsoft Azure](https://docs.microsoft.com/azure)
- [Azure App Service](https://azure.microsoft.com/services/app-service/)
- [Azure SQL Database](https://azure.microsoft.com/services/sql-database/)
- [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/)
- [Azure Key Vault](https://azure.microsoft.com/services/key-vault/)
- [Azure Monitor](https://azure.microsoft.com/services/monitor/)
- [GitHub Actions](https://docs.github.com/actions)
