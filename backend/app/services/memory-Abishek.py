import os

from app.core.config import settings

_memory = None


def _get_memory():
    global _memory
    if _memory is None:
        config = {
            "llm": {
                "provider": "groq",
                "config": {
                    "model": "openai/gpt-oss-120b",  # <-- Updated to active model
                    "api_key": settings.groq_api_key,
                },
            },
            "embedder": {
                "provider": "huggingface",
                "config": {
                    "model": "all-MiniLM-L6-v2",
                },
            },
            "vector_store": {
                "provider": "qdrant",
                "config": {
                    "collection_name": "interview_memories",
                    "path": "/tmp/mem0_qdrant",
                    "embedding_model_dims": 384,
                }
            }
        }
        from mem0 import Memory
        _memory = Memory.from_config(config)
    return _memory


async def store_performance(user_id: str, session_data: dict) -> None:
    """Store interview performance in Mem0 for long-term tracking."""
    summary = (
        f"Interview for {session_data.get('role', 'Unknown')}: "
        f"Score {session_data.get('total_score', 'N/A')}. "
        f"Strengths: {', '.join(session_data.get('strengths', []))}. "
        f"Weaknesses: {', '.join(session_data.get('weaknesses', []))}."
    )
    _get_memory().add(summary, user_id=user_id)


async def get_user_history(user_id: str) -> list[dict]:
    """Retrieve user's past performance memories."""
    memories = _get_memory().get_all(filters={"user_id": user_id})
    return memories.get("results", []) if isinstance(memories, dict) else memories


async def get_weak_areas(user_id: str) -> str:
    """Search for user's known weak areas to focus on."""
    results = _get_memory().search("weaknesses and areas to improve", filters={"user_id": user_id})
    if not results:
        return ""
    entries = results.get("results", []) if isinstance(results, dict) else results
    return "\n".join(entry.get("memory", "") for entry in entries[:3])