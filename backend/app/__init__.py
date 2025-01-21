from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from .config import Config
from flask_cors import CORS
from flask import send_from_directory
import os

# Initialize extensions without binding to the app
db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()


def create_app():
    # Load environment variables from .env
    load_dotenv()

    # Initialize Flask app
    app = Flask(__name__)

    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],  # Added Authorization
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    app.config.from_object(Config)

    # Secure session cookies
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    # Configure PostgreSQL database
    app.config['SQLALCHEMY_DATABASE_URI'] = (
        f"postgresql://{os.getenv('POSTGRES_USER', 'your_username')}:{os.getenv('POSTGRES_PASSWORD', 'your_password')}"
        f"@{os.getenv('POSTGRES_HOST', 'localhost')}:{os.getenv('POSTGRES_PORT', '5432')}/{os.getenv('POSTGRES_DB', 'your_database')}"
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions with the app
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)

    # Create schema if not exists
    with app.app_context():
        db.session.execute(db.text('CREATE SCHEMA IF NOT EXISTS mj_schema'))
        db.session.commit()

    @app.route('/assets/<path:filename>')
    def serve_static(filename):
        return send_from_directory(os.path.join(app.root_path, '..', 'assets'), filename)

    # Import models to register them with SQLAlchemy
    from .models.mj_tables import (
        User, SessionJWT, PasswordReset, Profile, Job, Message, Notification, Meeting,
        Analytics, CompanyCulture, Application, Resume
    )

    # Register blueprints
    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp)
    from .routes.seeker import seeker_bp
    app.register_blueprint(seeker_bp)
    from .routes.publisher import publisher_bp
    app.register_blueprint(publisher_bp)
    from .routes.admin import admin_bp
    app.register_blueprint(admin_bp)

    return app
