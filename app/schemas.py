from pydantic import BaseModel, EmailStr, Field
from typing import Literal,Optional


class ProblemCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str
    difficulty: Literal["Easy", "Medium", "Hard"]
    constraints: str
    input_format: str
    output_format: str


class UserCreate(BaseModel):
    first_name: str = Field(min_length=2, max_length=50)
    second_name: str = Field(min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class UserOut(BaseModel):
    first_name: str = Field(min_length=2, max_length=50)
    second_name: str = Field(min_length=2, max_length=50)
    email: EmailStr
    class Config:
        from_attributes = True
        
class SubmissionCreate(BaseModel):
    problem_id: int
    source_code: str
    language: str
    
class SubmissionOut(BaseModel):
    id: int
    user_id: int
    problem_id: int
    source_code: str
    language: str
    status: str
    execution_time: Optional[float] = None
    memory_used: Optional[float] = None

    class Config:
        from_attributes = True

class SubmissionResult(BaseModel):
    status: str
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    compile_output: Optional[str] = None
    execution_time: Optional[float] = None
    memory_used: Optional[float] = None
class TestCaseCreate(BaseModel):
    problem_id: int
    input_data: str
    expected_out: str
    is_hidden: bool = False


class TestCaseOut(BaseModel):
    id: int
    problem_id: int
    input_data: str
    expected_out: str
    is_hidden: bool

    class Config:
        from_attributes = True
class Token(BaseModel):
    access_token:str
    token_type:str
class TokenData(BaseModel):
    id: Optional[int]=None
 