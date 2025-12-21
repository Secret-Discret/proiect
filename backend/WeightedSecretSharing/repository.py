from WeightedSecretSharing.entities import President, Advisor
from typing import List
class WeightedRepository:
    def __init__(self):
        self.allAdvisors: List[Advisor] = [
            Advisor(1, "Ultron", "Secretary of Defense", 5),
            Advisor(2, "Tony Stark", "Secretary of State", 4),
            Advisor(3, "The Joker", "National Security Advisor", 4),
            Advisor(4, "Sauron", "Chairman of the Joint Chiefs of Staff", 5),
            Advisor(5, "Lena Luthor", "Vice Chairman of the Joint Chiefs of Staff", 4),
            Advisor(6, "Voldemort", "Director of National Intelligence", 4),
            Advisor(7, "Cthulhu", "Commander, Strategic Forces", 5),
            Advisor(8, "Batman", "Secretary of Homeland Security", 3),
            Advisor(9, "Freddy Krueger", "Deputy Secretary of Defense", 3),
            Advisor(10, "Dracula", "Chief of Staff (Security Affairs)", 2),
        ]
        self.trustedAdvisors: List[Advisor] = []
        self.president: President = President("")

    def add_trustedAdvisor(self, advisor: Advisor):
        self.trustedAdvisors.append(advisor)
        advisor.setTrust(True)

    def add_president(self, president: str):
        self.president.setName(president)

    def get_allAdvisors(self) -> List[Advisor]:
        return self.allAdvisors
    
    def get_trustedAdvisors(self) -> List[Advisor]:
        return self.trustedAdvisors
    
    def add_codeAdvisor(self, advisor: Advisor, code: str):
        advisor.setCode(code) 
    
    def get_president(self) :
        return self.president
    
    def delete_allTrustedAdvisors(self):
        self.trustedAdvisors.clear()
