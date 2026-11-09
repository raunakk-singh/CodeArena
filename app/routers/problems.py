from fastapi import APIRouter,status,HTTPException,Depends
from sqlalchemy.orm import Session
from .. import models
from app.database import get_db
from app.schemas import ProblemCreate


router = APIRouter(
    prefix="/problems",
    tags=["Problems"]
)

  
@router.get("/")
def get_problems(db:Session=Depends(get_db)):
  
  problems=db.query(models.Problems).all()
  return {"data":problems}

@router.post("/",status_code=status.HTTP_201_CREATED)
def create_problem(problems:ProblemCreate,db:Session=Depends(get_db)):
  new_problem = models.Problems(
        title=problems.title,
        description=problems.description,
        difficulty=problems.difficulty,
        constraints=problems.constraints,
        input_format=problems.input_format,
        output_format=problems.output_format
    )
  db.add(new_problem)
  db.commit()
  db.refresh(new_problem)

  return {"data": new_problem}

@router.get("/{id}")
def get_problem(id: int, db: Session = Depends(get_db)):
    problem = db.query(models.Problems).filter(
        models.Problems.id == id
    ).first()

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )

    return {"data": problem}