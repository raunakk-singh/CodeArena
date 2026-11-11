from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy.orm import Session

from .. import models, oauth2
from ..database import get_db
from ..utils import password_hash
from ..schemas import UserCreate, UserOut


router = APIRouter(
    prefix="/users",
    tags=["users"]
)


# 1. CREATE USER (Registration)
@router.post(
    '/',
    status_code=status.HTTP_201_CREATED,
    response_model=UserOut
)
def create_user(
    users: UserCreate,
    db: Session = Depends(get_db)
):

    # Check if email already exists
    existing_user = db.query(models.Users).filter(
        models.Users.email == users.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = password_hash.hash(users.password)

    # Create new user
    new_user = models.Users(
        first_name=users.first_name,
        second_name=users.second_name,
        email=users.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# 2. GET CURRENT LOGGED-IN USER
@router.get(
    '/me',
    response_model=UserOut
)
def get_current_user(
    current_user: models.Users = Depends(oauth2.get_current_user)
):
    return current_user


# 3. GET USER BY ID
@router.get(
    '/{id}',
    response_model=UserOut
)
def get_user(
    id: int,
    db: Session = Depends(get_db)
):

    user = db.query(models.Users).filter(
        models.Users.id == id
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {id} does not exist"
        )

    return user