import secrets
from typing import List
from .entities import User, Share, RoundState

PRIME = 2**127 - 1

def generate_polynomial(secret: int, threshold: int) -> List[int]:
    return [secret] + [
        secrets.randbelow(PRIME) for _ in range(threshold - 1)
    ]

def evaluate_polynomial(coeffs: List[int], x: int) -> int:
    y = 0
    for power, coef in enumerate(coeffs):
        y = (y + coef * pow(x, power, PRIME)) % PRIME
    return y

def generate_weighted_shares(
    users: List[User],
    threshold: int,
    secret: int
):
    coeffs = generate_polynomial(secret, threshold)
    x = 1
    user_shares = {}
    for user in users:
        shares = []
        for _ in range(user.weight):
            y = evaluate_polynomial(coeffs, x)
            shares.append(Share(x=x, y=y))
            x += 1
        user_shares[user.id] = shares

    return user_shares, coeffs

def reconstruct_secret(shares: List[Share]) -> int:
    secret = 0
    for i, si in enumerate(shares):
        xi, yi = si.x, si.y
        num = 1
        den = 1

        for j, sj in enumerate(shares):
            if i != j:
                xj = sj.x
                num = (num * (-xj)) % PRIME
                den = (den * (xi - xj)) % PRIME

        lagrange = num * pow(den, -1, PRIME)
        secret = (secret + yi * lagrange) % PRIME

    return secret

def start_round(users: List[User], threshold: int) -> dict:
    secret = secrets.randbelow(PRIME)
    user_shares, coeffs = generate_weighted_shares(users, threshold, secret)

    state = RoundState(
        threshold=threshold,
        secret=secret,
        user_shares=user_shares,
        submitted_shares=[]
    )

    return state, coeffs

