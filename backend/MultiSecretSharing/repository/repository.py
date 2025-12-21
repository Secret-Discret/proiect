from __future__ import annotations
from typing import Dict, List, Set
from MultiSecretSharing.domain.entities import Redactor, Director


class MultiSecretRepository:
    def __init__(self):
        self.redactors: List[Redactor] = [
            Redactor(1, "Ultron", "Secretary of Defense", 5),
            Redactor(2, "Tony Stark", "Secretary of State", 4),
            Redactor(3, "The Joker", "National Security Advisor", 4),
            Redactor(4, "Sauron", "Chairman of the Joint Chiefs", 5),
            Redactor(5, "Lena Luthor", "Vice Chairman", 4),
            Redactor(6, "Voldemort", "Director of Intelligence", 4),
            Redactor(7, "Cthulhu", "Strategic Forces Commander", 5),
            Redactor(8, "Batman", "Homeland Security", 3),
        ]

        self.director = Director("")
        self.polynomial: List[int] = []
        self.secrets: Dict[str, Dict] = {}
        self.trusted: Dict[str, Set[int]] = {}

    def set_director(self, name: str):
        self.director.set_name(name)

    def get_redactors(self) -> List[Redactor]:
        return self.redactors

    def get_redactor_by_id(self, rid: int) -> Redactor | None:
        return next((r for r in self.redactors if r.id == rid), None)

    def set_polynomial(self, coeffs: List[int]):
        self.polynomial = coeffs

    def get_polynomial(self) -> List[int]:
        return self.polynomial

    def add_secret(self, secret_id: str, index: int, access: Set[int], min_weight: int):
        self.secrets[secret_id] = {
            "index": index,
            "access_structure": access,
            "min_weight": min_weight,
        }
        self.trusted[secret_id] = set()
        print('Secret added', secret_id, self.secrets[secret_id])

    def get_secret(self, secret_id: str) -> Dict | None:
        return self.secrets.get(secret_id)

    def get_all_secrets(self) -> List[str]:
        # for s, v in self.secrets.items():
        #     print(s, v)
        return list(self.secrets)

    def trust_redactors(self, secret_id: str, ids: List[int]):
        if secret_id in self.trusted:
            self.trusted[secret_id].update(ids)

    def clear_trusted_redactors(self, secret_id: str):
        if secret_id in self.trusted:
            self.trusted[secret_id].clear()

    def get_trusted_redactors(self, secret_id: str) -> Set[int]:
        return self.trusted.get(secret_id, set())
