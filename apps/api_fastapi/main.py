from simple_agent.utils.request_schema import AnswerRequest, ClearThreadsRequest
from simple_agent.utils.context import ContextSchema
from simple_agent.utils.state import State
from simple_agent.agent import graph
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage, SystemMessage
from uuid import uuid4



@asynccontextmanager
async def lifespan(app: FastAPI):

    app.state.compiled_graph = graph

    try:
        yield
    finally:
        app.state.compiled_graph = None

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/answer")
async def answer(req: AnswerRequest):

    compiled_graph = app.state.compiled_graph

    if compiled_graph is None:
        raise HTTPException(status_code=500, detail="Graph não inicializado")

    raw_thread_id = (req.thread_id or "").strip()

    if not raw_thread_id:
        fallback_prefix = (req.type or "generic").strip() or "generic"
        raw_thread_id = f"{fallback_prefix}-{uuid4()}"

    config = {"configurable": {"thread_id": raw_thread_id}}
    
    initial_state = State(

        messages=[
            HumanMessage(content=req.message),
        ]
    )

    context = ContextSchema(
        user_name=req.user_name,
        type=req.type  # 'reclamacoes' ou 'duvidas'
    )

    result = compiled_graph.invoke(initial_state, config=config, context=context)

    loop = asyncio.get_running_loop()
    end_state = await loop.run_in_executor(None, lambda: result)

    messages = end_state.get("messages", []) or []

    if not messages:
        return {"resposta": "", "state": end_state}

    last = messages[-1]

    content = getattr(last, "content", None) or last.get("content", "")

    return {"resposta": content}


@app.post("/threads/clear")
async def clear_threads(req: ClearThreadsRequest):

    compiled_graph = app.state.compiled_graph

    if compiled_graph is None:
        raise HTTPException(status_code=500, detail="Graph não inicializado")

    checkpointer = getattr(compiled_graph, "checkpointer", None)

    if checkpointer is None:
        raise HTTPException(status_code=500, detail="Checkpointer não disponível")

    sanitized_ids = []
    seen = set()

    for raw_id in req.thread_ids:
        normalized = (raw_id or "").strip()
        if not normalized or normalized in seen:
            continue
        sanitized_ids.append(normalized)
        seen.add(normalized)

    cleared = []
    errors = []

    for thread_id in sanitized_ids:
        config = {"configurable": {"thread_id": thread_id}}
        try:
            delete_callable = getattr(checkpointer, "adelete", None)
            if callable(delete_callable):
                await delete_callable(config)
            else:
                delete_callable = getattr(checkpointer, "delete", None)
                if not callable(delete_callable):
                    raise RuntimeError("Operação de exclusão não suportada")
                result = delete_callable(config)
                if asyncio.iscoroutine(result):
                    await result
            cleared.append(thread_id)
        except Exception as exc:
            errors.append({"thread_id": thread_id, "error": str(exc)})

    return {"cleared": cleared, "errors": errors}