import pandas as pd

def load_qa_from_csv(path):
    df = pd.read_csv(path)
    docs = [f"Pergunta: {row['pergunta']}\nResposta: {row['resposta']}" for _, row in df.iterrows()]
    return docs
