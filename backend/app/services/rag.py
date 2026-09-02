import chromadb
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

from app.core.config import settings

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
)

_embeddings: OpenAIEmbeddings | None = None


def _get_embeddings() -> OpenAIEmbeddings:
    global _embeddings
    if _embeddings is None:
        _embeddings = OpenAIEmbeddings(openai_api_key=settings.openai_api_key)
    return _embeddings


def _get_vector_store(user_id: str) -> Chroma:
    client = chromadb.HttpClient(
        host=settings.chroma_host,
        port=settings.chroma_port,
    )
    return Chroma(
        client=client,
        collection_name=f"user_{user_id}",
        embedding_function=_get_embeddings(),
    )


async def process_resume(user_id: str, resume_path: str) -> None:
    """Load resume, chunk it, and embed into ChromaDB."""
    resume_docs = PyPDFLoader(resume_path).load()

    for doc in resume_docs:
        doc.metadata["source"] = "resume"

    chunks = text_splitter.split_documents(resume_docs)

    # Clear old embeddings
    vector_store = _get_vector_store(user_id)
    try:
        vector_store.delete_collection()
    except Exception:
        pass

    vector_store = _get_vector_store(user_id)
    vector_store.add_documents(chunks)


async def retrieve_context(user_id: str, query: str, k: int = 4) -> str:
    """Retrieve relevant chunks from the user's vector store."""
    vector_store = _get_vector_store(user_id)
    results = vector_store.similarity_search(query, k=k)
    return "\n\n".join(doc.page_content for doc in results)
