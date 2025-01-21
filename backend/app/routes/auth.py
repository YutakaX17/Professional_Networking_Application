from flask import Blueprint, request, jsonify
from .. import db
from ..models.mj_tables import User
from ..services.auth_service import AuthService
from ..utils.security import validate_email, validate_password, hash_password, generate_token

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    return AuthService.register_user(data)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return AuthService.login_user(data)


@auth_bp.route('/google-login', methods=['GET'])
def google_login():
    return AuthService.google_oauth_login()


@auth_bp.route('/google-callback', methods=['POST'])
def google_callback():
    code = request.json.get('code')
    if not code:
        return jsonify({'error': 'Authorization code is required'}), 400
    return AuthService.handle_google_callback(code)


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    return AuthService.forgot_password(data)


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    print(f"Received reset password request with data: {data}")
    return AuthService.reset_password(data)

@auth_bp.route('/protected-route', methods=['GET'])
def protected_route():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({'message': 'Authorization header missing or invalid'}), 401

    token = auth_header.split(" ")[1]
    try:
        payload = AuthService.validate_session_jwt(token)
        return jsonify({'message': 'Access granted', 'user': payload}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 401

@auth_bp.route('/admin/register', methods=['POST'])
def register_admin():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        username = data.get('username')

        if not email or not password or not username:
            return jsonify({'error': 'Email, password, and username are required'}), 400

        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        if not validate_password(password):
            return jsonify({'error': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit'}), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email already exists'}), 400

        hashed_password = hash_password(password)
        admin_user = User(username=username, email=email, password_hash=hashed_password, role='Admin')
        db.session.add(admin_user)
        db.session.commit()

        token_data = {'user_id': admin_user.id, 'role': admin_user.role}
        token = generate_token(token_data)

        return jsonify({'message': 'Admin user created successfully', 'token': token}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        admin_user = User.query.filter_by(email=email, role='Admin').first()
        if not admin_user or not admin_user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401

        token_data = {'user_id': admin_user.id, 'role': admin_user.role}
        token = generate_token(token_data)

        return jsonify({'token': token}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
