from ThresholdSimpleSharing.shamir_logic.entities import generate_shares, reconstruct_secret
from typing import Dict, Any, List, Tuple

class ShamirService:
    def __init__(self):
        print("Simple Shamir intialized.")

    def _encode_secret(self, secret: str) -> int:
        if secret.isdigit():
            return int(secret)
        return int.from_bytes(secret.encode("utf-8"), "big")

    def _decode_secret(self, secret_int: int) -> str:
        if secret_int == 0:
            return "0"
        try:
            length = (secret_int.bit_length() + 7) // 8
            decoded = secret_int.to_bytes(length, "big").decode("utf-8")
            return "".join(c if c.isprintable() else "?" for c in decoded)
        except Exception:
            return str(secret_int)

    def _split_secret(self, secret: str, n: int, threshold: int) -> Dict[str, Any]:
        math_steps = []

        math_steps.append({
            "step": "Why do you want to-",
            "formula": "Nvm. We will not ask why you want to hide this."
        })

        numeric_secret = self._encode_secret(secret)
        math_steps.append({
            "step": "Secret Encoding",
            "formula": f"secret → {numeric_secret}"
        })

        shares = generate_shares(n, threshold, numeric_secret)

        math_steps.append({
            "step": "Polynomial Generation",
            "formula": f"Degree = {threshold - 1}"
        })

        for x, y in shares:
            math_steps.append({
                "step": "Share Created",
                "formula": f"({x}, {y})"
            })

        return {
            "success": True,
            "message": "Your secret has been irresponsibly split.",
            "threshold": threshold,
            "shares": shares,
            "math_steps": math_steps
        }

    def _reconstruct(self, provided_shares: List[Tuple[int, int]]) -> Dict[str, Any]:
        math_steps = []

        math_steps.append({
            "step": "Reconstruction Attempt",
            "formula": f"Using {len(provided_shares)} shares"
        })

        secret_int = reconstruct_secret(provided_shares)

        math_steps.append({
            "step": "Lagrange Interpolation",
            "formula": f"Recovered secret integer = {secret_int}"
        })

        decoded = self._decode_secret(secret_int)

        math_steps.append({
            "step": "Decoding",
            "formula": f"Recovered secret = {decoded}"
        })

        return {
            "success": True,
            "secret": str(decoded),
            "math_steps": math_steps
        }

