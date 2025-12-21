from fastapi import APIRouter, Query, Body
multi_router = APIRouter()

from MultiSecretSharing.service.service import MultiSecretService
from typing import Dict, List

multi_service = MultiSecretService()
@multi_router.put("/director/{name}" , operation_id="multi_set_director")
def set_director(name: str):
    print("Setting director to:", name)
    return multi_service.set_director(name)

@multi_router.get("/redactors" , operation_id="multi_get_redactors")
def get_redactors():
    print("Fetching redactors")
    return multi_service.get_redactors()

@multi_router.put("/secrets", operation_id="multi_encode_secrets")
def encode_secrets(secrets: Dict[str, int] = Body(...)):
    """
    Encode multiple secrets!!!
    Expects a json like:
    {
        "event1": 5,
        "event2": 7
    }
    """
    return multi_service.encode_secrets(secrets)

from fastapi import HTTPException


@multi_router.get("/aaaa", operation_id="multi_secrets")
def list_secrets():
    return ["secret1", "secret2", "secret3"]


@multi_router.get("/secrets", operation_id="multi_secrets")
def list_secrets():
    try:
        secrets = multi_service.list_secrets()
        #print("Secrets:", secrets)
        return secrets
    except Exception as e:
        print("Error in list_secrets:", e)
        raise HTTPException(status_code=500, detail=str(e))

@multi_router.get("/secrets/{secret_id}", operation_id="multi_secret")
def get_secrets(secret_id: str):
    return multi_service.get_secret_metadata(secret_id)

@multi_router.post("/secrets/{secret_id}/trust", operation_id="multi_trust_redactors")
def trust_redactors(
    secret_id: str,
    redactor_ids: List[int] = Query(...)
):
    return multi_service.trust_redactors(secret_id, redactor_ids)

@multi_router.delete("/secrets/{secret_id}/trust", operation_id="multi_delete_trusted_redactors")
def clear_trusted_redactors(secret_id: str):
    return multi_service.clear_trusted_redactors(secret_id)


@multi_router.get("/secrets/{secret_id}/trust", operation_id="multi_get_trusted_redactors")
def get_trusted_redactors(secret_id: str):
    return multi_service.get_trusted_redactors(secret_id)


@multi_router.get("/secrets/{secret_id}/decode" , operation_id="multi_decode_secret")
def decode_secret(secret_id: str):
    return multi_service.decode_secret(secret_id)
