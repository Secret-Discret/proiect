import random
from typing import List, Dict
from WeightedSecretSharing.repository import WeightedRepository
from WeightedSecretSharing.entities import Advisor


class WeightedService:
    def __init__(self):
        self.repository = WeightedRepository()
        self.access_structure: set[int] = set()
        self.secret: str = ""
        self.min_total_weight: int = 0
        self.secret_int: int = 0

    def setPresident(self, name: str):
        self.repository.add_president(name)
        return {"message": f"President set to {name}"}

    def getAdvisors(self):
        return self.repository.get_allAdvisors()

    def select_trusted_advisors(self, advisor_ids: List[int]):
        for advisor in self.repository.get_allAdvisors():
            if advisor.id in advisor_ids:
                self.repository.add_trustedAdvisor(advisor)
        return {"message": "Trusted advisors selected."}

    def delete_trusted_advisors(self):
        self.repository.delete_allTrustedAdvisors()
        return {"message": "All trusted advisors have been deleted."}

    # ----------------------------
    # Shamir helper functions
    # ----------------------------
    def _secret_to_int(self, secret: str) -> int:
        return int.from_bytes(secret.encode(), byteorder="big")

    def _int_to_secret(self, value: int) -> str:
        length = (value.bit_length() + 7) // 8
        return value.to_bytes(length, byteorder="big").decode()

    def _lagrange_interpolate(self, x, points):
        total = 0
        for i, (xi, yi) in enumerate(points):
            li = 1
            for j, (xj, _) in enumerate(points):
                if i != j:
                    li *= (x - xj) / (xi - xj)
            total += yi * li
        return round(total)

    # ----------------------------
    # Encode secret using shares
    # ----------------------------
    def encode_secret(self, secret: str) -> Dict:
        self.secret = secret
        self.secret_int = self._secret_to_int(secret)
        advisors = self.repository.get_allAdvisors()

        if not advisors:
            raise ValueError("No advisors available")

        math_steps = []
        k = random.randint(1, len(advisors) - 1)
        selected = random.sample(advisors, k=k)
        self.access_structure = {a.id for a in selected}

        total_weight = sum(a.getRank() for a in selected)
        self.min_total_weight = total_weight // 2 + 1
        t = self.min_total_weight

        math_steps.append({
            "step": "Access Structure Selection",
            "description": f"Randomly selected {k} advisors for access structure",
            "formula": f"Selected IDs = {list(self.access_structure)}"
        })
        math_steps.append({
            "step": "Minimum Total Weight",
            "description": "Calculate the minimum total weight needed to reconstruct the secret",
            "formula": f"min_total_weight = {self.min_total_weight}"
        })

        # Create random polynomial coefficients
        coeffs = [self.secret_int] + [random.randint(1, 100) for _ in range(t - 1)]

        math_steps.append({
            "step": "Polynomial Coefficients",
            "description": "Random coefficients for polynomial of degree t-1",
            "formula": f"{coeffs}"
        })

        # Polynomial function
        def f(x):
            return sum(coeffs[i] * (x ** i) for i in range(len(coeffs)))

        # Assign weighted shares to advisors based on rank
        x_counter = 1
        for advisor in advisors:
            shares = []
            for _ in range(advisor.getRank()):
                shares.append((x_counter, f(x_counter)))
                x_counter += 1
            # Store shares in advisor
            if not hasattr(self.repository, "_shares"):
                self.repository._shares = {}
            self.repository._shares[advisor.id] = shares

            math_steps.append({
                "step": f"Shares for Advisor {advisor.id}",
                "description": f"Advisor receives {advisor.getRank()} weighted shares",
                "formula": f"{shares}"
            })

        return {
            "message": "Secret encoded using weighted Shamir shares",
            "min_total_weight": self.min_total_weight,
            "access_structure_len": len(self.access_structure),
            "math_steps": math_steps
        }

    # ----------------------------
    # Decode secret using shares
    # ----------------------------
    def decode_secret(self) -> Dict:
        total_weight = 0
        math_steps = []
        shares_for_interpolation = []

        trusted_advisors = self.repository.get_trustedAdvisors()
        math_steps.append({
            "step": "Trusted Advisors",
            "description": "List all trusted advisors",
            "formula": f"{[a.id for a in trusted_advisors]}"
        })

        for advisor in trusted_advisors:
            if not advisor.trust or advisor.id not in self.access_structure:
                math_steps.append({
                    "step": f"Advisor {advisor.id} skipped",
                    "description": "Either not trusted or not in access structure",
                    "formula": f"trust={advisor.trust}, in_access={advisor.id in self.access_structure}"
                })
                continue

            advisor_shares = self.repository._shares.get(advisor.id, [])
            shares_for_interpolation.extend(advisor_shares)
            total_weight += advisor.getRank()

            math_steps.append({
                "step": f"Accumulate weight from Advisor {advisor.id}",
                "description": "Add advisor rank to total weight",
                "formula": f"total_weight={total_weight}"
            })

            if total_weight >= self.min_total_weight:
                break

        if total_weight < self.min_total_weight:
            math_steps.append({
                "step": "Decoding Failed",
                "description": "Not enough weighted shares to reconstruct secret",
                "formula": f"total_weight={total_weight}, required={self.min_total_weight}"
            })
            return {
                "success": False,
                "total_weight": total_weight,
                "required_weight": self.min_total_weight,
                "math_steps": math_steps
            }

        used_shares = shares_for_interpolation[:self.min_total_weight]
        reconstructed_int = self._lagrange_interpolate(0, used_shares)
        reconstructed_secret = self._int_to_secret(reconstructed_int)

        math_steps.append({
            "step": "Reconstruction",
            "description": "Lagrange interpolation at x=0 using weighted shares",
            "formula": f"secret_int = {reconstructed_int}"
        })

        return {
            "success": True,
            "total_weight": total_weight,
            "required_weight": self.min_total_weight,
            "secret": reconstructed_secret,
            "math_steps": math_steps
        }
