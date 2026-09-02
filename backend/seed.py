"""
Seed script — creates a demo user and interview sessions.

Demo credentials:
  sarah@nextround.com  /  password123

Usage:
  cd backend
  python seed.py
"""
import asyncio
import uuid
from datetime import datetime, timezone

from sqlalchemy import delete

from app.core.auth import hash_password
from app.core.database import async_session, init_db
from app.models.db_models import UserModel, SessionModel


# ---------------------------------------------------------------------------
# Sample data
# ---------------------------------------------------------------------------

USERS = [
    {"id": "seed-user-001", "name": "Sarah Joseph", "email": "sarah@nextround.com"},
]

PASSWORD = "password123"

RESUME_CONTEXT = """
Candidate has 4 years of experience in full-stack web development.
Proficient in React, TypeScript, Node.js, and Python.
Has worked at two early-stage startups and one mid-size SaaS company.
Strong background in REST API design and PostgreSQL.
Familiar with Docker, CI/CD pipelines, and AWS basics.
"""


def _session(user_id: str, role: str, questions: list, report: dict | None, is_complete: bool, current_question: dict | None = None, created_at: datetime | None = None) -> SessionModel:
    return SessionModel(
        id=str(uuid.uuid4()),
        user_id=user_id,
        role=role,
        max_questions=5,
        question_count=len(questions),
        is_complete=is_complete,
        resume_context=RESUME_CONTEXT,
        questions=questions,
        current_question=current_question,
        report=report,
        created_at=created_at or datetime.now(timezone.utc),
    )


# ---------------------------------------------------------------------------
# Session 1 — Frontend Developer (completed)
# ---------------------------------------------------------------------------

FRONTEND_QUESTIONS = [
    {
        "id": "q1",
        "text": "Can you walk me through how React's reconciliation algorithm works and when you'd use the key prop?",
        "type": "behavioral",
        "answer": "React's reconciliation compares the virtual DOM tree with the previous one using a diffing algorithm. It assumes components of different types produce different trees, and uses the key prop to identify which list items have changed, been added, or removed. I use stable unique keys from data IDs rather than array indexes to avoid subtle bugs when items reorder.",
        "score": 8,
        "feedback": "Strong answer covering the core concept and a practical pitfall. Could mention the fiber architecture for extra depth.",
    },
    {
        "id": "q2",
        "text": "Describe a time you had to optimise a slow React application. What steps did you take?",
        "type": "behavioral",
        "answer": "At my last job our dashboard was re-rendering every second due to a real-time feed. I profiled with React DevTools, found a large table re-rendering fully on each tick. I wrapped it in React.memo and moved the subscription into a separate component so only the counter updated. Render time dropped from 80ms to 4ms.",
        "score": 9,
        "feedback": "Excellent — specific, measurable outcome and a clear problem-solving narrative. Well structured.",
    },
    {
        "id": "q3",
        "text": "Explain the difference between CSS Grid and Flexbox and when you would choose one over the other.",
        "type": "written",
        "answer": "Flexbox is one-dimensional — great for aligning items along a single axis like a nav bar or a row of cards. Grid is two-dimensional, letting you control rows and columns simultaneously. I use Flexbox for component-level layout and Grid for page-level layout or anything needing precise two-axis control.",
        "score": 7,
        "feedback": "Correct and concise. Could strengthen with a concrete example of a layout that specifically needed Grid.",
    },
    {
        "id": "q4",
        "text": "How does the JavaScript event loop work? Explain with reference to the call stack, task queue, and microtask queue.",
        "type": "coding",
        "answer": "The call stack executes synchronous code. When it's empty the event loop checks the microtask queue first — this is where Promise callbacks and queueMicrotask live. Only after all microtasks are drained does it pull from the task queue for things like setTimeout callbacks. This is why a resolved Promise callback always runs before a setTimeout even with 0ms delay.",
        "score": 9,
        "feedback": "Thorough and accurate, including the priority of microtasks over tasks. One of the best explanations of this topic.",
    },
    {
        "id": "q5",
        "text": "What strategies do you use to manage global state in large React applications?",
        "type": "behavioral",
        "answer": "I start with React Query for server state since it handles caching and background refetching automatically. For client-only global state I use Zustand — it's minimal, no boilerplate, and the selector pattern prevents unnecessary re-renders. I avoid putting server data into Zustand to keep the two concerns separate.",
        "score": 8,
        "feedback": "Good separation of server vs client state. Mentioning the selector pattern shows real-world awareness.",
    },
]

