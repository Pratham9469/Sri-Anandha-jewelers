from flask import Blueprint, request, jsonify
from models.product_model import ProductModel
from routes.auth import token_required

products_bp = Blueprint('products_bp', __name__)
product_model = ProductModel()

@products_bp.route('/products', methods=['GET'])
def get_products():
    """
    Get all products.
    """
    products = product_model.get_all_products()
    return jsonify(products)

@products_bp.route('/products', methods=['POST'])
@token_required
def add_product(current_user):
    """
    Add a new product. This is a protected route.
    Expects 'name', 'price', 'description', 'imageUrl', 'stock' in the request body.
    """
    # Note: You might want to add role-based access control to ensure only admins can add products.
    # For now, any authenticated user can add a product.
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    description = data.get('description')
    image_url = data.get('imageUrl')
    stock = data.get('stock')

    if not all([name, price, description, image_url, stock]):
        return jsonify({'message': 'Missing required fields'}), 400

    product_id = product_model.add_product(name, float(price), description, image_url, int(stock))
    
    if product_id:
        return jsonify({'message': 'Product added successfully', 'productId': product_id}), 201
    else:
        return jsonify({'message': 'Failed to add product'}), 500


@products_bp.route('/products/<product_id>', methods=['DELETE'])
@token_required
def delete_product(current_user, product_id):
    """
    Delete a product. This is a protected route.
    """
    # Note: You might want to add role-based access control to ensure only admins can delete products.
    if product_model.delete_product(product_id):
        return jsonify({'message': 'Product deleted successfully'}), 200
    else:
        return jsonify({'message': 'Failed to delete product'}), 500
