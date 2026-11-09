from .database import Base
from sqlalchemy import Column,Integer,String,Text,DateTime,Boolean
from sqlalchemy.sql import func


class Problems(Base):
  __tablename__="problems"
  id=Column(Integer,primary_key=True,nullable=False)
  title=Column(String(200),nullable=False)
  description=Column(String,nullable=False)
  difficulty=Column(String,nullable=False)
  constraints=Column(Text,nullable=False)
  input_format = Column(Text, nullable=False)
  output_format = Column(Text, nullable=False)
  created_at=Column(DateTime(timezone=True),server_default=func.now(),nullable=False)
  
class Users(Base):
  __tablename__="users"
  id=Column(Integer,primary_key=True,nullable=False)
  first_name=Column(String,nullable=False)
  second_name=Column(String,nullable=False)
  email=Column(String,nullable=False,unique=True)
  password=Column(String,nullable=False)
  
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Float
from sqlalchemy.sql import func
from .database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)

    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)

    # Submission Details
    source_code = Column(Text, nullable=False)
    language = Column(String, nullable=False)

    # Execution Results
    status = Column(String, default="Pending")
    execution_time = Column(Float, nullable=True)
    memory_used = Column(Float, nullable=True)

    stdout = Column(Text, nullable=True)
    stderr = Column(Text, nullable=True)
    compile_output = Column(Text, nullable=True)

    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
  
class test_cases(Base):
  __tablename__="test_cases"
  id=Column(Integer,primary_key=True,nullable=False)
  problem_id=Column(Integer,ForeignKey("problems.id"), nullable=False)
  input_data=Column(Text,nullable=False)
  expected_out=Column(Text,nullable=False)
  is_hidden = Column(Boolean, default=False, nullable=False)

