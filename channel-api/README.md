# Channel API

## Visão Geral

A Channel API é um serviço que permite recuperar configurações específicas de canais de venda com base em um domínio de referência. A API busca dados de configuração armazenados no Google Cloud Storage e os retorna em formato JSON.

## Como Funciona

1. A API recebe uma requisição POST contendo uma chave de API e uma referência (URL ou domínio)
2. Extrai o domínio base da referência (removendo protocolo, www e caminhos)
3. Busca um arquivo de configuração no bucket do Google Cloud Storage usando o caminho `{domínio}/config.json`
4. Retorna os dados de configuração em formato JSON

## Endpoints

### Verificação de Saúde (Health Check)

```
GET /
```

Retorna uma mensagem simples para verificar se a API está funcionando.

### Obter Configuração do Canal

```
URL DO RUN https://channel-api-aenxcgxiqq-uc.a.run.app/channel
```

```
POST /channel
```

Retorna a configuração do canal com base na referência fornecida.

#### Parâmetros da Requisição

```json
{
  "key": "sua-chave-aqui-com-pelo-menos-33-caracteres",
  "reference": "meusite.com.br"
}