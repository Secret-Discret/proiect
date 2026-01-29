from fastapi import APIRouter
from .repository import InMemoryRepository
from .service import start_round, reconstruct_secret, PRIME
from pydantic import BaseModel
from typing import List

router = APIRouter()
repo = InMemoryRepository()
class CoalitionRequest(BaseModel):
    selected_user_ids: List[int]

THRESHOLD = 4

@router.post("/start")
def start():
    repo.reset_to_scenario()

    users = repo.get_users()
    available_users = [u for u in users if u.availability]

    state, coeffs = start_round(available_users, THRESHOLD)
    repo.set_round(state)

    return {
        "threshold": THRESHOLD,
        "users": [
            {
                "id": u.id,
                "name": u.name,
                "weight": u.weight,
                "availability": u.availability
            }
            for u in users
        ],
        "user_shares": {
            uid: [{"x": s.x, "y": s.y} for s in shares]
            for uid, shares in state.user_shares.items()
        },
        "polynomial_coefficients": coeffs
    }

@router.post("/submit/{user_id}")
def submit(user_id: int):
    state = repo.get_round()

    shares = state.user_shares.get(user_id)
    if not shares:
        return {"error": "invalid user"}

    state.submitted_shares.extend(shares)

    return {
        "submitted": len(state.submitted_shares),
        "threshold": state.threshold
    }

@router.post("/reconstruct")
def reconstruct(selected_user_ids: list[int]):
    state = repo.get_round()

    shares = []
    for uid in selected_user_ids:
        shares.extend(state.user_shares[uid])

    secret = reconstruct_secret(shares)

    return {
        "prime": PRIME,
        "reconstructed_secret": secret,
        "shares_used": [
            {"x": s.x, "y": s.y} for s in shares
        ]
    }