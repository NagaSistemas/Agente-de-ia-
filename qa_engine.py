import os
import requests
from dotenv import load_dotenv
import pandas as pd
from loader import load_qa_from_csv

load_dotenv()

# DeepSeek API
deepseek_key = os.getenv("DEEPSEEK_API_KEY", "sk-94b3a551443148f59500c0644ec2e5f0")

def setup_engine():
    # Carrega dados do CSV
    qa_data = load_qa_from_csv("data/base.csv")
    return qa_data

def answer_with_context(qa_data, pergunta):
    # Busca nas perguntas cadastradas
    pergunta_lower = pergunta.lower()
    context = ""
    
    # Procura por perguntas similares
    for _, row in qa_data.iterrows():
        if any(word in row['pergunta'].lower() for word in pergunta_lower.split() if len(word) > 2):
            context += f"Pergunta: {row['pergunta']}\nResposta: {row['resposta']}\n\n"
    
    # Se não encontrou contexto, usa todas as perguntas
    if not context:
        for _, row in qa_data.iterrows():
            context += f"Pergunta: {row['pergunta']}\nResposta: {row['resposta']}\n\n"
    
    # Carregar prompt personalizado
    try:
        with open("data/prompt.txt", "r", encoding="utf-8") as f:
            prompt_personalizado = f.read().strip()
    except:
        prompt_personalizado = "Você é Naga IA, um assistente virtual prestativo."
    
    # Prompt completo com contexto personalizado + base de conhecimento
    prompt = f"""{prompt_personalizado}

## Base de Conhecimento (Perguntas e Respostas):
{context}

## Pergunta do usuário:
{pergunta}

## Sua resposta:"""
    
    try:
        response = requests.post(
            "https://api.deepseek.com/chat/completions",
            headers={
                "Authorization": f"Bearer {deepseek_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "deepseek-chat",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 500,
                "temperature": 0.7
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            resposta_texto = result['choices'][0]['message']['content']
        else:
            # Fallback: busca simples
            resposta_texto = "Sistema funcionando em modo básico."
            for _, row in qa_data.iterrows():
                if any(word in row['pergunta'].lower() for word in pergunta_lower.split() if len(word) > 2):
                    resposta_texto = row['resposta']
                    break
    
    except Exception as e:
        # Fallback: busca simples
        resposta_texto = "Sistema funcionando em modo básico."
        for _, row in qa_data.iterrows():
            if any(word in row['pergunta'].lower() for word in pergunta_lower.split() if len(word) > 2):
                resposta_texto = row['resposta']
                break
    
    class SimpleResponse:
        def __init__(self, text):
            self.text = text
    
    return SimpleResponse(resposta_texto)