FRONTEND_REPORT = {
    "total_score": 8.2,
    "strengths": [
        "Deep understanding of React internals and performance optimisation",
        "Ability to communicate technical trade-offs clearly",
        "Strong grasp of JavaScript fundamentals including the event loop",
    ],
    "weaknesses": [
        "CSS answers could include more concrete layout examples",
        "Could demonstrate deeper knowledge of state management patterns at scale",
    ],
    "summary": "Strong frontend candidate with solid React and JavaScript fundamentals. Demonstrates practical experience optimising real applications. CSS and layout knowledge is adequate but could be sharpened for senior-level roles.",
    "questions": FRONTEND_QUESTIONS,
}


# ---------------------------------------------------------------------------
# Session 2 — Python Backend Developer (in progress)
# ---------------------------------------------------------------------------

PYTHON_QUESTIONS_ANSWERED = [
    {
        "id": "q1",
        "text": "What is the difference between a list and a tuple in Python, and when would you use each?",
        "type": "written",
        "answer": "Lists are mutable and tuples are immutable. I use tuples for fixed collections of heterogeneous data — like a (latitude, longitude) coordinate — and lists for homogeneous collections that will change. Tuples are also slightly faster and can be used as dictionary keys.",
        "score": 7,
        "feedback": "Correct. Good mention of dictionary key use case — that often trips people up.",
    },
    {
        "id": "q2",
        "text": "Explain Python's GIL and its implications for multi-threaded programs.",
        "type": "coding",
        "answer": "The Global Interpreter Lock ensures only one thread executes Python bytecode at a time, which means CPU-bound tasks don't benefit from threading. For CPU-bound work I'd use multiprocessing instead. The GIL doesn't affect I/O-bound work much since threads release it while waiting, so asyncio or threading both work fine there.",
        "score": 8,
        "feedback": "Clear and accurate. Good distinction between CPU-bound and I/O-bound cases.",
    },
]

PYTHON_CURRENT_QUESTION = {
    "id": "q3",
    "text": "How does Python's asyncio event loop work, and how does it differ from multi-threading?",
    "type": "coding",
}


# ---------------------------------------------------------------------------
# Session 3 — Senior Full Stack Engineer (completed)
# ---------------------------------------------------------------------------

