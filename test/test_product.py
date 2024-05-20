import unittest
from logic.product import Product


class TestProduct(unittest.TestCase):

    def test_product_defaults(self):
        product = Product()
        self.assertEqual(product.name_product, "name_product")
        self.assertEqual(product.price, 0)
        self.assertEqual(product.category, "category")
        self.assertEqual(product.brand, "brand")
        self.assertEqual(product.description, "description")        
        self.assertEqual(product.stock, 0)

    def test_product_creation(self):
        product = Product(name_product="Test Product", price=10.99, category="Test Category", brand="Test Brand", description="Test Description", stock=100)
        self.assertEqual(product.name_product, "Test Product")
        self.assertEqual(product.price, 10.99)
        self.assertEqual(product.category, "Test Category")
        self.assertEqual(product.brand, "Test Brand")
        self.assertEqual(product.description, "Test Description")
        self.assertEqual(product.stock, 100)