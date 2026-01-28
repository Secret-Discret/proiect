import random
from typing import List, Tuple

# Use a large prime for modular arithmetic
PRIME = 2**127 - 1


# --- Core Shamir functions (modular arithmetic) ---
def modinv(a: int, p: int = PRIME) -> int:
    """Modular inverse using Fermat's little theorem (prime p)."""
    return pow(a, p - 2, p)


def polynom(x: int, coeffs: List[int], p: int = PRIME) -> int:
    """Evaluate polynomial at x modulo p."""
    result = 0
    for i, c in enumerate(coeffs):
        result = (result + c * pow(x, i, p)) % p
    return result


def generate_shares(n: int, threshold: int, secret: int, p: int = PRIME) -> List[Tuple[int, int]]:
    """Generate Shamir shares with modular arithmetic."""
    coeffs = [secret] + [random.randrange(0, p) for _ in range(threshold - 1)]
    shares = []
    for i in range(1, n + 1):
        shares.append((i, polynom(i, coeffs, p)))
    return shares


def reconstruct_secret(shares: List[Tuple[int, int]], p: int = PRIME) -> int:
    """Reconstruct secret using Lagrange interpolation modulo p."""
    total = 0
    k = len(shares)
    for j, (xj, yj) in enumerate(shares):
        numerator, denominator = 1, 1
        for m, (xm, _) in enumerate(shares):
            if m != j:
                numerator = (numerator * (-xm)) % p
                denominator = (denominator * (xj - xm)) % p
        lagrange_coeff = (numerator * modinv(denominator, p)) % p
        total = (total + yj * lagrange_coeff) % p

    return total