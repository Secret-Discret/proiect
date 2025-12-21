from typing import Dict, Any
from ThresholdSimpleSharing.domain.entities import generate_shares, reconstruct_secret
from ThresholdSimpleSharing.repository.repository import ShamirRepository


class ShamirService:
    def __init__(self, repo: ShamirRepository):
        self.repo = repo

    def _encode_secret(self, secret: str) -> int:
        return int.from_bytes(secret.encode(), "big")

    def _decode_secret(self, secret_int: int) -> str:
        try:
            length = (secret_int.bit_length() + 7) // 8
            decoded = secret_int.to_bytes(length, "big").decode("utf-8")
            return "".join(c if c.isprintable() else "?" for c in decoded)
        except Exception:
            return str(secret_int)

    def split_secret(self, secret: str, n: int, threshold: int) -> Dict[str, Any]:
        math_steps = []

        math_steps.append({
            "step": "Why do you want to-",
            "formula": "Nvm. We will not ask why you want to hide this."
        })

        numeric_secret = (
            int(secret)
            if secret.isdigit()
            else self._encode_secret(secret)
        )

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

        self.repo.store(numeric_secret, shares, threshold)

        return {
            "message": "Your secret has been irresponsibly split.",
            "threshold": threshold,
            "shares": shares,
            "math_steps": math_steps
        }

    def reconstruct(self, provided_shares):
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
            "secret": decoded,
            "math_steps": math_steps
        }
