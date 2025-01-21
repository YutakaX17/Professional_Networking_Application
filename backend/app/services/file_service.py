# services/file_service.py

import os
from werkzeug.utils import secure_filename
from flask import current_app
from .. import db


class FileService:
    def __init__(self):
        # Base directory for asset storage
        base_proj_dir = os.getcwd()
        self.base_folder = os.path.join(base_proj_dir, '..', 'backend', 'assets')
        self.allowed_extensions = {
            'profiles': {'jpg', 'png'},
            'messages': {'png', 'jpg', 'jpeg', 'doc', 'docx', 'pdf', 'mp3', 'mp4'},
            'company_culture': {'jpg', 'png', 'jpeg'},
            'applications': {'doc', 'docx', 'pdf'},
            'resumes': {'doc', 'docx', 'pdf'}
        }

        # Create base folder if it doesn't exist
        if not os.path.exists(self.base_folder):
            os.makedirs(self.base_folder)

    def allowed_file(self, filename, category):
        """Check if the file extension is allowed for the given category."""
        if not filename:
            return False
        extension = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
        return extension in self.allowed_extensions.get(category, set())

    def save_file(self, file, category, db_model, db_column, identifier, create_if_not_exists=False):
        """
        Save a file for a specific category and associate it with the database record.

        :param file: File object from the request
        :param category: Category of the file (e.g., 'profiles', 'messages', etc.)
        :param db_model: SQLAlchemy model representing the table
        :param db_column: Column to store the file path in the table
        :param identifier: Identifier to fetch the specific database record
        :param create_if_not_exists: Whether to create the record if it doesn't exist
        :return: File path stored in the database
        """
        if not file or not self.allowed_file(file.filename, category):
            raise ValueError(f"Invalid file type for category: {category}")

        # Get the category subfolder name
        subfolder_name = self._get_subfolder_name(category)

        # Create full subfolder path
        subfolder_path = os.path.join(self.base_folder, subfolder_name)

        # Create subfolder if it doesn't exist
        if not os.path.exists(subfolder_path):
            os.makedirs(subfolder_path)

        # Generate a unique filename to avoid overwrites
        original_filename = secure_filename(file.filename)
        filename_base, file_extension = os.path.splitext(original_filename)
        counter = 1
        filename = original_filename

        while os.path.exists(os.path.join(subfolder_path, filename)):
            filename = f"{filename_base}_{counter}{file_extension}"
            counter += 1

        # Create the full file path
        file_path = os.path.join(subfolder_path, filename)

        try:
            # Save the file
            file.save(file_path)

            # Store relative path in database
            relative_path = os.path.relpath(file_path, self.base_folder)
            db_path = os.path.join('assets', relative_path).replace('\\', '/')

            if identifier is not None:
                # Update database record
                record = db_model.query.get(identifier)
                if not record and create_if_not_exists:
                    record = db_model(id=identifier)
                    db.session.add(record)
                elif not record:
                    raise ValueError(f"No record found for ID: {identifier}")

                setattr(record, db_column, db_path)
                db.session.commit()

            return db_path

        except Exception as e:
            # If file was created but database update failed, remove the file
            if os.path.exists(file_path):
                os.remove(file_path)
            raise e

    def _get_subfolder_name(self, category):
        """Return the subfolder name based on the category."""
        subfolder_map = {
            'profiles': 'seeker_prof_pics',
            'messages': 'message_files',
            'company_culture': 'publisher_photos',
            'applications': 'applications',
            'resumes': 'resumes'
        }
        return subfolder_map.get(category, 'general')

    def get_file_url(self, file_path):
        """Generate a public URL for the file."""
        if not file_path:
            return None

        base_url = current_app.config.get('FILE_BASE_URL', 'http://localhost:5000')
        return f"{base_url}/{file_path}"


# Example usage
#if __name__ == '__main__':
 #   service = FileService()
  #  print(service._get_subfolder_name('profiles'))  # 'seeker_prof_pics'
