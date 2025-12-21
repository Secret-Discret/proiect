import random
from decimal import Decimal
from typing import List, Tuple

FIELD_SIZE = 10**5


def polynom(x: int, coefficients: List[int]) -> int:
    result = 0
    for power, coeff in enumerate(coefficients):
        result += coeff * (x ** power)
    return result


def generate_coefficients(threshold: int, secret: int) -> List[int]:
    coeffs = [random.randrange(0, FIELD_SIZE) for _ in range(threshold - 1)]
    coeffs.insert(0, secret)
    return coeffs


def generate_shares(n: int, threshold: int, secret: int) -> List[Tuple[int, int]]:
    coeffs = generate_coefficients(threshold, secret)
    shares = []

    for _ in range(n):
        x = random.randrange(1, FIELD_SIZE)
        shares.append((x, polynom(x, coeffs)))

    return shares


def reconstruct_secret(shares: List[Tuple[int, int]]) -> int:
    total = Decimal(0)

    for j, (xj, yj) in enumerate(shares):
        prod = Decimal(1)
        for i, (xi, _) in enumerate(shares):
            if i != j:
                prod *= Decimal(xi) / Decimal(xi - xj)
        total += Decimal(yj) * prod

    return int(round(total))