FULLSTACK_QUESTIONS = [
    {
        "id": "q1",
        "text": "Walk me through how you'd design a REST API for a multi-tenant SaaS dashboard.",
        "type": "behavioral",
        "answer": "I'd start by scoping every resource by tenant_id at the database level — either with a discriminator column and row-level security, or fully separate schemas if isolation requirements are strict. Authentication issues a JWT with the tenant_id baked in, and middleware enforces it on every request so a leaky controller can't accidentally cross tenants. Endpoints follow standard REST conventions; I'd version the API as /v1/ from day one.",
        "score": 8,
        "feedback": "Solid grasp of multi-tenant patterns. Mentioning row-level security shows real-world maturity.",
    },
    {
        "id": "q2",
        "text": "How would you set up CI/CD for a service that deploys to AWS ECS, including database migrations?",
        "type": "coding",
        "answer": "GitHub Actions runs tests on PR, then on merge to main builds a Docker image, tags it with the commit SHA, and pushes to ECR. A separate deploy job updates the ECS task definition and triggers a rolling deploy. Migrations run as a one-shot ECS task before the new revision goes live — that way if the migration fails, the new code never serves traffic.",
        "score": 8,
        "feedback": "Pragmatic and correct. Running migrations as a one-shot task before deploy is the right pattern.",
    },
    {
        "id": "q3",
        "text": "Your PostgreSQL database is suddenly slow. Walk me through how you'd diagnose it.",
        "type": "behavioral",
        "answer": "First I'd check pg_stat_activity for long-running or blocked queries. If something's stuck, I'd look at locks via pg_locks. Then pg_stat_statements to see which queries account for the most total time — slow queries that run often are usually the culprit. EXPLAIN ANALYZE on the worst offenders to check for missing indexes or bad plans. If it's not query-related, I'd check disk I/O and connection pool saturation.",
        "score": 9,
        "feedback": "Excellent — methodical from cheap checks to expensive ones, and you covered both query and infrastructure causes.",
    },
    {
        "id": "q4",
        "text": "Explain how JWT authentication works and what its main security pitfalls are.",
        "type": "written",
        "answer": "A JWT is a signed token with a header, payload, and signature. The server signs it with a secret on login; the client sends it back on each request and the server verifies the signature without hitting the database. The pitfalls: tokens can't be revoked easily so I keep expiry short and pair them with refresh tokens; sensitive data should never go in the payload since it's only base64-encoded; and the alg field should be validated server-side to prevent the alg:none attack.",
        "score": 8,
        "feedback": "Strong — the alg:none mention shows you've thought about the attack surface, not just the happy path.",
    },
    {
        "id": "q5",
        "text": "Describe a production incident you handled and what you learned from it.",
        "type": "behavioral",
        "answer": "We had a memory leak in a Node.js service that took down the API every 6 hours. I correlated the OOM kills with deploys and narrowed it to a recently added in-memory cache that wasn't bounded. I added an LRU limit and a metric for cache size so we'd catch it earlier next time. The lesson was that any in-memory data structure should have an explicit upper bound from day one.",
        "score": 7,
        "feedback": "Good incident narrative with a real fix. Could have mentioned how you communicated status during the incident.",
    },
]

FULLSTACK_REPORT = {
    "total_score": 8.0,
    "strengths": [
        "Strong systems thinking across both application and infrastructure layers",
        "Pragmatic approach to security and deployment patterns",
        "Methodical debugging instincts grounded in real production experience",
    ],
    "weaknesses": [
        "Could elaborate more on incident communication and team coordination",
        "Multi-tenant answer could go deeper on cost/isolation trade-offs",
    ],
    "summary": "Well-rounded full stack engineer with strong production instincts. Comfortable across the stack from API design to deployment. Good fit for senior roles where breadth matters as much as depth.",
    "questions": FULLSTACK_QUESTIONS,
}


# ---------------------------------------------------------------------------
# Session 4 — Data Engineer (completed)
# ---------------------------------------------------------------------------

