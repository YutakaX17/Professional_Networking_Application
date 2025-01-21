from flask import current_app
import smtplib
from email.mime.text import MIMEText

class EmailService:
    @staticmethod
    def send_email(to_email, subject, body):
        smtp_server = current_app.config['SMTP_SERVER']
        smtp_port = current_app.config['SMTP_PORT']
        smtp_user = current_app.config['SMTP_USER']
        smtp_password = current_app.config['SMTP_PASSWORD']

        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = smtp_user
        msg['To'] = to_email

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [to_email], msg.as_string())
