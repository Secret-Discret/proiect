# from MultiSecretSharing.service.service import MultiSecretService
#
# # --------------------------------------------------
# # Pretty printer
# # --------------------------------------------------
# def pretty_print_decode(secret_id: str, result: dict):
#     print("\n" + "=" * 50)
#     print(f"🔐 DECODE ATTEMPT — Secret: '{secret_id}'")
#     print("=" * 50)
#
#     if not result.get("success"):
#         print("❌ DECODE FAILED")
#         print("Reason:", result.get("reason", "Unknown"))
#     else:
#         print("✅ DECODE SUCCESSFUL")
#         print("Recovered Secret Value:", result["secret"])
#         print("Total Weight:", result["weight"])
#
#     print("\n📐 Math Steps:")
#     for step in result.get("math_steps", []):
#         print(f" • {step['step']}")
#         if "formula" in step:
#             print(f"   → {step['formula']}")
#
#     print("=" * 50 + "\n")
#
#
# # --------------------------------------------------
# # Setup
# # --------------------------------------------------
# service = MultiSecretService()
#
# print("\n--- Set Director ---")
# print(service.set_director("Nick Fury"))
#
# print("\n--- Redactors ---")
# for r in service.get_redactors():
#     print(r.to_string())
#
# # --------------------------------------------------
# # Encode multiple secrets into ONE polynomial
# # --------------------------------------------------
# print("\n--- Encode Secrets ---")
# encode_result = service.encode_secrets({
#     "launch_codes": 7,
#     "vault_key": 8,
#     "doomsday_protocol": 1
# })
# print(encode_result)
#
# # --------------------------------------------------
# # Attempt decode with insufficient trust
# # --------------------------------------------------
# print("\n--- Partial Trust (Intentional Failure) ---")
# service.trust_redactors("launch_codes", [1, 2])
#
# result = service.decode_secret("launch_codes")
# pretty_print_decode("launch_codes", result)
#
# # --------------------------------------------------
# # Force success
# # --------------------------------------------------
# print("\n--- Grant Full Access ---")
# meta = service.repository.get_secret("launch_codes")
# service.trust_redactors("launch_codes", list(meta["access_structure"]))
#
# result = service.decode_secret("launch_codes")
# pretty_print_decode("launch_codes", result)
#
# # --------------------------------------------------
# # Decode another secret using SAME SHARES
# # --------------------------------------------------
# print("\n--- Decode Second Secret ---")
# meta = service.repository.get_secret("vault_key")
# service.trust_redactors("vault_key", list(meta["access_structure"]))
#
# result = service.decode_secret("vault_key")
# pretty_print_decode("vault_key", result)
