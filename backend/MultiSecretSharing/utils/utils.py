from typing import List

PRIME = 11

def evaluate_polynomial(coeffs: List[int], x: int) -> int:
    y = 0
    for i, c in enumerate(coeffs):
        y = (y + c * pow(x, i, PRIME)) % PRIME
    return y

def polynomial_multiplication_modular(a: List[int], b: List[int]) -> List[int]:
    res = [0] * (len(a) + len(b) - 1)
    for i, ac in enumerate(a):
        for j, bc in enumerate(b):
            res[i + j] = (res[i + j] + ac * bc) % PRIME
    return res

def interpolate_polynomial(points: List[tuple]) -> List[int]:
    n = len(points)
    coeffs = [0] * n
    for i, (xi, yi) in enumerate(points):
        li_coeff = [1]
        for j, (xj, _) in enumerate(points):
            if i == j:
                continue
            denom_inv = pow(xi - xj, -1, PRIME)
            li_coeff = polynomial_multiplication_modular(li_coeff, [-xj * denom_inv % PRIME, 1 * denom_inv % PRIME])

        for k in range(len(li_coeff)):
            coeffs[k] = (coeffs[k] + li_coeff[k] * yi) % PRIME
    return coeffs
