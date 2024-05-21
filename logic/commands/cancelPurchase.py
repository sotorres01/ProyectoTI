from logic.purchaseService import PurchaseService
from logic.command import Command
from controller.Controller import Controller


class CancelPurchase(Command):

    def __init__(self, id_purchase: int, user_id: str ) -> None:
        self.id_purchase = id_purchase
        self.user_id = user_id

    def execute(self) -> None:
        #operaciones para cancelar la compra
        db = Controller()

        #verifcar asociacion de compra con usuario
        db.cursor.execute("SELECT * FROM purchase WHERE id_purchase = %s AND user_id = %s", (self.id_purchase, self.user_id,))
        purchase = db.cursor.fetchone()

        if purchase == None:
            return "Purchase not found"

        
        db.cursor.execute("SELECT * FROM purchase_details WHERE id_purchase = %s", (self.id_purchase,))
        products = db.cursor.fetchall()

        for product in products:
            db.cursor.execute("SELECT * FROM product WHERE id_product = %s", (product[1],))
            product_info = db.cursor.fetchone()
            db.cursor.execute("UPDATE product SET stock = %s WHERE id_product = %s", (product_info[6] + product[2], product[1],))

        #eliminar la compra
        db.cursor.execute("DELETE FROM purchase WHERE id_purchase = %s", (self.id_purchase,))

        db.connection.commit()
        return "Purchase cancelled"