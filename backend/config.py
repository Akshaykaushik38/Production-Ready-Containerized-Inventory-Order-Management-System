import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "Inventory & Order Management System"
    API_V1_STR: str = ""
    
    # Database connection parameters
    POSTGRES_USER: str = Field(default="postgres", validation_alias="POSTGRES_USER")
    POSTGRES_PASSWORD: str = Field(default="postgres", validation_alias="POSTGRES_PASSWORD")
    POSTGRES_HOST: str = Field(default="db", validation_alias="POSTGRES_HOST")
    POSTGRES_PORT: str = Field(default="5432", validation_alias="POSTGRES_PORT")
    POSTGRES_DB: str = Field(default="inventory_db", validation_alias="POSTGRES_DB")
    
    # Constructed database URL or direct database URL override
    DATABASE_URL: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def db_url(self) -> str:
        if self.DATABASE_URL:
            # SQLAlchemy 2.0 requires postgresql:// instead of postgres://
            url = self.DATABASE_URL
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql://", 1)
            return url
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

settings = Settings()
