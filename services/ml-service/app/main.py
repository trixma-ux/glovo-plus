from fastapi import FastAPI
from app.schemas import PredictionInput, PredictionOutput
from app.model import DeliveryTimeModel
app = FastAPI(title="ML Service API", description="Prédiction du temps de livraison", version="1.0.0")
model = DeliveryTimeModel()
@app.get('/health')
def health(): return {"status":"UP", "service":"ml-service"}
@app.post('/predict', response_model=PredictionOutput)
def predict(payload: PredictionInput): return {"estimated_time": model.predict(payload.distance, payload.traffic, payload.weather)}
