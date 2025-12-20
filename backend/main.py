from typing import Union
import WeightedSecretSharing.routes as weightedRoutes
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(weightedRoutes.router, prefix="/weighted")

# pip install "fastapi[standard]"
# fastapi dev main.py
