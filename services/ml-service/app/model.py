import numpy as np
from sklearn.linear_model import LinearRegression
class DeliveryTimeModel:
    def __init__(self):
        self.model = LinearRegression()
        self._train()
    def _train(self):
        x = np.array([[1,1,1],[2,1,1],[3,2,1],[5,3,1],[8,4,2],[10,5,3],[12,5,4],[15,5,5]])
        y = np.array([7,10,14,18,30,42,50,65])
        self.model.fit(x, y)
    def predict(self, distance: float, traffic: int, weather: int) -> int:
        prediction = self.model.predict(np.array([[distance, traffic, weather]]))[0]
        return max(5, round(prediction))
