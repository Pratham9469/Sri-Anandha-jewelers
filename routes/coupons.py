from flask import Blueprint, request, jsonify
from models.coupon_model import CouponModel
from models.cart_model import CartModel
from routes.auth import token_required
import decimal

coupons_bp = Blueprint('coupons_bp', __name__)
coupon_model = CouponModel()
cart_model = CartModel()

# Helper to convert Decimal to float for JSON serialization
class DecimalEncoder(decimal.Decimal):
    def __float__(self):
        return float(self)

@coupons_bp.route('/coupons/apply', methods=['POST'])
@token_required
def apply_coupon(current_user):
    """
    Apply a coupon to the user's cart.
    Expects 'couponCode' in the request body.
    """
    data = request.get_json()
    coupon_code = data.get('couponCode')

    if not coupon_code:
        return jsonify({'message': 'Coupon code is required'}), 400

    coupon, message = coupon_model.get_coupon_by_code(coupon_code)

    if not coupon:
        return jsonify({'message': message}), 404

    cart = cart_model.get_cart_by_user_id(current_user['userId'])
    
    subtotal = sum(decimal.Decimal(item['price']) * item['quantity'] for item in cart['items'])
    
    discount_percentage = decimal.Decimal(coupon['discount'])
    discount_amount = subtotal * discount_percentage
    total = subtotal - discount_amount

    # Use a custom encoder or convert Decimals to floats before returning the response
    cart['subtotal'] = float(subtotal)
    cart['discount'] = float(discount_amount)
    cart['total'] = float(total)
    cart['applied_coupon'] = coupon['code']

    return jsonify(cart)

@coupons_bp.route('/coupons', methods=['POST'])
@token_required
def add_coupon(current_user):
    """
    Add a new coupon. This is a protected route, and in a real-world app, should be restricted to admins.
    Expects 'code', 'discount', and 'expiryDate' in the request body.
    """
    data = request.get_json()
    code = data.get('code')
    discount = data.get('discount') # e.g., 0.1 for 10%
    expiry_date = data.get('expiryDate') # ISO 8601 format string

    if not all([code, discount, expiry_date]):
        return jsonify({'message': 'Missing required fields'}), 400

    if coupon_model.add_coupon(code, decimal.Decimal(str(discount)), expiry_date):
        return jsonify({'message': 'Coupon added successfully'}), 201
    else:
        return jsonify({'message': 'Failed to add coupon'}), 500
