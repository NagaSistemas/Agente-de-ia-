import os
from dotenv import load_dotenv
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.llms.openai import OpenAI
from llama_index.core.schema import Document

from loader import load_qa_from_csv

load_dotenv()

# DeepSeek API
deepseek_key = os.getenv("DEEPSEEK_API_KEY", "sk-94b3a551443148f59500c0644ec2e5f0")

def setup_engine():
    # Carregar os pares de pergunta e resposta
    qa_pairs = load_qa_from_csv("data/base.csv")
    documents = [Document(text=qa) for qa in qa_pairs]

    # Configuração do LLM globalmente - DeepSeek
    Settings.llm = OpenAI(
        api_key=deepseek_key,
        base_url="https://api.deepseek.com/v1",
        model="deepseek-chat"
    )

    # Criar o índice
    index = VectorStoreIndex.from_documents(documents)
    return index

# NOVA FUNÇÃO:
def answer_with_context(index, pergunta):
    query_engine = index.as_query_engine()
    # Remove o top_k
    result = query_engine.retrieve(pergunta)

    # Se result não for lista, transforme em lista
    if not isinstance(result, list):
        result = [result]

    context = "\n\n".join([
        doc.text for doc in result if hasattr(doc, "text")
    ])

    prompt = (
        "Você é um assistente inteligente treinado em uma base de perguntas e respostas.\n"
        "Use TODAS as informações abaixo para formular uma resposta clara, resumida e útil para o usuário.\n"
        "Se existirem várias respostas relacionadas, combine ou resuma de forma didática.\n"
        "Se não souber, diga que não sabe. Não invente.\n"
        "\n"
        f"{context}\n\n"
        f"Pergunta do usuário: {pergunta}\n"
        "Resposta:"
    )

    llm = OpenAI(
        api_key=deepseek_key,
        base_url="https://api.deepseek.com/v1",
        model="deepseek-chat"
    )
    resposta = llm.complete(prompt)
    return resposta
