from fastapi import APIRouter
from ThresholdSimpleSharing.repository.repository import ShamirRepository
from ThresholdSimpleSharing.service.service import ShamirService

simple_router = APIRouter()

simple_repository = ShamirRepository()
simple_service = ShamirService(simple_repository)


@simple_router.post("/split")
def split_secret(payload: dict):
    return simple_service.split_secret(
        secret=payload["secret"],
        n=payload["n"],
        threshold=payload["threshold"]
    )


@simple_router.post("/reconstruct")
def reconstruct(payload: dict):
    return simple_service.reconstruct(payload["shares"])
