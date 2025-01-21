from .. import db, bcrypt


class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # Admin, Publisher, Seeker
    oauth_provider = db.Column(db.String(50), nullable=True)
    oauth_id = db.Column(db.String(255), nullable=True)
    access_token = db.Column(db.String(255), nullable=True)
    refresh_token = db.Column(db.String(255), nullable=True)
    token_expiry = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


class SessionJWT(db.Model):
    __tablename__ = 'session_jwts'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('mj.users.id'), nullable=False)
    jwt_token = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    expires_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, jwt_token, expires_at):
        self.user_id = user_id
        self.jwt_token = jwt_token
        self.expires_at = expires_at


class PasswordReset(db.Model):
    __tablename__ = 'password_resets'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('mj.users.id'), nullable=False)
    reset_token = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    expires_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, reset_token, expires_at):
        self.user_id = user_id
        self.reset_token = reset_token
        self.expires_at = expires_at


class Profile(db.Model):
    __tablename__ = 'profiles'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('mj.users.id'), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    profile_picture_path = db.Column(db.String(255), nullable=True)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    skills = db.Column(db.ARRAY(db.String))
    experience = db.Column(db.JSON)
    education = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())


class JobType(db.Model):
    __tablename__ = 'job_type'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True) # Full-time, Part-time, Internship, Contract, Freelance, Temporary, Volunteer, Apprenticeship, Seasonal, Permanent, Other
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())


class JobStatus(db.Model):
    __tablename__ = 'job_status'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True) # Active, Inactive, Draft, Archived, Pending, Closed, Filled, Cancelled, On Hold, Suspended, Archived, Deleted
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())


class JobCategory(db.Model):
    __tablename__ = 'job_category'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True) # Healthcare, Technology, Finance, Engineering, Agriculture, Design, Marketing, Sales, HR, Legal, Customer Support, Other
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())


class Job(db.Model):
    __tablename__ = 'jobs'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    publisher_id = db.Column(db.Integer, db.ForeignKey('mj.users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('mj.job_category.id'), nullable=False)
    job_type_id = db.Column(db.Integer, db.ForeignKey('mj.job_type.id'), nullable=False)
    status_id = db.Column(db.Integer, db.ForeignKey('mj.job_status.id'), nullable=False)
    location = db.Column(db.String(255), nullable=True)
    responsibilities = db.Column(db.JSON, nullable=False)
    requirements = db.Column(db.ARRAY(db.String))
    salary_range = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    publisher = db.relationship('User', backref='jobs')
    category = db.relationship('JobCategory', backref='jobs')
    job_type = db.relationship('JobType', backref='jobs')
    status = db.relationship('JobStatus', backref='jobs')


class Message(db.Model):
    __tablename__ = 'messages'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('mj.users.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('mj.users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    msg_file_path = db.Column(db.String(255), nullable=True)
    read = db.Column(db.Boolean, default=False)
    sent_at = db.Column(db.DateTime, server_default=db.func.now())


class Notification(db.Model):
    __tablename__ = 'notifications'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('mj.users.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class Meeting(db.Model):
    __tablename__ = 'meetings'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(db.Integer, db.ForeignKey('mj.users.id'), nullable=False)
    participant_id = db.Column(db.Integer, db.ForeignKey('mj.users.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('mj.jobs.id'))
    scheduled_at = db.Column(db.DateTime, nullable=False)
    meeting_link = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class Analytics(db.Model):
    __tablename__ = 'analytics'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('mj.users.id'), nullable=False)
    report_type = db.Column(db.String(255), nullable=False)
    data = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class CompanyCulture(db.Model):
    __tablename__ = 'company_culture'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    publisher_id = db.Column(db.Integer, db.ForeignKey('mj.users.id'), nullable=False)
    company_name = db.Column(db.String(255), nullable=False)
    publisher_logo = db.Column(db.String(255), nullable=False)
    values = db.Column(db.ARRAY(db.String))
    benefits = db.Column(db.JSON)
    work_environment = db.Column(db.Text)
    file_path = db.Column(db.String(255), nullable=False)
    culture_score = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class Application(db.Model):
    __tablename__ = 'applications'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    seeker_id = db.Column(db.Integer, db.ForeignKey('mj.users.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('mj.jobs.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)  # Applied, Reviewed, Interviewed, Hired, Rejected
    cover_letter_path = db.Column(db.String(255), nullable=False)
    applied_at = db.Column(db.DateTime, server_default=db.func.now())

    seeker = db.relationship('User', backref='applications')
    job = db.relationship('Job', backref='applications')


class Resume(db.Model):
    __tablename__ = 'resumes'
    __table_args__ = {'schema': 'mj'}

    id = db.Column(db.Integer, primary_key=True)
    seeker_id = db.Column(db.Integer, db.ForeignKey('mj.users.id'), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
