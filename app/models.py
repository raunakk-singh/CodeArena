from .database import Base
from sqlalchemy import Column,Integer,String,Text,DateTime
from sqlalchemy.sql import func


class Problems(Base):
  __tablename__="problems"
  id=Column(Integer,primary_key=True,nullable=False)
  title=Column(String(200),nullable=False)
  description=Column(String,nullable=False)
  difficulty=Column(String,nullable=False)
  Constraints=Column(Text,nullable=False)
  input_format = Column(Text, nullable=False)
  output_format = Column(Text, nullable=False)
  created_at=Column(DateTime(timezone=True),server_default=func.now(),nullable=False)
  
  