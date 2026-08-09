import pyotp


def generate_otp():
    totp = pyotp.TOTP(pyotp.random_base32())
    return totp.now()