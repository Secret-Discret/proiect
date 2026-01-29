from typing import Union
import WeightedSecretSharing.routes as weightedRoutes
import HierarchicalSecretSharing.routes as hierarchicalRoutes

import MultiSecretSharing.routes as multiRoutes
import ThresholdSimpleSharing.routes as thresholdRoutes
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

# @app.get("/")
# def read_root():
#     return {"Hello": "World"}

app.include_router(weightedRoutes.router, prefix="/weighted", tags=["WeightedSecretSharing"])
app.include_router(multiRoutes.multi_router, prefix="/multi", tags=["MultiSecretSharing"])

# the simple one is after the geeksforgeeks simple shamir implementation
app.include_router(thresholdRoutes.simple_router, prefix="/simple", tags=["SimpleSecretSharing"])

app.include_router(hierarchicalRoutes.router, prefix="/hierarchical", tags=["HierarchicalSecretSharing"]) #weighted shamir

for route in app.routes:
    print(route.path, route.name)
# pip install "fastapi[standard]"
# fastapi dev main.py
