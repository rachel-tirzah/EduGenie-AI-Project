from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

from qna import answer_question
from explanation_module import explain_topic
from quiz_module import generate_quiz
from summary_module import summarize_text
from learning_path import recommend_learning_path

load_dotenv()

app = FastAPI(title="EduGenie")

templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"request": request}
    )

@app.get("/health")
async def health():
    return {"status": "EduGenie is running!"}


@app.post("/qa")
async def qa(data: dict):
    question = data.get("text", "")
    return {"result": answer_question(question)}


@app.post("/explain")
async def explain(data: dict):
    topic = data.get("text", "")
    return {"result": explain_topic(topic)}


@app.post("/quiz")
async def quiz(data: dict):
    topic = data.get("text", "")
    return {"result": generate_quiz(topic)}


@app.post("/summarize")
async def summarize(data: dict):
    text = data.get("text", "")
    return {"result": summarize_text(text)}


@app.post("/learn/recommendations")
async def recommendations(data: dict):
    topic = data.get("text", "")
    return {"result": recommend_learning_path(topic)}