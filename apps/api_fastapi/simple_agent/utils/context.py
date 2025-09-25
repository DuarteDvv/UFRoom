from dataclasses import dataclass


@dataclass
class ContextSchema:  

    user_name: str
    type: str  # 'reclamacoes' ou 'duvidas'