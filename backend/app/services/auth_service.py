from flask import jsonify, current_app, session
from datetime import datetime, timedelta
from ..models.mj_tables import User, SessionJWT, PasswordReset
from ..utils.security import hash_password, verify_password, generate_token, validate_email, validate_password, \
    decode_token
from ..services import EmailService
from ..utils.oauth import GoogleOAuth
from .. import db
import jwt


class AuthService:
    @staticmethod
    def register_user(data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')

        if not username or not email or not password or not role:
            return jsonify({'message': 'All fields, including role, are required'}), 400

        if role not in ['Admin', 'Publisher', 'Seeker']:
            return jsonify({'message': 'Invalid role. Must be Admin, Publisher, or Seeker.'}), 400

        if not validate_email(email):
            return jsonify({'message': 'Invalid email format'}), 400

        if not validate_password(password):
            return jsonify({'message': 'Password must be at least 8 characters long, include uppercase, lowercase, '
                                       'and a number'}), 400

        if User.query.filter((User.email == email) | (User.username == username)).first():
            return jsonify({'message': 'Email or username already registered'}), 400

        hashed_password = hash_password(password)
        user = User(username=username, email=email, password_hash=hashed_password, role=role)

        db.session.add(user)
        db.session.commit()

        try:
            return jsonify({'message': 'User registered successfully'}), 201
        except ValueError as e:
            return jsonify({'message': str(e)}), 400
    @staticmethod
    def login_user(data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not verify_password(password, user.password_hash):
            return jsonify({'message': 'Invalid email or password'}), 401

        try:
            token_data = {'user_id': user.id, 'role': user.role}
            token = generate_token(token_data)

            # Save the session JWT in the database
            expires_at = datetime.utcnow() + timedelta(hours=1)
            session_jwt = SessionJWT(
                user_id=user.id,
                jwt_token=token,
                expires_at=expires_at
            )
            db.session.add(session_jwt)
            db.session.commit()

            return jsonify({
                'role': user.role,
                'token': token,
                'user': {'id': user.id},  # Include user ID
                'message': 'Login successful'
            }), 200
        except ValueError as e:
            return jsonify({'message': str(e)}), 401
    def validate_session_jwt(token):
        """
        Validate a JWT against the database.
        :param token: str, the JWT token to validate.
        :return: dict, user payload if valid.
        """
        try:
            payload = decode_token(token)
            session_jwt = SessionJWT.query.filter_by(jwt_token=token).first()

            if not session_jwt or session_jwt.expires_at < datetime.utcnow():
                raise ValueError("Token is invalid or expired.")

            return payload
        except ValueError as e:
            raise ValueError(str(e))

    @staticmethod
    def forgot_password(data):
        email = data.get('email')

        if not email:
            return jsonify({'message': 'Email is required'}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'message': 'No user found with this email'}), 404

        # Generate token and calculate expiration
        token = generate_token({'user_id': user.id}, expires_in=3600)
        expires_at = datetime.utcnow() + timedelta(seconds=3600)

        # Save the reset token to the PasswordReset table
        reset_entry = PasswordReset(
            user_id=user.id,
            reset_token=token,
            expires_at=expires_at
        )
        db.session.add(reset_entry)
        db.session.commit()

        # Generate the reset URL
        reset_url = f"{current_app.config['FRONTEND_URL']}/reset-password?token={token}"

        # Send the email
        EmailService.send_email(
            to_email=email,
            subject='Password Reset',
            body=f"Click the link within one hour to reset your password: {reset_url}"
        )
        return jsonify({'message': 'Password reset email sent successfully'}), 200
    @staticmethod
    def reset_password(data):
        reset_token = data.get('reset_token')
        new_password = data.get('new_password')

        print(f"Received data: reset_token={reset_token}, new_password={'*' * len(new_password) if new_password else None}")

        if not reset_token or not new_password:
            return jsonify({'message': 'Token and new password are required'}), 400

        try:
            # Verify the token and get the reset entry
            reset_entry = PasswordReset.query.filter_by(reset_token=reset_token).first()

            if not reset_entry:
                return jsonify({'message': 'Invalid reset token'}), 400

            if reset_entry.expires_at < datetime.utcnow():
                db.session.delete(reset_entry)
                db.session.commit()
                return jsonify({'message': 'Reset token has expired. Please request a new password reset.'}), 400

            # Get the user and update password
            user = User.query.get(reset_entry.user_id)
            if not user:
                return jsonify({'message': 'User not found'}), 404

            user.password_hash = hash_password(new_password)
            db.session.delete(reset_entry)
            db.session.commit()

            return jsonify({'message': 'Password updated successfully'}), 200

        except Exception as e:
            db.session.rollback()
            print(f"Error in reset_password: {str(e)}")
            return jsonify({'message': f'Error updating password: {str(e)}'}), 400
    @staticmethod
    def google_oauth_login():
        auth_url = GoogleOAuth.get_auth_url()
        return jsonify({'auth_url': auth_url}), 200
    @staticmethod
    def handle_google_callback(code):
        token_data = GoogleOAuth.exchange_code_for_token(code)
        if not token_data:
            return jsonify({'error': 'Failed to exchange authorization code'}), 400

        access_token = token_data.get('access_token')
        expires_in = token_data.get('expires_in', 3600)  # Default to 1 hour if not provided
        token_expiry = datetime.utcnow() + timedelta(seconds=expires_in)

        user_info = GoogleOAuth.get_user_info(access_token)

        user = User.query.filter_by(oauth_provider='google', oauth_id=user_info['id']).first()

        if not user:
            user = User(
                username=user_info['email'].split('@')[0],
                email=user_info['email'],
                password_hash='google_oauth',
                role='Seeker',
                oauth_provider='google',
                oauth_id=user_info['id']
            )
            db.session.add(user)

        user.access_token = access_token
        user.refresh_token = token_data.get('refresh_token')
        user.token_expiry = token_expiry
        db.session.commit()

        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role,
                'access_token': access_token  # Add token to response
            }
        }), 200

