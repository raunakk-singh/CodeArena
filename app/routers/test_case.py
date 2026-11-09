from fastapi import APIRouter,status,HTTPException,Depends
from pydantic import BaseModel,EmailStr
from .. import models
from sqlalchemy.orm import Session
from ..database import engine,get_db

from ..schemas import TestCaseCreate,TestCaseOut
router = APIRouter(
    prefix="/problems/{id}/testcases",
    tags=["Test Cases"]
)

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=TestCaseOut
)
def create_testcase(
    id: int,
    testcase: TestCaseCreate,
    db: Session = Depends(get_db)
):
    problem = db.query(models.Problems).filter(
        models.Problems.id == id
    ).first()

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )

    new_testcase = models.TestCases(
        problem_id=id,
        input_data=testcase.input_data,
        expected_out=testcase.expected_out,
        is_hidden=testcase.is_hidden
    )

    db.add(new_testcase)
    db.commit()
    db.refresh(new_testcase)

    return new_testcase
@router.get(
    "/",
    response_model=list[TestCaseOut]
)
def get_testcases(id: int, db: Session = Depends(get_db)):

    problem = db.query(models.Problems).filter(
        models.Problems.id == id
    ).first()

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )

    testcases = db.query(models.TestCases).filter(
        models.TestCases.problem_id == id,
        models.TestCases.is_hidden == False
    ).all()

    return testcases