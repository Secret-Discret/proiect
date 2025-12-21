from __future__ import annotations

class Redactor:
    def __init__(self, id: int, name: str, position: str, rank: int):
        self.id = id
        self.name = name
        self.position = position
        self.rank = rank
        self.share: tuple[int, int] | None = None  # (x, y)

    def set_share(self, x: int, y: int):
        self.share = (x, y)

    def get_share(self) -> tuple[int, int] | None:
        return self.share

    def to_string(self):
        return f"ID={self.id} | Name={self.name} | Position={self.position} | Rank={self.rank} | Share={self.share}"



class Director:
    def __init__(self, name: str):
        self.name = name

    def set_name(self, name: str):
        self.name = name
