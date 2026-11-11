from fastapi import FastAPI
from app import models
from app.database import engine


from app.routers import auth, problems, submissions, test_case, users

app = FastAPI(title="CodeArena API")

models.Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "CodeArena API is running"}


# Register routers
app.include_router(problems.router)
app.include_router(submissions.router)
app.include_router(test_case.router)
app.include_router(users.router)
app.include_router(auth.router)