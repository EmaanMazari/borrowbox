import os
import hmac
import hashlib
import logging

logger = logging.getLogger(__name__)


class PaymentGatewayBase:
    """
    Abstract interface for Pakistani mobile payment gateways (JazzCash, Easypaisa, Raast).
    """
    def initiate_transaction(self, unlock_request, return_url):
        raise NotImplementedError

    def verify_webhook(self, payload, signature):
        raise NotImplementedError

    def query_status(self, transaction_ref):
        raise NotImplementedError


class JazzCashGateway(PaymentGatewayBase):
    """
    Architecture for JazzCash Merchant Payment Gateway integration (HTTP POST / REST API).
    Uses HMAC-SHA256 signature hashing with Merchant Password & Integrity Salt.
    """
    def __init__(self):
        self.merchant_id = os.environ.get('JAZZ_CASH_MERCHANT_ID', '')
        self.password = os.environ.get('JAZZ_CASH_PASSWORD', '')
        self.integrity_salt = os.environ.get('JAZZ_CASH_INTEGER_KEY', '')
        self.return_url = os.environ.get('JAZZ_CASH_RETURN_URL', 'http://localhost:5173/payment/callback/jazzcash')

    def generate_secure_hash(self, data_dict):
        """
        Sorts fields alphabetically, prepends integrity salt, and generates HMAC-SHA256 hash.
        Per official JazzCash specification.
        """
        sorted_keys = sorted([k for k in data_dict.keys() if data_dict[k] is not None and k != 'pp_SecureHash'])
        hash_string = self.integrity_salt
        for k in sorted_keys:
            val = str(data_dict[k])
            if val:
                hash_string += f"&{val}"

        hash_obj = hmac.new(self.integrity_salt.encode('utf-8'), hash_string.encode('utf-8'), hashlib.sha256)
        return hash_obj.hexdigest().upper()

    def initiate_transaction(self, unlock_request, return_url=None):
        """
        Prepares post data payload for redirecting student to JazzCash gateway or mobile voucher.
        Fee is 100.00 PKR (represented in paisas or rupees depending on API version).
        """
        amount_pkr = int(unlock_request.amount * 100) # Amount in paisas for JazzCash API
        txn_ref = f"BB-UNLOCK-{unlock_request.id}"

        payload = {
            'pp_Version': '1.1',
            'pp_TxnType': 'MPAY',
            'pp_Language': 'EN',
            'pp_MerchantID': self.merchant_id or 'MOCK_MERCHANT_ID',
            'pp_Password': self.password or 'MOCK_PASSWORD',
            'pp_TxnRefNo': txn_ref,
            'pp_Amount': str(amount_pkr),
            'pp_TxnCurrency': 'PKR',
            'pp_TxnDateTime': unlock_request.created_at.strftime('%Y%m%d%H%M%S'),
            'pp_BillReference': f"bookbazar_{unlock_request.listing_id}",
            'pp_Description': f"Contact Unlock Fee for '{unlock_request.listing.title[:25]}'",
            'pp_ReturnURL': return_url or self.return_url,
        }

        if self.integrity_salt:
            payload['pp_SecureHash'] = self.generate_secure_hash(payload)

        return {
            'gateway': 'JazzCash',
            'gateway_configured': bool(self.merchant_id and self.password),
            'action_url': 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/' if bool(self.merchant_id) else None,
            'txn_ref': txn_ref,
            'payload': payload
        }

    def verify_webhook(self, payload, signature):
        """
        Verifies callback data authenticity.
        """
        if not self.integrity_salt:
            return False
        expected_hash = self.generate_secure_hash(payload)
        return hmac.compare_digest(expected_hash, signature)


class EasypaisaGateway(PaymentGatewayBase):
    """
    Architecture for Telenor Easypaisa Open API v2 checkout gateway integration.
    """
    def __init__(self):
        self.store_id = os.environ.get('EASYPAISA_STORE_ID', '')
        self.hash_key = os.environ.get('EASYPAISA_HASH_KEY', '')
        self.post_back_url = os.environ.get('EASYPAISA_RETURN_URL', 'http://localhost:5173/payment/callback/easypaisa')

    def initiate_transaction(self, unlock_request, return_url=None):
        order_id = f"BB-EP-{unlock_request.id}"
        amount_str = f"{unlock_request.amount:.2f}"

        payload = {
            'storeId': self.store_id or 'MOCK_STORE_ID',
            'orderId': order_id,
            'transactionAmount': amount_str,
            'mobileAccountNo': '',
            'emailAddress': unlock_request.buyer.email,
            'transactionType': 'MA',
            'tokenExpiry': '',
            'postBackURL': return_url or self.post_back_url
        }

        return {
            'gateway': 'Easypaisa',
            'gateway_configured': bool(self.store_id and self.hash_key),
            'action_url': 'https://easypay.easypaisa.com.pk/easypay/Index.jsf' if bool(self.store_id) else None,
            'order_id': order_id,
            'payload': payload
        }
