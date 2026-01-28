from typing import Union
import WeightedSecretSharing.routes as weightedRoutes
import HierarchicalSecretSharing.routes as hierarchicalRoutes

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

app.include_router(weightedRoutes.router, prefix="/weighted", tags=["WeightedSecretSharing"])
app.include_router(hierarchicalRoutes.router, prefix="/hierarchical", tags=["HierarchicalSecretSharing"]) #weighted shamir

# pip install "fastapi[standard]"
# fastapi dev main.py
