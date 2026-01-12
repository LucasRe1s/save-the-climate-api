# API desenvolvida em <b>NestJS</b> para extração de dados climáticos via API pública, persistência em banco relacional e disponibilização via endpoints REST.

## Descrição

Este projeto foi desenvolvido como **avaliação técnica**, com o objetivo de demonstrar:

- Consumo de **API pública externa** (OpenWeather)
- Uso de **parâmetros dinâmicos e autenticação por API Key**
- Persistência de dados em **banco de dados relacional**
- Criação de uma **API RESTful** para consulta dos dados armazenados
- Uso de **Docker** para garantir ambiente reprodutível
- Organização de código, boas práticas e documentação

---

## 🧱 Arquitetura e Tecnologias

- **Node.js**
- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **Axios (HttpModule)**
- **Swagger**
- **Docker & Docker Compose**

### Principais decisões técnicas

- Separação da integração com a API externa em um **client dedicado**
- Uso de **TypeORM com entidades e migrations**
- Variáveis sensíveis isoladas em **.env**
- Documentação automática via **Swagger**

---

## 🚀 Configuração do Projeto

### Pré-requisitos

- Docker e Docker Compose  
  **ou**
- Node.js >= 18
- PostgreSQL

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` baseado no exemplo abaixo:

```env
NODE_ENV=development || production
DATABASE_URL=coloque_sua_url_do_banco_aqui || postgresql://appuser:apppass@localhost:5432/appdb
OPENWEATHER_API_KEY=coloque_sua_chave_aqui
```

A chave pode ser obtida em:
👉 [https://openweathermap.org/api](https://openweathermap.org/api)

---

## 🐳 Executando com Docker (Recomendado)

```bash
docker compose up --build
```

### Serviços disponíveis

- API: [http://localhost:3000](http://localhost:3000)
- Swagger: [http://localhost:3000/docs](http://localhost:3000/docs)
- PostgreSQL: localhost:5432

---

## ▶️ Executando sem Docker

```bash
npm install
npm run start:dev
```

> Certifique-se de que o PostgreSQL esteja rodando e que as variáveis do `.env` estejam corretas.

---

## 📚 Documentação da API

A API é documentada automaticamente com Swagger:

👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**

---

## 🔌 Endpoints Principais

### 🔹 Buscar dados climáticos e salvar no banco

```
POST /weathers?city=São Paulo&country=BR
```

### 🔹 Listar registros armazenados

```
GET /weathers
```

### 🔹 Buscar registro por ID

```
GET /weathers/:id
```

### 🔹 Excluir registro por ID

```
DELETE /weathers/:id
```

---

## 🗄️ Banco de Dados

Tabela principal: `weather`

Campos armazenados:
- city
- country
- weather_main
- weather_description
- longitude
- latitude
- temperature
- thermal_sensation
- humidity
- measured_at

---

## 📦 Estrutura do Projeto

```
src/
├─ config/
│  └─ typeorm.config.ts
├─ database/
│  ├─ migrations/
│  │  └─ CreateWeatherTable.ts
│  └─ database.module.ts
├─ health-check/
│  ├─ health-check.controller.ts
│  └─ health-check.service.ts
├─ weather/
│  ├─ dto/
│  │   ├─ weather-query.dto.ts
│  │   └─ weather-response.dto.ts
│  ├─ entities/
│  │   └─ weather.ts
│  ├─ weather.controller.ts
│  ├─ weather.service.ts
│  ├─ openweather.client.ts
│  └─ weather.entity.ts
├─ app.module.ts
└─ main.ts
```

---

## 🧪 Testes

(Testes podem ser adicionados futuramente)

```bash
npm run test
```

---

## 📝 Considerações Finais

Este projeto demonstra:
- Integração com API externa
- Persistência relacional
- Organização de código em camadas
- Uso de Docker para padronização do ambiente
- Clareza na documentação e uso do Git

---

## 📄 Licença

Este projeto está sob licença MIT.

