import json

from openai import AsyncOpenAI

from app.core.config import settings

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


async def generate_question(
    role: str, resume_context: str, questions_asked: list[dict]
) -> dict:
    """Generate a tailored interview question based on role and resume context."""
    asked_questions = "\n".join(
        f"- {q['text']}" for q in questions_asked
    ) or "None yet"

    response = await _get_client().chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=300,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert interviewer. Generate ONE interview question "
                    "tailored to the candidate's resume and the role they are applying for. "
                    "The question should be different from previously asked questions. "
                    "Vary between behavioral, coding, and written question types. "
                    "Return JSON: {\"id\": \"q1\", \"text\": \"...\", \"type\": \"behavioral|coding|written\"}"
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
        model="gpt-4o-mini",
        max_tokens=300,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert interviewer evaluating a candidate's answer. "
                    "Score from 1-10 and provide brief, constructive feedback. "
                    "Consider the candidate's resume context when evaluating. "
                    "Return JSON: {\"score\": 7, \"feedback\": \"...\"}"
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
        model="gpt-4o-mini",
        max_tokens=500,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert career coach. Generate a final interview report. "
                    "Return JSON: {\"total_score\": 75, \"strengths\": [\"...\"], "
                    "\"weaknesses\": [\"...\"], \"summary\": \"...\"}"
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
