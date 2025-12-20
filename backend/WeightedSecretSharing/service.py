import random
import hashlib
from typing import List, Dict
from WeightedSecretSharing.repository import WeightedRepository
from WeightedSecretSharing.entities import Advisor

class WeightedService:
    def __init__(self):
        self.repository = WeightedRepository()
        self.access_structure: set[int] = set()

    def setPresident(self, name: str):
        self.repository.add_president(name)
        return f"President set to {name}"

    def getAdvisors(self):
        return self.repository.get_allAdvisors()
    
    def select_trusted_advisors(self, advisor_ids: List[int]):
        advisors = self.repository.get_allAdvisors()
        for advisor in advisors:
            if advisor.id in advisor_ids:
                self.repository.add_trustedAdvisor(advisor)
        return f"Trusted advisors selected."
        
    def encode_secret(self, secret: str):
        advisors = self.repository.get_allAdvisors()
        if not advisors:
            raise ValueError("No advisors available")
        selected = random.sample(
            advisors,
            k=random.randint(1, len(advisors))
        )
        self.access_structure = {a.id for a in selected}
        for advisor in advisors:
            code = self._generate_code(secret, advisor.id)
            self.repository.add_codeAdvisor(advisor, code)
        return "Secret encoded with weighted shares."

    def _generate_code(self, secret: str, advisor_id: int) -> str:
        data = f"{secret}:{advisor_id}".encode()
        return hashlib.sha256(data).hexdigest()

    def decode_secret(
        self,
        secret: str,
        submitted: List[Dict[str, str]],
        min_total_weight: int
    ) -> bool:
        advisors = {a.id: a for a in self.repository.get_allAdvisors()}
        total_weight = 0

        for item in submitted:
            advisor_id = item["advisor_id"]
            code = item["code"]
            if advisor_id not in advisors:
                return False

            advisor = advisors[advisor_id]
            if not advisor.trust:
                continue
            if advisor_id not in self.access_structure:
                continue
            expected = self._generate_code(secret, advisor_id)
            if code != expected:
                return False
            total_weight += advisor.getRank()

        return total_weight >= min_total_weight
