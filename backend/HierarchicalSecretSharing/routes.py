from fastapi import APIRouter
from .repository import InMemoryRepository
from .service import start_round, reconstruct_secret

router = APIRouter()
repo = InMemoryRepository()

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

@router.get("/reconstruct")
def reconstruct():
    state = repo.get_round()

    if len(state.submitted_shares) < state.threshold:
        return {"authorized": False}

    used = state.submitted_shares[:state.threshold]
    recovered = reconstruct_secret(used)

    return {
        "authorized": recovered == state.secret,
        "recovered_secret": recovered
    }
