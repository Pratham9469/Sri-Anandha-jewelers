import boto3
from passlib.context import CryptContext
import uuid

# Configure password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# DynamoDB User Model
# This model handles all database operations for the Users table.
#
# Table structure:
# - userId: String (Primary Key)
# - name: String
# - email: String
# - passwordHash: String
#
# To create this table in DynamoDB, you can use the AWS CLI:
# aws dynamodb create-table \
#     --table-name Users \
#     --attribute-definitions AttributeName=userId,AttributeType=S \
#     --key-schema AttributeName=userId,KeyType=HASH \
#     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
#
# Note: For production, consider using on-demand capacity instead of provisioned throughput.

class UserModel:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb')
        self.table = self.dynamodb.Table('Users')

    def create_user(self, name, email, password):
        """
        Creates a new user in the database.
        Hashes the password before storing.
        """
        password_hash = pwd_context.hash(password)
        user_id = str(uuid.uuid4())
        
        try:
            self.table.put_item(
                Item={
                    'userId': user_id,
                    'name': name,
                    'email': email,
                    'passwordHash': password_hash
                }
            )
            return user_id
        except Exception as e:
            print(f"Error creating user: {e}")
            return None

    def find_by_email(self, email):
        """
        Finds a user by their email address.
        """
        try:
            response = self.table.scan(
                FilterExpression=boto3.dynamodb.conditions.Attr('email').eq(email)
            )
            items = response.get('Items', [])
            if items:
                return items[0]
            return None
        except Exception as e:
            print(f"Error finding user by email: {e}")
            return None

    def verify_password(self, plain_password, hashed_password):
        """
        Verifies a plain text password against a hashed password.
        """
        return pwd_context.verify(plain_password, hashed_password)
