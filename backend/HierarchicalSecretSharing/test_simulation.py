from HierarchicalSecretSharing.service import start_round, reconstruct_secret
from HierarchicalSecretSharing.entities import User
from HierarchicalSecretSharing.repository import InMemoryRepository

repo = InMemoryRepository()
users = repo.get_users()
state, coeffs = start_round(users, threshold=4)

#pick coalition: Deputy+Senior (3+2 shares)
shares = (
    state.user_shares[2][:3] +
    state.user_shares[3][:1]
)

secret = reconstruct_secret(shares)
print(secret == state.secret)
