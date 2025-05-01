import express from "express";
import cors from "cors";
import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME || "channel-configurations";

function validateApiKey(key) {
  return key && key.length > 32;
}

app.post("/channel", async (req, res) => {
  try {
    const { key, reference } = req.body;

    if (!key || !reference) {
      return res.status(400).json({
        error: "Bad Request",
        message: 'Os parâmetros "key" e "reference" são obrigatórios',
      });
    }

    if (!validateApiKey(key)) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Chave de API inválida",
      });
    }

    let domain;
    try {
      domain = reference.replace(/^(https?:\/\/)?(www\.)?/, "");
      domain = domain.split("/")[0];
    } catch (error) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Referência inválida",
      });
    }

    const filePath = `${domain}/config.json`;

    const [exists] = await storage.bucket(bucketName).file(filePath).exists();
    if (!exists) {
      return res.status(404).json({
        error: "Not Found",
        message: "Configuração não encontrada para a referência fornecida",
      });
    }

    const [content] = await storage.bucket(bucketName).file(filePath).download();
    const configData = JSON.parse(content.toString());

    return res.status(200).json(configData);
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Ocorreu um erro ao processar sua solicitação",
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).send("Channel API está funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});