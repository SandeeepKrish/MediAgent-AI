from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import patient
import uvicorn

app = FastAPI(title="Agentic Health Management System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(patient.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Agentic HMS API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
