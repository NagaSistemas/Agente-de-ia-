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
    # Carregar prompt personalizado
    try:
        with open("data/prompt.txt", "r", encoding="utf-8") as f:
            prompt_personalizado = f.read().strip()
    except:
        prompt_personalizado = "Você é um assistente virtual prestativo."
    
    # Usar APENAS o prompt personalizado
    prompt = f"""{prompt_personalizado}

Pergunta do cliente: {pergunta}

Sua resposta:"""
    
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
            resposta_texto = "Desculpe, estou com dificuldades técnicas no momento. Tente novamente em instantes."
    
    except Exception as e:
        resposta_texto = "Desculpe, estou com dificuldades técnicas no momento. Tente novamente em instantes."
    
    class SimpleResponse:
        def __init__(self, text):
            self.text = text
    
    return SimpleResponse(resposta_texto)