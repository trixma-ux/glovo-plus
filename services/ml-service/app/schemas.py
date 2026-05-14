from pydantic import BaseModel, Field
class PredictionInput(BaseModel):
    distance: float = Field(..., gt=0, example=5)
    traffic: int = Field(..., ge=1, le=5, example=3)
    weather: int = Field(..., ge=1, le=5, example=1)
class PredictionOutput(BaseModel):
    estimated_time: int
