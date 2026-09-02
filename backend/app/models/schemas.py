from pydantic import BaseModel


class StartInterviewRequest(BaseModel):
    role: str
    job_description: str


class AnswerRequest(BaseModel):
    session_id: str
    answer: str


class QuestionResponse(BaseModel):
    id: str
    text: str
    type: str


class EvaluationResponse(BaseModel):
    score: int
    feedback: str


class ReportResponse(BaseModel):
    session_id: str
    total_score: int
    strengths: list[str]
    weaknesses: list[str]
    summary: str
    questions: list[dict]
