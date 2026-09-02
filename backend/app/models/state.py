from typing import Annotated
from pydantic import BaseModel


def _add_to_list(existing: list, new: list) -> list:
    return existing + new


class InterviewState(BaseModel):
    """LangGraph state for an interview session."""

    user_id: str = ""
    role: str = ""
    resume_context: str = ""
    max_questions: int = 5

    current_question: dict | None = None
    questions_asked: Annotated[list[dict], _add_to_list] = []
    question_count: int = 0

    current_answer: str = ""
    current_evaluation: dict | None = None

    is_complete: bool = False
    report: dict | None = None
