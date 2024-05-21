from logic.product import Product
from logic.purchaseService import PurchaseService
from controller.Controller import Controller
from typing import List

class InventoryService(object):

    def __init__(self) -> None: #this is a constructor that not need attributes to be initialized
        pass

    def add_product(self, product: Product, image_1: str, image_2: str, image_3: str) -> str:
        db = Controller()
        return db.insert_product(product, image_1, image_2, image_3)

    def delete_product(self, id_pr: str) -> str:
        db = Controller()
        return db.delete_product(id_pr)

    def get_product(self, id_pr: int) -> str:
        db = Controller()
        return db.get_product(id_pr)

    def update_product(self, product: Product, id_pr: int) -> str:
        db = Controller()
        return db.update_product(product, id_pr)
    
    def see_shopping_cart(self, list_products: List[int],
                      list_amount: List[int]) -> str:
        db = Controller()
        return db.view_shopping_cart(list_products, list_amount)