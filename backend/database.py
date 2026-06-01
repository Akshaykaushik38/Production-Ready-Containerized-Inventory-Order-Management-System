from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.config import settings

# Create engine
engine = create_engine(
    settings.db_url,
    # pool_pre_ping checks the connection health before executing operations, perfect for Docker startups
    pool_pre_ping=True
)

# Create sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base class for models
Base = declarative_base()

# FastAPI Dependency for Session management
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
