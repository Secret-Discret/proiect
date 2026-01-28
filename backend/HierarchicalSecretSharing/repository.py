from .entities import RoundState, User

SCENARIO_AVAILABILITY = {
    1: False,  #director unavailable
    2: True,
    3: True,
    4: False, 
    5: False,
    6: False,
    7: True,
    8: True,
    9: True,
}

class InMemoryRepository:
    def __init__(self):
        self.users = [
            User(1, "Jane Doe", 4), # weight4=Director;
            User(2, "Alice", 3), # weight3 = Deputy;
            User(3, "Bob", 2), # weight2 = Senior;
            User(4, "Dennis", 1), # weight1 = Junior;
            User(5, "Jack Black", 3),
            User(6, "Steve", 2),
            User(7, "Dawn", 1),
            User(8, "Garret", 1),
            User(9, "Nat Ally", 1),
        ]

        self.round_state: RoundState | None = None
        self.reset_to_scenario()

    def get_users(self):
        return self.users
    
    def disable_user(self, user_id: int):
        user = self.get_user(user_id)
        if user:
            user.availability = False

    def enable_user(self, user_id: int):
        user = self.get_user(user_id)
        if user:
            user.availability = True

    def reset_to_scenario(self):
        for user in self.users:
            user.availability = SCENARIO_AVAILABILITY.get(user.id, True)

    def set_round(self, state: RoundState):
        self.round_state = state

    def get_round(self) -> RoundState:
        if self.round_state is None:
            raise RuntimeError("No active round")
        return self.round_state

    def clear_round(self):
        self.round_state = None
