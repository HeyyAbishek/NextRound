import json
from groq import AsyncGroq
from app.core.config import settings

_client: AsyncGroq | None = None
# Updated to Groq's stable, non-decommissioned production model
GROQ_MODEL = "openai/gpt-oss-120b"

def _get_client() -> AsyncGroq:
    global _client
    if _client is None:
        _client = AsyncGroq(api_key=settings.groq_api_key)
    return _client

async def generate_question(
    role: str, resume_context: str, questions_asked: list[dict]
) -> dict:
    """Generate a tailored interview question based on role and resume context."""
    asked_questions = "\n".join(
        f"- {q['text']}" for q in questions_asked
    ) or "None yet"

    response = await _get_client().chat.completions.create(
        model=GROQ_MODEL,
        max_tokens=800,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a strict API. Generate ONE interview question tailored to the candidate's "
                    "resume and the role. "
                    "You MUST reply with ONLY a valid JSON object matching this exact schema: "
                    "{\"id\": \"unique_string\", \"text\": \"question_text\", \"type\": \"behavioral|coding|written\"}. "
                    "Do not include any Markdown formatting, code blocks, or conversational text."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Role: {role}\n\n"
                    f"Resume/JD Context:\n{resume_context}\n\n"
                    f"Previously asked:\n{asked_questions}\n\n"
                    f"Generate the next question."
                ),
            },
        ],
    )

    return json.loads(response.choices[0].message.content)

async def evaluate_answer(
    question: dict, answer: str, resume_context: str
) -> dict:
    """Evaluate the candidate's answer and return score + feedback."""
    response = await _get_client().chat.completions.create(
        model=GROQ_MODEL,
        max_tokens=1024,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a strict API evaluating a candidate's answer. "
                    "Score from 1-10 and provide brief, constructive feedback based on the resume context. "
                    "You MUST reply with ONLY a valid JSON object matching this exact schema: "
                    "{\"score\": 7, \"feedback\": \"feedback text\"}. "
                    "Do not include any Markdown formatting, code blocks, or conversational text."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Question: {question['text']}\n"
                    f"Question Type: {question['type']}\n"
                    f"Candidate's Answer: {answer}\n\n"
                    f"Resume Context:\n{resume_context}"
                ),
            },
        ],
    )

    return json.loads(response.choices[0].message.content)

async def generate_report(questions_asked: list[dict], role: str) -> dict:
    """Generate a final interview report with scores and feedback."""
    questions_summary = "\n".join(
        f"Q: {q['text']} | A: {q.get('answer', 'N/A')} | "
        f"Score: {q.get('score', 'N/A')} | Feedback: {q.get('feedback', 'N/A')}"
        for q in questions_asked
    )

    response = await _get_client().chat.completions.create(
        model=GROQ_MODEL,
        max_tokens=2048,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a strict API generating a final interview report. "
                    "You MUST reply with ONLY a valid JSON object matching this exact schema: "
                    "{\"total_score\": 75, \"strengths\": [\"s1\", \"s2\"], "
                    "\"weaknesses\": [\"w1\", \"w2\"], \"summary\": \"summary text\"}. "
                    "Do not include any Markdown formatting, code blocks, or conversational text."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Role: {role}\n\n"
                    f"Interview Results:\n{questions_summary}\n\n"
                    f"Generate the final report."
                ),
            },
        ],
    )

    return json.loads(response.choices[0].message.content)