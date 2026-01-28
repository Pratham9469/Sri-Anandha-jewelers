import boto3
import uuid

# DynamoDB Product Model
# This model handles all database operations for the Products table.
#
# Table structure:
# - productId: String (Primary Key)
# - name: String
# - price: Number
# - description: String
# - imageUrl: String
# - stock: Number
#
# To create this table in DynamoDB, you can use the AWS CLI:
# aws dynamodb create-table \
#     --table-name Products \
#     --attribute-definitions AttributeName=productId,AttributeType=S \
#     --key-schema AttributeName=productId,KeyType=HASH \
#     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

class ProductModel:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb')
        self.table = self.dynamodb.Table('Products')

    def add_product(self, name, price, description, image_url, stock):
        """
        Adds a new product to the database.
        """
        product_id = str(uuid.uuid4())
        try:
            self.table.put_item(
                Item={
                    'productId': product_id,
                    'name': name,
                    'price': price,
                    'description': description,
                    'imageUrl': image_url,
                    'stock': stock
                }
            )
            return product_id
        except Exception as e:
            print(f"Error adding product: {e}")
            return None

    def delete_product(self, product_id):
        """
        Deletes a product from the database.
        """
        try:
            self.table.delete_item(
                Key={'productId': product_id}
            )
            return True
        except Exception as e:
            print(f"Error deleting product: {e}")
            return False

    def get_all_products(self):
        """
        Retrieves all products from the database.
        """
        try:
            response = self.table.scan()
            return response.get('Items', [])
        except Exception as e:
            print(f"Error getting all products: {e}")
            return []

    def get_product_by_id(self, product_id):
        """
        Retrieves a single product by its ID.
        """
        try:
            response = self.table.get_item(
                Key={'productId': product_id}
            )
            return response.get('Item')
        except Exception as e:
            print(f"Error getting product by id: {e}")
            return None
