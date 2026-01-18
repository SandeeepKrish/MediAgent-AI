import os
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    MONGO_URI: str = "mongodb+srv://Sandeep:Sandeep123@stock-cluster.skxwyn9.mongodb.net/AgenAi"
    DB_NAME: str = "AgenticHMS"
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.DB_NAME]

async def get_database():
    return db
