from flask import Flask
from flask_cors import CORS
import os

# Import blueprints
from routes.auth import auth_bp
from routes.products import products_bp
from routes.cart import cart_bp
from routes.coupons import coupons_bp

# ------------------ SETUP INSTRUCTIONS ------------------
#
# 1. Install dependencies:
#    pip install -r requirements.txt
#
# 2. Set up AWS credentials:
#    - Install the AWS CLI: https://aws.amazon.com/cli/
#    - Configure your credentials: `aws configure`
#    - You will need an AWS Access Key ID and Secret Access Key with permissions for DynamoDB.
#
# 3. Create DynamoDB tables:
#    - The necessary `aws dynamodb create-table` commands are provided in the comments of each model file in the `models/` directory.
#    - Run those commands in your terminal to create the Users, Products, Cart, and Coupons tables.
#
# 4. Set environment variables:
#    - For production, set a strong, unique SECRET_KEY.
#    - On Windows (Command Prompt): set SECRET_KEY=your_super_secret_key
#    - On Windows (PowerShell): $env:SECRET_KEY="your_super_secret_key"
#    - On Linux/macOS: export SECRET_KEY='your_super_secret_key'
#
# 5. Run the application:
#    - flask run
#    - The backend will be running at http://127.0.0.1:5000 by default.
#
# ------------------ FLASK APP ------------------

app = Flask(__name__)

# Enable CORS to allow requests from your frontend
# In a production environment, you should restrict the origins to your frontend's domain.
CORS(app, resources={r"/*": {"origins": "*"}})

# Set the secret key for JWT.
# It's recommended to use an environment variable for this.
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-default-secret-key')


# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api')
app.register_blueprint(cart_bp, url_prefix='/api')
app.register_blueprint(coupons_bp, url_prefix='/api')


@app.route('/')
def index():
    return "Flask backend is running!"

if __name__ == '__main__':
    # For development, you can run the app like this.
    # For production, use a WSGI server like Gunicorn or uWSGI.
    app.run(debug=True)
