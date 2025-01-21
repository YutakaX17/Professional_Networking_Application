import json
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from .. import db
from ..models.mj_tables import Profile, User, Job, Application, JobType, JobStatus, CompanyCulture, Resume
from ..services import FileService
from ..utils.security import decode_token, validate_google_token

seeker_bp = Blueprint('seeker', __name__, url_prefix='/seeker')
file_service = FileService()

# validate user existence
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        raise ValueError(f"User with ID {user_id} does not exist.")
    return user

@seeker_bp.route('/profile/create', methods=['POST'])
def create_seeker_profile():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Valid authorization token required'}), 401

        token = auth_header.split(' ')[1]

        # Check if this is a Google OAuth user
        google_user = User.query.filter(
            User.oauth_provider == 'google',
            User.access_token == token
        ).first()

        if google_user:
            user_id = google_user.id
        else:
            # Regular JWT validation
            payload = decode_token(token)
            user_id = payload.get('user_id')

        if not user_id:
            return jsonify({'error': 'User not found'}), 404

        data = request.form

        # Ensure the user exists
        user = get_user(user_id)

        # Check if a profile already exists for this user
        existing_profile = Profile.query.filter_by(user_id=user_id).first()
        if existing_profile:
            return jsonify({'error': 'A profile already exists for this user.'}), 400

        # Save profile picture (optional)
        file = request.files.get('profile_picture')
        profile_picture_path = None
        if file:
            profile_picture_path = file_service.save_file(
                file=file,
                category='profiles',
                db_model=Profile,
                db_column='profile_picture_path',
                identifier=None
            )

        # Create a new profile
        profile = Profile(
            user_id=user_id,
            bio=data.get('bio'),
            full_name=data.get('full_name'),
            phone=data.get('phone'),
            location=data.get('location'),
            skills=data.getlist('skills'),
            experience=data.get('experience'),
            education=data.get('education'),
            profile_picture_path=profile_picture_path
        )
        db.session.add(profile)
        db.session.commit()

        return jsonify({'message': 'Profile created successfully', 'profile_id': profile.id}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Profile creation failed due to integrity constraints.'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@seeker_bp.route('/profile/update/<int:user_id>', methods=['PUT'])
def update_seeker_profile(user_id):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Valid authorization token required'}), 401

        token = auth_header.split(' ')[1]
        payload = decode_token(token)

        # Verify user is updating their own profile
        if payload['user_id'] != user_id:
            return jsonify({'error': 'Unauthorized to update this profile'}), 403

        profile = Profile.query.filter_by(user_id=user_id).first()
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404

        data = request.form
        file = request.files.get('profile_picture')

        # Update profile picture if provided
        if file:
            profile.profile_picture_path = file_service.save_file(
                file=file,
                category='profiles',
                db_model=Profile,
                db_column='profile_picture_path',
                identifier=profile.id
            )

        # Update other fields
        profile.bio = data.get('bio', profile.bio)
        profile.full_name = data.get('full_name', profile.full_name)
        profile.phone = data.get('phone', profile.phone)
        profile.location = data.get('location', profile.location)
        profile.skills = data.getlist('skills') if data.getlist('skills') else profile.skills
        profile.experience = json.loads(data.get('experience', json.dumps(profile.experience)))
        profile.education = json.loads(data.get('education', json.dumps(profile.education)))

        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@seeker_bp.route('/profile/<int:user_id>', methods=['GET'])
def retrieve_seeker_profile(user_id):
    """
    Retrieve a seeker profile by user_id.
    Query Parameters:
        fields: Comma-separated list of fields to return
              : ?fields=profile_picture_path,full_name,skills
    """
    try:
        # Retrieve profile by user_id
        profile = Profile.query.filter_by(user_id=user_id).first()
        if not profile:
            return jsonify({'error': 'Profile not found.'}), 404

        # Get requested fields from query parameters
        fields = request.args.get('fields')

        # All available fields
        all_fields = {
            'user_id': profile.user_id,
            'profile_id': profile.id,
            'bio': profile.bio,
            'full_name': profile.full_name,
            'phone': profile.phone,
            'location': profile.location,
            'skills': profile.skills,
            'experience': profile.experience,
            'education': profile.education,
            'profile_picture_path': profile.profile_picture_path
        }

        # If specific fields are requested, filter the response
        if fields:
            requested_fields = [field.strip() for field in fields.split(',')]
            profile_data = {field: all_fields[field]
                            for field in requested_fields
                            if field in all_fields}

            # If any requested fields were invalid, include them in the response
            invalid_fields = [field for field in requested_fields if field not in all_fields]
            if invalid_fields:
                profile_data['invalid_fields'] = invalid_fields
        else:
            profile_data = all_fields

        return jsonify(profile_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@seeker_bp.route('/jobs', methods=['GET'])
def get_jobs():
    try:
        search_term = request.args.get('search', '')
        category_id = request.args.get('category', '')
        job_type_id = request.args.get('jobType', '')

        query = Job.query.join(JobType).join(JobStatus)

        if search_term:
            query = query.filter(Job.title.ilike(f'%{search_term}%') | Job.description.ilike(f'%{search_term}%'))

        if category_id:
            query = query.filter_by(category_id=category_id)

        if job_type_id:
            query = query.filter_by(job_type_id=job_type_id)

        jobs = query.all()

        job_data = []
        for job in jobs:
            job_data.append({
                'id': job.id,
                'title': job.title,
                'description': job.description,
                'company': job.publisher.username,
                'location': job.location,
                'salary_range': job.salary_range,
                'job_type': job.job_type.name,
                'status': job.status.name,
                'responsibilities': job.responsibilities,
                'requirements': job.requirements,
                'created_at': job.created_at.strftime('%Y-%m-%d'),
                'publisher_logo': CompanyCulture.query.filter_by(
                    publisher_id=job.publisher_id).first().publisher_logo if CompanyCulture.query.filter_by(
                    publisher_id=job.publisher_id).first() else None,
            })

        return jsonify(job_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@seeker_bp.route('/jobs/<int:job_id>/apply', methods=['POST'])
def apply_for_job(job_id):
    try:
        # Validate authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Valid authorization token required'}), 401

        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        seeker_id = payload['user_id']

        # Check if job exists
        job = Job.query.get(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404

        # Check for existing application
        existing_application = Application.query.filter_by(
            seeker_id=seeker_id,
            job_id=job_id
        ).first()
        if existing_application:
            return jsonify({'error': 'You have already applied for this job'}), 400

        # Validate required files
        if 'coverLetter' not in request.files or 'resume' not in request.files:
            return jsonify({'error': 'Cover letter and resume are required'}), 400

        cover_letter = request.files['coverLetter']
        resume = request.files['resume']

        file_service = FileService()

        # Save cover letter
        cover_letter_path = file_service.save_file(
            cover_letter,
            'applications',
            Application,
            'cover_letter_path',
            None,
            True
        )

        # Save resume
        resume_path = file_service.save_file(
            resume,
            'resumes',
            Resume,
            'file_path',
            None,
            True
        )

        # Create application record
        application = Application(
            seeker_id=seeker_id,
            job_id=job_id,
            status='Applied',
            cover_letter_path=cover_letter_path
        )

        # Create resume record
        resume_record = Resume(
            seeker_id=seeker_id,
            file_path=resume_path
        )

        # Add and commit all records
        db.session.add(application)
        db.session.add(resume_record)
        db.session.commit()

        return jsonify({
            'message': 'Application submitted successfully',
            'application_id': application.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

