from flask import Blueprint, request, jsonify
from .. import db
from ..models.mj_tables import JobCategory, JobType, JobStatus
from ..utils.security import decode_token

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/job-categories', methods=['POST'])
def create_job_category():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Valid authorization token required'}), 401

        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        if payload['role'] != 'Admin':
            return jsonify({'error': 'Admin access required'}), 403

        data = request.json
        name = data.get('name')
        description = data.get('description')

        if not name:
            return jsonify({'error': 'Name is required'}), 400

        job_category = JobCategory(name=name, description=description)
        db.session.add(job_category)
        db.session.commit()

        return jsonify({'message': 'Job category created successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/job-types', methods=['POST'])
def create_job_type():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Valid authorization token required'}), 401

        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        if payload['role'] != 'Admin':
            return jsonify({'error': 'Admin access required'}), 403

        data = request.json
        name = data.get('name')
        description = data.get('description')

        if not name:
            return jsonify({'error': 'Name is required'}), 400

        job_type = JobType(name=name, description=description)
        db.session.add(job_type)
        db.session.commit()

        return jsonify({'message': 'Job type created successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/job-statuses', methods=['POST'])
def create_job_status():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Valid authorization token required'}), 401

        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        if payload['role'] != 'Admin':
            return jsonify({'error': 'Admin access required'}), 403

        data = request.json
        name = data.get('name')
        description = data.get('description')

        if not name:
            return jsonify({'error': 'Name is required'}), 400

        job_status = JobStatus(name=name, description=description)
        db.session.add(job_status)
        db.session.commit()

        return jsonify({'message': 'Job status created successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