DATA_QUESTIONS = [
    {
        "id": "q1",
        "text": "How would you design a data pipeline that ingests 50M events per day and exposes hourly aggregates?",
        "type": "behavioral",
        "answer": "I'd land raw events in S3 partitioned by hour using something like Kinesis Firehose for buffering and back-pressure. A scheduled Spark or DuckDB job rolls up the partition into hourly aggregates and writes to a columnar table in Snowflake or BigQuery. Idempotency comes from partition-keyed writes — re-running an hour overwrites cleanly. Late events get reprocessed by re-running the affected partitions.",
        "score": 8,
        "feedback": "Good end-to-end design. Calling out idempotency and late-event handling shows production maturity.",
    },
    {
        "id": "q2",
        "text": "Explain the difference between OLTP and OLAP databases and when you'd reach for each.",
        "type": "written",
        "answer": "OLTP databases like Postgres are optimised for many small transactions — row-oriented, indexed for point lookups. OLAP databases like BigQuery or ClickHouse are columnar and optimised for scanning large slices of a few columns at a time. I use OLTP behind application APIs and OLAP for analytics, dashboards, and ML feature pipelines. Mixing the two in one workload usually means one of them does its job poorly.",
        "score": 8,
        "feedback": "Crisp and accurate. The 'one does its job poorly' line is a strong way to frame the trade-off.",
    },
    {
        "id": "q3",
        "text": "How do you handle schema evolution in a data lake without breaking downstream consumers?",
        "type": "coding",
        "answer": "I use a format that supports schema evolution natively — Parquet with a schema registry, or Iceberg / Delta which track schema versions. New columns are additive by default. For breaking changes I version the dataset path (events/v2/) and keep the old version live for a deprecation window so consumers can migrate on their own timeline. Schema changes go through review with the downstream owners.",
        "score": 7,
        "feedback": "Solid practical approach. Could mention contract testing or schema validation in CI for extra rigour.",
    },
    {
        "id": "q4",
        "text": "Walk me through how you'd debug a Spark job that's suddenly 5x slower than yesterday.",
        "type": "behavioral",
        "answer": "First I'd check the Spark UI for stage timings and look for skew — one task running far longer than the rest usually means a hot key. I'd compare input size vs yesterday in case the data volume changed unexpectedly. Then check shuffle read/write — if it ballooned, an upstream change probably broke a partition strategy. If nothing's obviously different, I'd look at executor memory pressure and GC time before assuming infra issues.",
        "score": 8,
        "feedback": "Methodical and grounded in real Spark debugging. Skew is the right first thing to check.",
    },
    {
        "id": "q5",
        "text": "How would you ensure data quality in a pipeline that feeds an executive dashboard?",
        "type": "behavioral",
        "answer": "I'd add expectation-based tests at every transformation boundary — row counts, null rates, value ranges, and uniqueness checks using something like Great Expectations or dbt tests. Failures block downstream models from running, and the dashboard shows a 'last refreshed' timestamp so stakeholders never see stale data silently. I also alert on metric anomalies — a 30% drop in daily active users is more often a pipeline bug than a real signal.",
        "score": 9,
        "feedback": "Excellent — covering both schema-level checks and metric-level anomaly detection is exactly right for executive dashboards.",
    },
]

DATA_REPORT = {
    "total_score": 8.0,
    "strengths": [
        "Strong instincts around production data quality and observability",
        "Pragmatic understanding of OLTP vs OLAP trade-offs",
        "Methodical debugging approach grounded in real Spark experience",
    ],
    "weaknesses": [
        "Schema evolution answer could go deeper on contract testing",
        "Could elaborate more on cost optimisation patterns at scale",
    ],
    "summary": "Solid data engineer with strong production instincts. Comfortable across batch and streaming patterns. Data quality answer was a standout — exactly the mindset you want feeding an exec dashboard.",
    "questions": DATA_QUESTIONS,
}


# ---------------------------------------------------------------------------
# Session 5 — DevOps Engineer (in progress)
# ---------------------------------------------------------------------------

