from typing import List
from fastapi import APIRouter, Query
from WeightedSecretSharing.service import WeightedService

router = APIRouter()
service = WeightedService()

@router.put("/president/{name}")
def read_root(name: str):
    return service.setPresident(name)

@router.get("/advisors")
def get_advisors():
    return service.getAdvisors()

@router.put("/secret/{secret}")
def read_root(secret: str):
    return service.encode_secret(secret)

@router.post("/president/select-advisors")
def select_advisors(ids: List[int] = Query(...)):
    return service.select_trusted_advisors(ids)

@router.get("/result")
def read_root():
    return service.decode_secret()
