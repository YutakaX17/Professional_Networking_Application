from flask import current_app
import requests

class GoogleOAuth:
    @staticmethod
    def get_auth_url():
        client_id = current_app.config['GOOGLE_CLIENT_ID']
        redirect_uri = current_app.config['GOOGLE_REDIRECT_URI']
        auth_url = current_app.config['GOOGLE_AUTH_URL']
        scope = 'email profile openid'
        return f"{auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope={scope}&access_type=offline&prompt=consent"

    @staticmethod
    def exchange_code_for_token(code):
        token_url = current_app.config['GOOGLE_TOKEN_URL']
        data = {
            'code': code,
            'client_id': current_app.config['GOOGLE_CLIENT_ID'],
            'client_secret': current_app.config['GOOGLE_CLIENT_SECRET'],
            'redirect_uri': current_app.config['GOOGLE_REDIRECT_URI'],
            'grant_type': 'authorization_code'
        }

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        response = requests.post(token_url, data=data, headers=headers)
        if response.status_code != 200:
            print(f"Token exchange failed: {response.text}")
            return None

        print(f"Token exchange succeeded: {response.json().keys()}")
        return response.json()

    @staticmethod
    def get_user_info(access_token):
        user_info_url = current_app.config['GOOGLE_USER_INFO_URL']
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(user_info_url, headers=headers)
        response.raise_for_status()
        return response.json()

