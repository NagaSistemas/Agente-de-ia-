import os
from dotenv import load_dotenv
from llama_index.llms.openai import OpenAI
import pandas as pd
from loader import load_qa_from_csv

load_dotenv()

# DeepSeek API
deepseek_key = os.getenv("DEEPSEEK_API_KEY", "sk-94b3a551443148f59500c0644ec2e5f0")

def setup_engine():
    # Carrega dados do CSV
    qa_data = load_qa_from_csv()
    return qa_data

def answer_with_context(qa_data, pergunta):
    # Busca simples por texto
    pergunta_lower = pergunta.lower()
    
    # Procura por perguntas similares
    matches = []
    for _, row in qa_data.iterrows():
        if any(word in row['pergunta'].lower() for word in pergunta_lower.split()):
            matches.append(f"Pergunta: {row['pergunta']}\nResposta: {row['resposta']}")
    
    # Se não encontrou matches, usa toda a base
    if not matches:
        matches = [f"Pergunta: {row['pergunta']}\nResposta: {row['resposta']}" for _, row in qa_data.iterrows()]
    
    context = "\n\n".join(matches[:5])  # Limita a 5 matches
    
    prompt = (
        "Você é um assistente inteligente. Use as informações abaixo para responder.\n"
        "Se não souber, diga que não sabe.\n\n"
        f"{context}\n\n"
        f"Pergunta do usuário: {pergunta}\n"
        "Resposta:"
    )
    
    llm = OpenAI(
        api_key=deepseek_key,
        base_url="https://api.deepseek.com/v1",
        model="deepseek-chat"
    )
    
    class SimpleResponse:
        def __init__(self, text):
            self.text = text
    
    resposta = llm.complete(prompt)
    return SimpleResponse(str(resposta))