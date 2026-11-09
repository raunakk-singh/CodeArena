from fastapi import APIRouter,status,HTTPException,Depends
from pydantic import BaseModel,EmailStr
from .. import models
from sqlalchemy.orm import Session
from ..database import engine,get_db

from ..schemas import UserCreate,UserOut


router = APIRouter(
    prefix="/users",
    tags=["users"]
)


    
@router.post('/',status_code=status.HTTP_201_CREATED,response_model=UserOut)
def create_user(users:UserCreate,db:Session=Depends(get_db)):
  existing_user = db.query(models.Users).filter(
        models.Users.email == users.email
    ).first()

  if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        ) 
  new_user=models.Users(
    first_name=users.first_name,
    second_name=users.second_name,
    email=users.email,
    password=users.password
    
  )
  db.add(new_user)
  db.commit()
  db.refresh(new_user)
  
  return new_user