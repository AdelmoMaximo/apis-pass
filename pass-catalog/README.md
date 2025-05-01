# API de Catálogo de Serviços

## Visão Geral

Esta API permite a consulta de serviços e produtos disponíveis na plataforma. Ela retorna dados armazenados em um bucket do Google Cloud Storage, organizados por tipo de serviço e identificador.

A API suporta os seguintes tipos de serviços:
- `room` - Acomodações
- `transfer` - Transfer
- `ticket` - Ingressos
- `tour` - Passeios
- `guide` - Guias
- `combo` - Combos

## Estrutura do Projeto

```
catalog-api/
├── index.js           # Arquivo principal da API
├── package.json        # Dependências e scripts
├── README.md           # Este arquivo

```

## Tecnologias Utilizadas

- Node.js
- Express.js
- Google Cloud Storage
- dotenv (para variáveis de ambiente)
- cors (para habilitar CORS)

## Endpoint Principal

```
URL  DO RUN https://catalog-api-1041383179041.us-central1.run.app/catalog/service/{type}

```
POST /catalog/service/{type}
```

Onde `{type}` é um dos tipos de serviço suportados (room, transfer, ticket, tour, guide, combo).

### Parâmetros da Requisição

```json
{
  "identifier": "identificador-do-servico",
  "key": "business-channel"
}