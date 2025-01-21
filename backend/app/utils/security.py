import bcrypt
import jwt
from datetime import datetime, timedelta
from flask import current_app
import re

from ..models.mj_tables import User
from ..utils.oauth import GoogleOAuth


def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def generate_token(data, expires_in=3600):
    secret_key = current_app.config['SECRET_KEY']
    exp = datetime.utcnow() + timedelta(seconds=expires_in)
    data.update({'exp': exp})
    return jwt.encode(data, secret_key, algorithm='HS256')


def decode_token(token):
    """
    Decode and validate a JWT token.
    :param token: str, the JWT token to decode.
    :return: dict, decoded payload data.
    :raises: ValueError if token is invalid or expired.
    """
    secret_key = current_app.config['SECRET_KEY']
    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired.")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token.")


def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email)


def validate_password(password):
    pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$'
    return re.match(pattern, password)

def validate_google_token(token):
    """
    Validate Google OAuth token and extract user information
    """
    try:
        # Get user info from Google token
        google_user = GoogleOAuth.get_user_info(token)
        # Find user by Google ID in your database
        user = User.query.filter_by(oauth_id=google_user['sub']).first()
        if not user:
            return None
        return {'user_id': user.id}
    except Exception:
        raise ValueError("Invalid Google token")

