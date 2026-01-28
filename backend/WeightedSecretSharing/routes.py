from typing import List
from fastapi import APIRouter, Query
from WeightedSecretSharing.service import WeightedService

router = APIRouter()
service = WeightedService()

@router.put("/president/{name}")
def read_root(name: str):
    print("Setting president to:", name)
    return service.setPresident(name)

@router.get("/advisors")
def get_advisors():
    print("Fetching advisors")
    return service.getAdvisors()

@router.put("/secret/{secret}")
def read_root(secret: str):
    print("Encoding secret:", secret)
    return service.encode_secret(secret)

@router.post("/president/select-advisors")
def select_advisors(ids: List[int] = Query(...)):
    print("Selecting trusted advisors with IDs:", ids)
    return service.select_trusted_advisors(ids)

@router.delete("/president/delete-advisors")
def delete_trusted_advisors():
    print("Deleting trusted advisors")
    return service.delete_trusted_advisors()

@router.get("/result")
def read_root():
    print("Decoding secret")
    return service.decode_secret()
