"""
Redis RQ worker for background answer evaluation.

Run with: rq worker evaluation --url redis://localhost:6379
"""

import asyncio
import json

from openai import AsyncOpenAI

from app.core.config import settings

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


def evaluate_answer_sync(
    question: str, question_type: str, answer: str, resume_context: str
) -> dict:
    """Synchronous wrapper for background evaluation via RQ."""
    return asyncio.run(
        _evaluate(question, question_type, answer, resume_context)
    )


async def _evaluate(
    question: str, question_type: str, answer: str, resume_context: str
) -> dict:
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
                    "Return JSON: {\"score\": 7, \"feedback\": \"...\"}"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Question: {question}\n"
                    f"Question Type: {question_type}\n"
                    f"Answer: {answer}\n\n"
                    f"Resume Context:\n{resume_context}"
                ),
            },
        ],
    )

    return json.loads(response.choices[0].message.content)
