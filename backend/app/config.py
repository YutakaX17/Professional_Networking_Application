import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    FRONTEND_URL = os.getenv('FRONTEND_URL')
    SMTP_SERVER = os.getenv('SMTP_SERVER')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))  # Default to 587
    SMTP_USER = os.getenv('SMTP_USER')
    SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI')
    GOOGLE_AUTH_URL = os.getenv('GOOGLE_AUTH_URL')
    GOOGLE_TOKEN_URL = os.getenv('GOOGLE_TOKEN_URL')
    GOOGLE_USER_INFO_URL = os.getenv('GOOGLE_USER_INFO_URL')

