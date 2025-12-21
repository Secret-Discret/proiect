import random
import hashlib
from typing import List, Dict
from WeightedSecretSharing.repository import WeightedRepository
from WeightedSecretSharing.entities import Advisor


class WeightedService:
    def __init__(self):
        self.repository = WeightedRepository()
        self.access_structure: set[int] = set()
        self.secret: str = ""
        self.min_total_weight: int = 0  

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

    def encode_secret(self, secret: str) -> Dict:
        self.secret = secret
        advisors = self.repository.get_allAdvisors()

        if not advisors:
            raise ValueError("No advisors available")

        math_steps = []
        k = random.randint(1, len(advisors)-1)
        selected = random.sample(advisors, k=k)
        self.access_structure = {a.id for a in selected}
        print(f"[ENCODE] Selected {k} advisors for access structure: {list(self.access_structure)}")
        math_steps.append({
            "step": "Access Structure Selection",
            "description": f"Randomly selected {k} advisors for access structure",
            "formula": ""
        })

        total_weight = sum(a.getRank() for a in selected)
        self.min_total_weight = total_weight // 2 + 1

        math_steps.append({
            "step": "Sum of Ranks",
            "description": "Sum the ranks of all advisors in access structure",
            "formula": f"Sum of ranks = {total_weight}"
        })
        math_steps.append({
            "step": "Minimum Total Weight",
            "description": "Calculate the minimum total weight needed to reconstruct the secret",
            "formula": f"Minimum total weight = {self.min_total_weight}"
        })

        for advisor in advisors:
            code = self._generate_code(advisor.id)
            self.repository.add_codeAdvisor(advisor, code)
            math_steps.append({
                "step": f"Generate Code for Advisor {advisor.id}",
                "description": "Compute SHA256(secret : advisor_id) (hidden for security)",
                "formula": f"code_{advisor.id} = SHA256(secret : {advisor.id})"
            })
        math_steps.append({
                "step": f"Codes have been randomly assigned to all advisors",
                "description": "",
                "formula": ""
            })

        return {
            "message": "Secret encoded with weighted shares.",
            "min_total_weight": self.min_total_weight,
            "access_structure_len": len(self.access_structure),
            "math_steps": math_steps
        }

    def _generate_code(self, advisor_id: int) -> str:
        data = f"{self.secret}:{advisor_id}".encode()
        return hashlib.sha256(data).hexdigest()

    def decode_secret(self) -> Dict:
        total_weight = 0
        math_steps = []

        trusted_advisors = self.repository.get_trustedAdvisors()
        print(f"[DECODE] Trusted advisors: {[a.id for a in trusted_advisors]}")

        math_steps.append({
            "step": "Trusted Advisors",
            "description": "List all trusted advisors",
            "formula": f"TrustedAdvisors = {[a.id for a in trusted_advisors]}"
        })

        invalid_advisor_found = False

        for advisor in trusted_advisors:
            print(f"[DECODE] Checking Advisor {advisor.id}...")
            if not advisor.trust:
                print(f"[DECODE] Advisor {advisor.id} is not trusted, skipped")
                math_steps.append({
                    "step": f"Advisor {advisor.id} Skipped",
                    "description": "Advisor not trusted, skipped",
                    "formula": f"Trust({advisor.id}) = False"
                })
                invalid_advisor_found = True
                continue

            if advisor.id not in self.access_structure:
                print(f"[DECODE] Advisor {advisor.id} is not in access structure!")
                math_steps.append({
                    "step": f"Advisor {advisor.id} Invalid",
                    "description": "Trusted advisor not in access structure",
                    "formula": f"{advisor.id} not in AccessStructure"
                })
                invalid_advisor_found = True
                continue

            expected_code = self._generate_code(advisor.id)
            print(f"[DECODE] Verifying code for Advisor {advisor.id}...")
            math_steps.append({
                "step": f"Verify Code for Advisor {advisor.id}",
                "description": "Compute expected SHA256(secret : advisor_id) to verify",
                "formula": f"expected_{advisor.id} = SHA256(secret : {advisor.id})"
            })

            if advisor.getCode() != expected_code:
                print(f"[DECODE] Verification failed for Advisor {advisor.id}")
                math_steps.append({
                    "step": f"Verification Failed",
                    "description": f"Advisor {advisor.id}'s code does not match expected hash",
                    "formula": f"code_{advisor.id} != expected_{advisor.id}"
                })
                invalid_advisor_found = True
                continue

            total_weight += advisor.getRank()
            print(f"[DECODE] Accumulated total weight: {total_weight}")
            math_steps.append({
                "step": f"Accumulate Weight for Advisor {advisor.id}",
                "description": "Add advisor's rank to total weight",
                "formula": f"total_weight = {total_weight}"
            })

        if invalid_advisor_found or total_weight < self.min_total_weight:
            print(f"[DECODE] Decoding failed. Total weight = {total_weight}, Min required = {self.min_total_weight}")
            math_steps.append({
                "step": "Decoding Failed",
                "description": "Either a trusted advisor was invalid or total weight below minimum",
                "formula": f"total_weight = {total_weight}, min_total_weight = {self.min_total_weight}"
            })
            return {
                "success": False,
                "total_weight": total_weight,
                "required_weight": self.min_total_weight,
                "math_steps": math_steps
            }

        print(f"[DECODE] Decoding successful! Total weight = {total_weight}")
        math_steps.append({
            "step": "Decoding Success",
            "description": "All trusted advisors valid and total weight meets minimum",
            "formula": f"total_weight = {total_weight} >= min_total_weight = {self.min_total_weight}"
        })

        return {
            "success": True,
            "total_weight": total_weight,
            "required_weight": self.min_total_weight,
            "math_steps": math_steps
        }