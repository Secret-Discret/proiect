class ShamirRepository:
    def __init__(self):
        self.secret = None
        self.shares = []
        self.threshold = None

    def store(self, secret, shares, threshold):
        self.secret = secret
        self.shares = shares
        self.threshold = threshold

    def get_shares(self):
        return self.shares

    def get_threshold(self):
        return self.threshold
