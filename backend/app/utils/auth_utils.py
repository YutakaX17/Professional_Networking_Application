from functools import wraps
from flask import request, jsonify
from ..models.mj_tables import User
from ..utils.security import decode_token

def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            payload = decode_token(token)
            current_user = User.query.get(payload['user_id'])
        except:
            return jsonify({'error': 'Token is invalid'}), 401
        return func(current_user, *args, **kwargs)
    return decorated
