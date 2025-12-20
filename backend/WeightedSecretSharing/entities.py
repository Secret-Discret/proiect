class Advisor:
    def __init__(self, id: int, name: str, position: str, rank: int):
        self.id = id
        self.name = name
        self.position = position    
        self.rank = rank
        self.trust = False
        self.codes = None

    def setTrust(self, trust: bool):
        self.trust = trust
       
    def setCode(self, code: str):
        self.codes = code
    def getCode(self) -> str:
        return self.codes
    def getRank(self) -> int:
        return self.rank

class President:
    def __init__(self, name: str):
        self.name = name

    def setName(self, name: str):
        self.name = name
        
    def getName(self) -> str:
        return self.name