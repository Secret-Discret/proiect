from fastapi import APIRouter
from ThresholdSimpleSharing.service.service import ShamirService
from fastapi.responses import JSONResponse

simple_router = APIRouter()

simple_service = ShamirService()


@simple_router.post("/split")
def split_secret(payload: dict):
    if int(payload["n"]) < int(payload["threshold"]):
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": "Not enough shares to reconstruct the secret!"}
        )
    result = simple_service._split_secret(
        secret=payload["secret"],
        n=payload["n"],
        threshold=payload["threshold"]
    )

    result["shares"] = [(str(x), str(y)) for x, y in result["shares"]]

    return JSONResponse(
        status_code=200,
        content=result
    )

@simple_router.post("/reconstruct")
def reconstruct(payload: dict):
    shares = [(int(x), int(y)) for x, y in payload["shares"]]
    return simple_service._reconstruct(shares)


