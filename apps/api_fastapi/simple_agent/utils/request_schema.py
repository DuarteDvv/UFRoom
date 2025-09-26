from pydantic import BaseModel
from typing import List


class AnswerRequest(BaseModel):

    message: str
    user_name: str
    type: str  # 'reclamacoes' ou 'duvidas'
    thread_id: str


class ClearThreadsRequest(BaseModel):

    thread_ids: List[str]