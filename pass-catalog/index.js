import express from "express"
import cors from "cors"
import { Storage } from "@google-cloud/storage"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

const storage = new Storage()
const bucketName = process.env.GCS_BUCKET_NAME || "pass-catalog"

const validServiceTypes = ["room", "transfer", "ticket", "tour", "guide", "combo"]

function validateApiKey(key) {
  return key && typeof key === "string" && key.includes("-")
}

function validateIdentifier(identifier) {
  return identifier && typeof identifier === "string" && identifier.length > 0
}

app.post("/catalog/service/:type", async (req, res) => {
  try {
    const { type } = req.params
    const { identifier, key } = req.body

    console.log(`Requisição recebida: type=${type}, identifier=${identifier}, key=${key}`)

    if (!validServiceTypes.includes(type)) {
      return res.status(400).json({
        error: "Tipo de serviço inválido",
        message: `O tipo deve ser um dos seguintes: ${validServiceTypes.join(", ")}`,
      })
    }

    if (!identifier || !key) {
      return res.status(400).json({
        error: "Parâmetros inválidos",
        message: 'Os parâmetros "identifier" e "key" são obrigatórios',
      })
    }

    if (!validateApiKey(key)) {
      return res.status(401).json({
        error: "Chave inválida",
        message: "A chave deve estar no formato {business}-{channel}",
      })
    }

    if (!validateIdentifier(identifier)) {
      return res.status(400).json({
        error: "Identificador inválido",
        message: "O identificador deve ser uma string não vazia",
      })
    }

    const filePath = `${type}/${identifier}.json`
    console.log(`Buscando arquivo: gs://${bucketName}/${filePath}`)

    try {
      const [exists] = await storage.bucket(bucketName).file(filePath).exists()
      console.log(`Arquivo existe? ${exists}`)

      if (!exists) {
        return res.status(404).json({
          error: "Identificador não encontrado",
        })
      }

      // Lê o conteúdo do arquivo
      console.log(`Tentando ler o arquivo...`)
      const [content] = await storage.bucket(bucketName).file(filePath).download()
      console.log(`Arquivo lido com sucesso, tamanho: ${content.length} bytes`)

      const catalogData = JSON.parse(content.toString())
      console.log(`JSON parseado com sucesso`)

      return res.status(200).json(catalogData)
    } catch (error) {
      console.error(`Erro ao acessar o bucket: ${error}`)
      return res.status(500).json({
        error: "Erro interno",
        message: `Erro ao acessar o arquivo de catálogo: ${error.message}`,
      })
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return res.status(500).json({
      error: "Erro interno",
      message: "Ocorreu um erro ao processar sua solicitação",
    })
  }
})

app.get("/", (req, res) => {
  res.status(200).send("Catalog API está funcionando!")
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
