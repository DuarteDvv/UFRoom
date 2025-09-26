

from simple_agent.utils.state import State
from simple_agent.utils.context import ContextSchema
from simple_agent.utils.prompt import PROMPT_RECLAMACOES, PROMPT_DUVIDAS
from langchain_google_genai import ChatGoogleGenerativeAI

from langchain_core.messages import SystemMessage
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.runtime import Runtime
from dotenv import load_dotenv
import time
import os



load_dotenv()

MODEL_NAME = "gemini-2.5-flash"

chat_model = gllm = ChatGoogleGenerativeAI(
        api_key=os.getenv("GOOGLE_API_KEY"),
        model=MODEL_NAME,
        temperature=1,
        max_tokens=1024,
        timeout=None,
        max_retries=2,            
    )


init_graph = StateGraph(state_schema=State, context_schema=ContextSchema)


def chatbot(state: State, runtime: Runtime[ContextSchema]) -> State:

    user_name = runtime.context.user_name or "Cliente"
    type = runtime.context.type or "duvidas"  # 'reclamacoes' ou 'duvidas'

    if type == "reclamacoes":
        prompt = PROMPT_RECLAMACOES
    else:
        prompt = PROMPT_DUVIDAS

    response = chat_model.invoke(
        [
            SystemMessage(content=prompt.format(
                user_name=user_name,
                current_date=time.strftime("%d/%m/%Y")
            )),
            *state["messages"]
        ]
    )

    return {
        "messages": [response],
    }


init_graph.add_node(chatbot, name="chatbot", description="Chatbot that responds to user messages")
init_graph.add_edge(START, "chatbot")
init_graph.add_edge("chatbot", END)

memory = InMemorySaver()

graph = (init_graph.compile(checkpointer=memory))