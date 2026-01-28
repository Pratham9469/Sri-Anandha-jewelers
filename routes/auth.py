from flask import Blueprint, request, jsonify
from models.user_model import UserModel
import jwt
import datetime
from functools import wraps
import os

# This is a secret key for JWT. In a real application, use a more secure key and keep it secret.
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-default-secret-key')

auth_bp = Blueprint('auth_bp', __name__)
user_model = UserModel()

# Decorator to protect routes that require authentication
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = user_model.find_by_email(data['email'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    User signup route.
    Expects 'name', 'email', and 'password' in the request body.
    """
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'message': 'Missing required fields'}), 400

    if user_model.find_by_email(email):
        return jsonify({'message': 'User with this email already exists'}), 409

    user_id = user_model.create_user(name, email, password)

    if user_id:
        return jsonify({'message': 'User created successfully', 'userId': user_id}), 201
    else:
        return jsonify({'message': 'Failed to create user'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    User login route.
    Expects 'email' and 'password' in the request body.
    Returns a JWT token on successful login.
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = user_model.find_by_email(email)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    if user_model.verify_password(password, user['passwordHash']):
        token = jwt.encode({
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        
        return jsonify({'token': token, 'userId': user['userId'], 'name': user['name']})
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
