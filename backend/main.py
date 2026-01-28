from typing import Union
import WeightedSecretSharing.routes as weightedRoutes
from fastapi import FastAPI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

# @app.get("/")
# def read_root():
#     return {"Hello": "World"}

app.include_router(weightedRoutes.router, prefix="/weighted", tags=["WeightedSecretSharing"])
app.include_router(multiRoutes.multi_router, prefix="/multi", tags=["MultiSecretSharing"])

# the simple one is after the geeksforgeeks simple shamir implementation
app.include_router(thresholdSharing.simple_router, prefix="/simple", tags=["SimpleSecretSharing"])

for route in app.routes:
    print(route.path, route.name)

# pip install "fastapi[standard]"
# fastapi dev main.py