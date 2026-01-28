import boto3
import uuid

# DynamoDB Cart Model
# This model handles all database operations for the Cart table.
#
# Table structure:
# - cartId: String (Primary Key)
# - userId: String (Foreign Key to Users table)
# - items: List of maps, where each map contains productId, quantity, etc.
#
# To create this table in DynamoDB, you can use the AWS CLI:
# aws dynamodb create-table \
#     --table-name Cart \
#     --attribute-definitions AttributeName=cartId,AttributeType=S \
#     --key-schema AttributeName=cartId,KeyType=HASH \
#     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
#
# It is also recommended to create a secondary index on userId to easily find a user's cart.
# aws dynamodb update-table \
#     --table-name Cart \
#     --attribute-definitions AttributeName=userId,AttributeType=S \
#     --global-secondary-index-updates \
#         "[{\"Create\":{\"IndexName\": \"UserIndex\",\"KeySchema\":[{\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"}], \
#         \"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}}]"


class CartModel:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb')
        self.table = self.dynamodb.Table('Cart')

    def get_cart_by_user_id(self, user_id):
        """
        Retrieves the cart for a given user.
        """
        try:
            # Note: This scan can be inefficient. A secondary index on userId is recommended.
            response = self.table.scan(
                FilterExpression=boto3.dynamodb.conditions.Attr('userId').eq(user_id)
            )
            items = response.get('Items', [])
            if items:
                return items[0]
            else:
                # Create a new cart if one doesn't exist
                cart_id = str(uuid.uuid4())
                new_cart = {
                    'cartId': cart_id,
                    'userId': user_id,
                    'items': []
                }
                self.table.put_item(Item=new_cart)
                return new_cart
        except Exception as e:
            print(f"Error getting cart by user id: {e}")
            return None

    def update_cart(self, cart):
        """
        Updates the cart in the database.
        """
        try:
            self.table.put_item(Item=cart)
            return True
        except Exception as e:
            print(f"Error updating cart: {e}")
            return False

