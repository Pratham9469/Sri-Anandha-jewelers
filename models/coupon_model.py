import boto3
from datetime import datetime

# DynamoDB Coupon Model
# This model handles all database operations for the Coupons table.
#
# Table structure:
# - code: String (Primary Key)
# - discount: Number (e.g., 0.1 for 10%)
# - expiryDate: String (ISO 8601 format)
#
# To create this table in DynamoDB, you can use the AWS CLI:
# aws dynamodb create-table \
#     --table-name Coupons \
#     --attribute-definitions AttributeName=code,AttributeType=S \
#     --key-schema AttributeName=code,KeyType=HASH \
#     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

class CouponModel:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb')
        self.table = self.dynamodb.Table('Coupons')

    def get_coupon_by_code(self, code):
        """
        Retrieves a coupon by its code and checks if it's valid.
        """
        try:
            response = self.table.get_item(
                Key={'code': code}
            )
            coupon = response.get('Item')
            
            if not coupon:
                return None, "Coupon not found"

            # Check for expiry date
            if 'expiryDate' in coupon:
                expiry_date = datetime.fromisoformat(coupon['expiryDate'])
                if datetime.now() > expiry_date:
                    return None, "Coupon has expired"

            return coupon, "Coupon is valid"
            
        except Exception as e:
            print(f"Error getting coupon by code: {e}")
            return None, "Error retrieving coupon"

    def add_coupon(self, code, discount, expiry_date):
        """
        Adds a new coupon to the database.
        """
        try:
            self.table.put_item(
                Item={
                    'code': code,
                    'discount': discount,
                    'expiryDate': expiry_date
                }
            )
            return True
        except Exception as e:
            print(f"Error adding coupon: {e}")
            return False
