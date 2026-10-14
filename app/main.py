from fastapi import FastAPI,Response,status,HTTPException,Depends
from fastapi.params import Body
from pydantic import BaseModel
from . import models
from sqlalchemy.orm import Session
from .database import engine,get_db
from .schemas import ProblemCreate


app=FastAPI()



models.Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
  return {"message":"Hello world"}

  
@app.get("/problems")
def get_problems(db:Session=Depends(get_db)):
  
  problems=db.query(models.Problems).all()
  return {"data":problems}

@app.post("/problems",status_code=status.HTTP_201_CREATED)
def create_problem(problems:ProblemCreate,db:Session=Depends(get_db)):
  new_problem = models.Problems(
        title=problems.title,
        description=problems.description,
        difficulty=problems.difficulty,
        Constraints=problems.Constraints,
        input_format=problems.input_format,
        output_format=problems.output_format
    )
  db.add(new_problem)
  db.commit()
  db.refresh(new_problem)

  return {"data": new_problem}
    
