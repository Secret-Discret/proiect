
from typing import List
from fastapi import APIRouter, Query, Body

from WeightedSecretSharing.service import WeightedService

router = APIRouter()
service = WeightedService()

@router.put("/president/{name}", operation_id="a")
def read_root(name: str):
    print("Setting president to:", name)
    return service.setPresident(name)

@router.get("/advisors", operation_id="b")
def get_advisors():
    print("Fetching advisors")
    return service.getAdvisors()

@router.put("/secret/{secret}", operation_id="c")
def read_root(secret: str):
    print("Encoding secret:", secret)
    return service.encode_secret(secret)

@router.post("/president/select-advisors", operation_id="d")
def select_advisors(ids: List[int] = Query(...)):
    print("Selecting trusted advisors with IDs:", ids)
    return service.select_trusted_advisors(ids)

@router.delete("/president/delete-advisors", operation_id="e")
def delete_trusted_advisors():
    print("Deleting trusted advisors")
    return service.delete_trusted_advisors()

@router.get("/result", operation_id="f")
def read_root():
    print("Decoding secret")
    return service.decode_secret()
