
import boto3
from flask import Flask, request, jsonify, Blueprint
from dotenv import load_dotenv
import os
import mimetypes

load_dotenv()



application = Flask(__name__)

bucket_route = Blueprint('bucket_route', __name__)

@bucket_route.route('', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    try:
        # Determinar el Content-Type basado en la extensión del archivo
        content_type = mimetypes.guess_type(file.filename)[0] or 'application/octet-stream'

        s3_client = boto3.resource(
            's3',
            aws_access_key_id=os.environ.get('ENV_AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.environ.get('ENV_AWS_SECRET_ACCESS_KEY'),
            region_name=os.environ.get('ENV_AWS_REGION_NAME')
        )

        # Leer el contenido binario del archivo
        file_content = file.read()
        s3_client.Bucket(os.environ.get('ENV_AWS_S3_BUCKET_NAME')).put_object(
            Key=file.filename, Body=file_content, ContentType=content_type
        )
        return jsonify({'message': 'image uploaded successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    