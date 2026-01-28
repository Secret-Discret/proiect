import random
from typing import Dict
from MultiSecretSharing.utils.utils import *
from MultiSecretSharing.repository.repository import MultiSecretRepository, Redactor

PRIME = 11

class MultiSecretService:
    def __init__(self):
        self.repository = MultiSecretRepository()

    def _set_director(self, name: str):
        self.repository._set_director(name)
        return {"message": f"Director set to {name}"}

    def _get_redactors(self) -> List[Redactor]:
        return self.repository._get_redactors()

    def _encode_secrets(self, secrets: Dict[str, int]):
        coeffs = []
        math_steps = []

        math_steps.append({
            "step": "Initialize polynomial coefficients list",
            "formula": "P(x) = a0 + a1·x + a2·x² + ..."
        })

        for secret_id, secret_value in secrets.items():
            index = len(coeffs)
            coeff = secret_value % PRIME
            coeffs.append(coeff)

            math_steps.append({
                "step": f"Encode secret '{secret_id}' as coefficient a{index}",
                "formula": f"a{index} = {secret_value} mod {PRIME} = {coeff}"
            })

            redactors = self.repository._get_redactors()
            selected = random.sample(
                redactors,
                random.randint(2, len(redactors))
            )
            access = {r.id for r in selected}

            math_steps.append({
                "step": f"Select random access set for '{secret_id}'",
                "formula": f"Access = {{{', '.join(map(str, access))}}}"
            })

            total_weight = sum(
                self.repository._get_redactor_by_id(rid).rank
                for rid in access
            )
            min_weight = total_weight // 2 + 1

            math_steps.append({
                "step": f"Compute minimum weight required to reconstruct '{secret_id}'",
                "formula": f"⌊{total_weight} / 2⌋ + 1 = {min_weight}"
            })

            self.repository._add_secret(
                secret_id=secret_id,
                index=index,
                access=access,
                min_weight=min_weight
            )

        self.repository._set_polynomial(coeffs)

        math_steps.append({
            "step": "Finalize polynomial",
            "formula": "P(x) = " + " + ".join(
                f"{a}·x^{i}" if i > 0 else str(a)
                for i, a in enumerate(coeffs)
            )
        })

        for r in self.repository._get_redactors():
            share = evaluate_polynomial(coeffs, r.id)
            r._set_share(r.id, share)

            math_steps.append({
                "step": f"Distribute share to redactor {r.id}",
                "formula": f"P({r.id}) = {share}"
            })

        return {
            "success": True,
            "message": "Secrets encoded into polynomial",
            "degree": len(coeffs) - 1,
            "math_steps": math_steps
        }

    def _trust_redactors(self, secret_id: str, ids: List[int]):
        self.repository._trust_redactors(secret_id, ids)

    def _clear_trusted_redactors(self, secret_id: str):
        self.repository._clear_trusted_redactors(secret_id)
        return {"message": f"Trusted redactors cleared for '{secret_id}'"}

    def _get_trusted_redactors(self, secret_id: str):
        return list(self.repository._get_trusted_redactors(secret_id))

    def _decode_secret(self, secret_id: str):
        meta = self.repository._get_secret(secret_id)
        if not meta:
            return {"success": False, "error": "Secret not found!"}

        trusted = self.repository._get_trusted_redactors(secret_id)
        points = []
        weight = 0
        math_steps = []

        math_steps.append({
            "step": "Trusted Redactors",
            "description": "List all trusted redactors for this secret",
            "formula": f"{list(trusted)}"
        })

        for rid in trusted:
            if rid not in meta["access_structure"]:
                math_steps.append({
                    "step": f"Redactor {rid} skipped",
                    "description": "Not in access structure",
                    "formula": f"{rid} ∉ AccessStructure"
                })
                continue

            r = self.repository._get_redactor_by_id(rid)
            if not r or not r._get_share():
                math_steps.append({
                    "step": f"Redactor {rid} skipped",
                    "description": "Redactor missing or has no share",
                    "formula": f"{rid} skipped"
                })
                continue

            points.append(r._get_share())
            weight += r.rank

            math_steps.append({
                "step": f"Include Redactor {rid}",
                "description": "Add redactor's rank to total weight and include share",
                "formula": f"share = {r._get_share()}, weight += {r.rank} → {weight}"
            })

        if weight < meta["min_weight"]:
            math_steps.append({
                "step": "Threshold Check",
                "description": "Total weight below minimum required",
                "formula": f"total_weight = {weight}, min_required = {meta['min_weight']}"
            })
            return {
                "success": False,
                "reason": "Insufficient weight",
                "math_steps": math_steps
            }

        if len(points) < meta["index"] + 1:
            math_steps.append({
                "step": "Point Check",
                "description": "Not enough shares for polynomial interpolation",
                "formula": f"points_count = {len(points)}, required = {meta['index'] + 1}"
            })
            return {
                "success": False,
                "reason": "Not enough shares",
                "math_steps": math_steps
            }

        secret_coeffs = interpolate_polynomial(points)
        secret = secret_coeffs[meta["index"]]

        math_steps.append({
            "step": "Reconstruction Complete",
            "description": f"Recovered coefficient at index {meta['index']}",
            "formula": f"secret = {secret} (mod {PRIME})"
        })

        return {
            "success": True,
            "secret": secret,
            "weight": weight,
            "math_steps": math_steps
        }

    def _list_secrets(self):
        return list(self.repository._get_all_secrets())

    def _get_secret_data(self, secret_id: str):
        secret = self.repository._get_secret(secret_id)
        if not secret:
            return {"error": "Secret not found"}
        return {
            "secret_id": secret_id,
            "access_structure": list(secret["access_structure"]),
            "min_weight": secret["min_weight"],
        }