DEVOPS_QUESTIONS_ANSWERED = [
    {
        "id": "q1",
        "text": "Explain the difference between blue-green and canary deployments. When would you choose each?",
        "type": "written",
        "answer": "Blue-green keeps two identical environments and switches all traffic at once after the new version is verified — fast rollback, but you need double the capacity briefly. Canary shifts traffic gradually (1%, 10%, 50%) so problems show up before they hit everyone. I use canary for stateful or risky changes where I want to watch metrics ramp; blue-green for stateless services where the binary just needs to be swapped quickly.",
        "score": 8,
        "feedback": "Good practical distinction. The 'when' answer shows you've actually run both, not just read about them.",
    },
    {
        "id": "q2",
        "text": "How do you manage secrets across multiple environments without leaking them into git or CI logs?",
        "type": "coding",
        "answer": "Secrets live in a dedicated store — AWS Secrets Manager or HashiCorp Vault — and the application fetches them at startup with an IAM role, not a long-lived key. CI pipelines use OIDC to assume short-lived roles instead of stored credentials. For local dev, .env.example is committed but .env is gitignored, and I scan PRs with gitleaks to catch accidental commits.",
        "score": 8,
        "feedback": "Strong layered approach. OIDC for CI is the modern best practice — good to see it called out specifically.",
    },
    {
        "id": "q3",
        "text": "Walk me through how you'd set up monitoring and alerting for a new microservice.",
        "type": "behavioral",
        "answer": "I'd start with the four golden signals — latency, traffic, errors, saturation — exposed as Prometheus metrics. Dashboards in Grafana show them at p50/p95/p99. Alerts fire on SLO burn rate, not raw thresholds, so a slow erosion pages just like a sudden spike. Logs go to Loki or CloudWatch with trace IDs so I can pivot from a metric anomaly to the exact requests that caused it.",
        "score": 9,
        "feedback": "Excellent — golden signals + SLO burn rate + trace correlation is a textbook modern observability setup.",
    },
]

DEVOPS_CURRENT_QUESTION = {
    "id": "q4",
    "text": "Describe a Kubernetes incident you've handled and what you learned from it.",
    "type": "behavioral",
}


# ---------------------------------------------------------------------------
# Seed runner
# ---------------------------------------------------------------------------

async def seed():
    print("Initialising database...")
    await init_db()

    async with async_session() as db:
        print("Clearing existing seed data...")
        seed_ids = [u["id"] for u in USERS]
        await db.execute(delete(SessionModel).where(SessionModel.user_id.in_(seed_ids)))
        await db.execute(delete(UserModel).where(UserModel.id.in_(seed_ids)))
        await db.commit()

        print("Creating users...")
        hashed = hash_password(PASSWORD)
        for u in USERS:
            db.add(UserModel(id=u["id"], name=u["name"], email=u["email"], password=hashed))
        await db.commit()

        print("Creating sessions for Sarah...")
        db.add(_session(
            user_id="seed-user-001",
            role="Frontend Developer",
            questions=FRONTEND_QUESTIONS,
            report=FRONTEND_REPORT,
            is_complete=True,
            created_at=datetime(2026, 1, 6, 10, 15, tzinfo=timezone.utc),
        ))
        db.add(_session(
            user_id="seed-user-001",
            role="Senior Full Stack Engineer",
            questions=FULLSTACK_QUESTIONS,
            report=FULLSTACK_REPORT,
            is_complete=True,
            created_at=datetime(2026, 1, 12, 14, 30, tzinfo=timezone.utc),
        ))
        db.add(_session(
            user_id="seed-user-001",
            role="Python Backend Developer",
            questions=PYTHON_QUESTIONS_ANSWERED,
            report=None,
            is_complete=False,
            current_question=PYTHON_CURRENT_QUESTION,
            created_at=datetime(2026, 1, 18, 9, 45, tzinfo=timezone.utc),
        ))
        db.add(_session(
            user_id="seed-user-001",
            role="Data Engineer",
            questions=DATA_QUESTIONS,
            report=DATA_REPORT,
            is_complete=True,
            created_at=datetime(2026, 1, 23, 16, 20, tzinfo=timezone.utc),
        ))
        db.add(_session(
            user_id="seed-user-001",
            role="DevOps Engineer",
            questions=DEVOPS_QUESTIONS_ANSWERED,
            report=None,
            is_complete=False,
            current_question=DEVOPS_CURRENT_QUESTION,
            created_at=datetime(2026, 1, 28, 11, 5, tzinfo=timezone.utc),
        ))
        await db.commit()

        print("\nDone! Demo credentials:")
        print("  sarah@nextround.com  /  password123  (5 sessions: 3 complete, 2 in progress)")


if __name__ == "__main__":
    asyncio.run(seed())