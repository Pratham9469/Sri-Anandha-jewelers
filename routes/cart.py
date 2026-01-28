from flask import Blueprint, request, jsonify
from models.cart_model import CartModel
from models.product_model import ProductModel
from routes.auth import token_required

cart_bp = Blueprint('cart_bp', __name__)
cart_model = CartModel()
product_model = ProductModel()

@cart_bp.route('/cart', methods=['GET'])
@token_required
def get_cart(current_user):
    """
    Get the current user's cart.
    """
    cart = cart_model.get_cart_by_user_id(current_user['userId'])
    return jsonify(cart)


@cart_bp.route('/cart/add', methods=['POST'])
@token_required
def add_to_cart(current_user):
    """
    Add a product to the cart.
    Expects 'productId' and 'quantity' in the request body.
    """
    data = request.get_json()
    product_id = data.get('productId')
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({'message': 'Product ID is required'}), 400

    # Check if the product exists
    product = product_model.get_product_by_id(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    cart = cart_model.get_cart_by_user_id(current_user['userId'])
    
    # Check if the item is already in the cart
    item_found = False
    for item in cart['items']:
        if item['productId'] == product_id:
            item['quantity'] += quantity
            item_found = True
            break
            
    if not item_found:
        cart['items'].append({
            'productId': product_id,
            'quantity': quantity,
            'name': product['name'],
            'price': product['price']
        })

    cart_model.update_cart(cart)
    return jsonify(cart)


@cart_bp.route('/cart/remove', methods=['POST'])
@token_required
def remove_from_cart(current_user):
    """
    Remove a product from the cart.
    Expects 'productId' in the request body.
    """
    data = request.get_json()
    product_id = data.get('productId')

    if not product_id:
        return jsonify({'message': 'Product ID is required'}), 400

    cart = cart_model.get_cart_by_user_id(current_user['userId'])
    
    # Remove the item from the cart
    cart['items'] = [item for item in cart['items'] if item['productId'] != product_id]

    cart_model.update_cart(cart)
    return jsonify(cart)
