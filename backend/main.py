from typing import Union
import WeightedSecretSharing.routes as weightedRoutes
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(weightedRoutes.router, prefix="/weighted")

# pip install "fastapi[standard]"
# fastapi dev main.py
