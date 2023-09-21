from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from config.database import Base, SessionLocal, engine

from app.models.user import User
from app.models.topic import Topic
from app.models.paper import Paper
from app.models.summary import Summary
from app.models.associations import user_topics_association
from app.schemas.user_schema import UserRegistrationSchema, UserResponseSchema
from app.routes.users import router as user_router


from fastapi.middleware.cors import CORSMiddleware

# Create the database tables
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
from services.services_manager import process_papers_for_topic, fetch_topics_from_db

# Initialize FastAPI App
app = FastAPI()

# Initialize Scheduler
scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def start_scheduler():
    """
    Starts the APScheduler at the startup of the FastAPI application.

    run_scheduled_service_tasks is called every day at 00:00:00.
    """
    await run_scheduled_service_tasks()
    scheduler.add_job(
        func=run_scheduled_service_tasks,
        trigger=CronTrigger(hour=0, minute=0, second=0),
    )
    scheduler.start()


# Middleware to manage database sessions
@app.middleware("http")
async def db_session_middleware(request: Request, call_next) -> Response:
    """
    Middleware to manage database sessions.

    Args:
        request (Request): The incoming HTTP request.
        call_next: The next middleware or endpoint to process the request.

    Returns:
        Response: The outgoing HTTP response.
    """
    response: Response = Response("Internal server error", status_code=500)
    try:
        request.state.db = SessionLocal()
        response = await call_next(request)
    finally:
        request.state.db.close()
    return response


# Import your routers here
from app.routes.users import router as user_router
from app.routes.topics import router as topic_router
from app.routes.papers import router as paper_router
from app.routes.summaries import router as summary_router
from app.routes.associations import router as association_router

# Include the routers in the app
app.include_router(user_router, prefix="/api", tags=["users"])
app.include_router(topic_router, prefix="/api", tags=["topics"])
app.include_router(paper_router, prefix="/api", tags=["papers"])
app.include_router(summary_router, prefix="/api", tags=["summaries"])
app.include_router(association_router, prefix="/api", tags=["associations"])


# CORS Middleware settings
origins = [
    "http://localhost:3000",  # The origin where your frontend runs
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)  # Create the database tables



def should_run_task() -> bool:
    """
    Checks if the scheduled task should run based on the last run time.

    Returns:
        bool: True if the task should run, False otherwise.
    """
    try:
        with open("last_run.txt", "r") as f:
            last_run = datetime.fromisoformat(f.read().strip())

        more_than_24_hours: bool = (datetime.now() - last_run).total_seconds() > 86400
        print(f"""\n{'_'*80}\ntry block\n{'_'*80}""")
        return more_than_24_hours
    except (FileNotFoundError, ValueError):
        print(f"""\n{'_'*80}\nexcept\n{'_'*80}""")
        # Create last_run.txt if it doesn't exist and write the current datetime
        with open("last_run.txt", "w") as f:
            f.write(datetime.now().isoformat())
        return True


async def run_scheduled_service_tasks() -> None:
    """
    Runs the scheduled task if the conditions defined in should_run_task are met.
    """
    print(f"""\n{'_'*80}\nrun_scheduled_service_tasks called...\n{'_'*80}""")
    if should_run_task():
        print(f"""\n{'_'*80}\should run task\n{'_'*80}""")
        db = SessionLocal()
        try:
            topics = fetch_topics_from_db(db)
            print(f"""\n{'_'*80}\ninside try block\n{'_'*80}""")
            for topic in topics:
                
                await process_papers_for_topic(db, topic)
                print(f"Papers for topic {topic.name} processed successfully!")

        finally:
            db.close()

        # Update last_run.txt with the current datetime
        with open("last_run.txt", "w") as f:
            f.write(datetime.now().isoformat())
