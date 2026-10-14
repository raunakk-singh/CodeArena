from pydantic import BaseModel

class ProblemCreate(BaseModel):
    title: str
    description: str
    difficulty: str
    Constraints: str
    input_format: str
    output_format: str