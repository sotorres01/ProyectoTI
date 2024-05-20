import unittest
from datetime import datetime
from logic.purchaseService import PurchaseService


class TestPurchaseService(unittest.TestCase):

    def setUp(self):
        self.purchase = PurchaseService()

    def test_default_values(self):
        purchase = PurchaseService()
        self.assertEqual(purchase.id_purchase, 0)
        self.assertEqual(purchase.user_id, "id")
        self.assertEqual(purchase.date_of_purchase, self.purchase.date_of_purchase)
        self.assertEqual(purchase.shipping_address, "address")
        self.assertEqual(purchase.phone_contact, "phone")
        self.assertEqual(purchase.status, "pending")
        self.assertEqual(purchase.total_purchase, 0.0)
        self.assertEqual(purchase.list_product, [])
        self.assertEqual(purchase.list_amount, [])

    def test_custom_values(self):

        self.purchase = PurchaseService(
            id_purchase=1,
            user_id="user123",
            date_of_purchase=datetime.now(),
            shipping_address="123 Main St",
            phone_contact="555-1234",
            status="pending",
            total_purchase=100.0,
            list_product=["product1", "product2"],
            list_amount=[1, 2]
        )

        self.assertEqual(self.purchase.id_purchase, 1)
        self.assertEqual(self.purchase.user_id, "user123")
        self.assertEqual(self.purchase.date_of_purchase, self.purchase.date_of_purchase)
        self.assertEqual(self.purchase.shipping_address, "123 Main St")
        self.assertEqual(self.purchase.phone_contact, "555-1234")
        self.assertEqual(self.purchase.status, "pending")
        self.assertEqual(self.purchase.total_purchase, 100.0)
        self.assertEqual(self.purchase.list_product, ["product1", "product2"])
        self.assertEqual(self.purchase.list_amount, [1, 2])

    def test_buy(self):
        self.purchase.buy()
        self.assertEqual(self.purchase.status, "pending")

    def test_cancel(self):
        self.purchase.cancel()
        self.assertEqual(self.purchase.status, "pending")