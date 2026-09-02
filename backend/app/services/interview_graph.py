from langgraph.graph import StateGraph, END

from app.models.state import InterviewState
from app.services.rag import retrieve_context
from app.services.evaluator import (
    generate_question as gen_question,
    evaluate_answer as eval_answer,
    generate_report as gen_report,
)


async def fetch_context(state: InterviewState) -> dict:
    """Retrieve resume/JD context via RAG."""
    context = await retrieve_context(
        state.user_id, f"Interview question for {state.role}"
    )
    return {"resume_context": context}


async def generate_question(state: InterviewState) -> dict:
    """Generate the next interview question."""
    question = await gen_question(
        state.role, state.resume_context, state.questions_asked
    )
    question["id"] = f"q{state.question_count + 1}"
    return {"current_question": question}


async def process_answer(state: InterviewState) -> dict:
    """Evaluate the current answer."""
    evaluation = await eval_answer(
        state.current_question, state.current_answer, state.resume_context
    )

    completed_question = {
        **state.current_question,
        "answer": state.current_answer,
        "score": evaluation["score"],
        "feedback": evaluation["feedback"],
    }

    return {
        "current_evaluation": evaluation,
        "questions_asked": [completed_question],
        "question_count": state.question_count + 1,
    }


def should_continue(state: InterviewState) -> str:
    """Decide whether to ask another question or generate the report."""
    if state.question_count >= state.max_questions:
        return "generate_report"
    return "generate_question"


async def create_report(state: InterviewState) -> dict:
    """Generate the final interview report."""
    report = await gen_report(state.questions_asked, state.role)
    report["questions"] = state.questions_asked
    return {"report": report, "is_complete": True}


def build_interview_graph() -> StateGraph:
    """Build and compile the interview workflow graph."""
    graph = StateGraph(InterviewState)

    graph.add_node("fetch_context", fetch_context)
    graph.add_node("generate_question", generate_question)
    graph.add_node("process_answer", process_answer)
    graph.add_node("generate_report", create_report)

    graph.set_entry_point("fetch_context")
    graph.add_edge("fetch_context", "generate_question")
    # generate_question is a pause point — we wait for user answer
    # process_answer is called when user submits answer
    graph.add_conditional_edges(
        "process_answer",
        should_continue,
        {
            "generate_question": "generate_question",
            "generate_report": "generate_report",
        },
    )
    graph.add_edge("generate_report", END)

    return graph.compile()


interview_graph = build_interview_graph()
