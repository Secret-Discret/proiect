//Lagrange-based, Birkhoff was too haard :(
export function lagrangeReconstruct(shares, PRIME) {
    let secret = 0n;
    const steps = [];

    for (let i = 0; i < shares.length; i++) {
        const xi = BigInt(shares[i].x);
        const yi = BigInt(shares[i].y);

        let num = 1n;
        let den = 1n;

        for (let j = 0; j < shares.length; j++) {
            if (i !== j) {
                const xj = BigInt(shares[j].x);
                num = (num * (-xj)) % PRIME;
                den = (den * (xi - xj)) % PRIME;
            }
        }

        const invDen = modInverse(den, PRIME);
        const lagrange = (num * invDen) % PRIME;
        const contribution = (yi * lagrange) % PRIME;

        steps.push({
            xi,
            yi,
            num,
            den,
            invDen,
            lagrange,
            contribution
        });

        secret = (secret + contribution) % PRIME;
    }

    return { secret: (secret + PRIME) % PRIME, steps };
}

function modInverse(a, p) {
    let t = 0n, newT = 1n;
    let r = p, newR = a % p;

    while (newR !== 0n) {
        const q = r / newR;
        [t, newT] = [newT, t - q * newT];
        [r, newR] = [newR, r - q * newR];
    }
    if (t < 0n) t += p;
    return t;
}
