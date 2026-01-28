from dataclasses import dataclass
from typing import List

@dataclass
class User:
    id: int
    name: str
    weight: int
    availability: bool = True

@dataclass
class Share:
    x: int
    y: int

@dataclass
class UserShares:
    user_id: int
    shares: List[Share]

@dataclass
class RoundState:
    threshold: int
    secret: int
    user_shares: dict[int, List[Share]]
    submitted_shares: List[Share]