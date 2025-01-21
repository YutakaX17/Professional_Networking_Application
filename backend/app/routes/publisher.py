from flask import Blueprint, request, jsonify, send_file
from sqlalchemy.exc import IntegrityError
from .. import db
from ..models.mj_tables import CompanyCulture, Job, JobCategory, JobType, JobStatus, Application, Resume
from ..services import FileService
from ..utils.auth_utils import token_required
from ..utils.security import decode_token
import json

publisher_bp = Blueprint('publisher', __name__, url_prefix='/publisher')
file_service = FileService()

@publisher_bp.route('/company-culture', methods=['POST'])
def create_company_culture():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Valid authorization token required'}), 401

        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        publisher_id = payload['user_id']

        data = request.form
        photos = request.files.getlist('photos')
        logo = request.files.get('logo')

        # Save photos and logo using FileService
        file_paths = []
        for photo in photos:
            file_path = file_service.save_file(
                file=photo,
                category='company_culture',
                db_model=CompanyCulture,
                db_column='file_path',
                identifier=None
            )
            file_paths.append(file_path)

        logo_path = None
        if logo:
            logo_path = file_service.save_file(
                file=logo,
                category='company_culture',
                db_model=CompanyCulture,
                db_column='publisher_logo',
                identifier=None
            )

        # Create a new company culture entry in the database
        company_culture = CompanyCulture(
            publisher_id=publisher_id,
            company_name=data.get('company_name'),
            values=data.getlist('values'),
            benefits=json.loads(data.get('benefits')),
            work_environment=data.get('work_environment'),
            file_path=','.join(file_paths),
            publisher_logo=logo_path,
            culture_score=data.get('culture_score')
        )
        db.session.add(company_culture)
        db.session.commit()

        return jsonify({'message': 'Company culture created successfully'}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Failed to create company culture'}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@publisher_bp.route('/company-culture/<int:publisher_id>', methods=['GET'])
def get_company_culture(publisher_id):
    try:
        fields = request.args.get('fields', '').split(',')
        company_culture = CompanyCulture.query.filter_by(publisher_id=publisher_id).first()
        if not company_culture:
            return jsonify({'error': 'Company culture not found'}), 404

        response_data = {}
        if 'publisher_logo' in fields:
            response_data['publisher_logo'] = company_culture.publisher_logo
        else:
            response_data = {
                'company_name': company_culture.company_name,
                'publisher_logo': company_culture.publisher_logo,
                'values': company_culture.values,
                'benefits': company_culture.benefits,
                'work_environment': company_culture.work_environment,
                'culture_score': company_culture.culture_score,
                'photos': company_culture.file_path.split(',') if company_culture.file_path else []
            }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@publisher_bp.route('/jobs', methods=['POST'])
def create_job_post():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Valid authorization token required'}), 401

        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        publisher_id = payload['user_id']

        data = request.json
        job = Job(
            title=data['title'],
            description=data['description'],
            publisher_id=publisher_id,
            category_id=data['category_id'],
            job_type_id=data['job_type_id'],
            status_id=data['status_id'],
            location=data.get('location'),
            responsibilities=data.get('responsibilities', []),
            requirements=data.get('requirements', []),
            salary_range=data.get('salary_range')
        )
        db.session.add(job)
        db.session.commit()

        return jsonify({'message': 'Job post created successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@publisher_bp.route('/jobs', methods=['GET'])
def get_job_posts():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Valid authorization token required'}), 401

        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        publisher_id = payload['user_id']

        job_posts = Job.query.filter_by(publisher_id=publisher_id).all()
        job_posts_data = [
            {
                'id': job.id,
                'title': job.title,
                'description': job.description,
                'category': job.category.name,
                'job_type': job.job_type.name,
                'status': job.status.name,
                'location': job.location,
                'responsibilities': job.responsibilities,
                'requirements': job.requirements,
                'salary_range': job.salary_range,
                'created_at': job.created_at.isoformat(),
                'updated_at': job.updated_at.isoformat()
            }
            for job in job_posts
        ]

        return jsonify(job_posts_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@publisher_bp.route('/job-categories', methods=['GET'])
def get_job_categories():
    try:
        job_categories = JobCategory.query.all()
        job_categories_data = [
            {
                'id': category.id,
                'name': category.name,
                'description': category.description
            }
            for category in job_categories
        ]
        return jsonify(job_categories_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@publisher_bp.route('/job-types', methods=['GET'])
def get_job_types():
    try:
        job_types = JobType.query.all()
        job_types_data = [
            {
                'id': job_type.id,
                'name': job_type.name,
                'description': job_type.description
            }
            for job_type in job_types
        ]
        return jsonify(job_types_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@publisher_bp.route('/job-statuses', methods=['GET'])
def get_job_statuses():
    try:
        job_statuses = JobStatus.query.all()
        job_statuses_data = [
            {
                'id': status.id,
                'name': status.name,
                'description': status.description
            }
            for status in job_statuses
        ]
        return jsonify(job_statuses_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@publisher_bp.route('/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Valid authorization token required'}), 401

        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        publisher_id = payload['user_id']

        job = Job.query.get(job_id)
        if not job or job.publisher_id != publisher_id:
            return jsonify({'error': 'Job not found or unauthorized'}), 404

        data = request.json
        job.description = data.get('description', job.description)
        job.responsibilities = data.get('responsibilities', job.responsibilities)
        job.requirements = data.get('requirements', job.requirements)
        job.salary_range = data.get('salary_range', job.salary_range)
        db.session.commit()

        return jsonify({'message': 'Job updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@publisher_bp.route('/applications', methods=['GET'])
def get_applications():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        publisher_id = decode_token(token)['user_id']

        applications = Application.query \
            .join(Job) \
            .filter(Job.publisher_id == publisher_id) \
            .all()

        applications_data = []
        for app in applications:
            resume = Resume.query.filter_by(seeker_id=app.seeker_id).first()
            applications_data.append({
                'id': app.id,
                'job': {
                    'id': app.job.id,
                    'title': app.job.title
                },
                'seeker_id': app.seeker_id,
                'status': app.status,
                'applied_at': app.applied_at,
                'cover_letter_path': app.cover_letter_path,
                'resume_path': resume.file_path if resume else None
            })

        return jsonify(applications_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@publisher_bp.route('/applications/<int:application_id>/status', methods=['PUT'])
def update_application_status(application_id):
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        publisher_id = decode_token(token)['user_id']

        application = Application.query.get(application_id)
        if not application:
            return jsonify({'error': 'Application not found'}), 404

        # Verify publisher owns the job
        if application.job.publisher_id != publisher_id:
            return jsonify({'error': 'Unauthorized'}), 403

        data = request.get_json()
        application.status = data['status']
        db.session.commit()

        return jsonify({'message': 'Application status updated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@publisher_bp.route('/download/<path:file_path>', methods=['GET'])
@token_required
def download_document(current_user, file_path):
    try:
        file_service = FileService()
        full_path = file_service.get_full_path(file_path)

        if not full_path:
            return jsonify({'error': 'File not found'}), 404

        return send_file(full_path, as_attachment=True)

    except Exception as e:
        return jsonify({'error': str(e)}), 500



