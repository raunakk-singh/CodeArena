from fastapi import APIRouter,status,HTTPException,Depends
from sqlalchemy.orm import Session
from .. import models, oauth2
from ..database import get_db
from ..schemas import SubmissionCreate,SubmissionOut


router=APIRouter(
  prefix="/submissions",
      tags=["submissions"]
)



  
@router.post('/',status_code=status.HTTP_201_CREATED,response_model=SubmissionOut)
def submission(
  submission:SubmissionCreate,
  db:Session=Depends(get_db),
  current_user:models.Users=Depends(oauth2.get_current_user)
):
  new_submission=models.Submission(user_id=current_user.id,problem_id=submission.problem_id,
        source_code=submission.source_code,
        language=submission.language)
  db.add(new_submission)
  db.commit()
  db.refresh(new_submission)
  return new_submission

@router.get("/", response_model=list[SubmissionOut])
def get_submissions(
    db: Session = Depends(get_db),
    current_user: models.Users = Depends(oauth2.get_current_user)
):
    submissions = db.query(models.Submission).filter(
        models.Submission.user_id == current_user.id
    ).all()
    return submissions

@router.get("/{id}", response_model=SubmissionOut)
def get_submission(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.Users = Depends(oauth2.get_current_user)
):
    submission = db.query(models.Submission).filter(
        models.Submission.id == id,
        models.Submission.user_id == current_user.id
    ).first()

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )

    return submission