from datetime import datetime
from pydantic import BaseModel
from controller.Controller import Controller


class PurchaseService(BaseModel):

    id_purchase: int = 0
    user_id: str = "id"
    date_of_purchase: datetime = datetime.now()
    shipping_address: str = "address"
    phone_contact: str = "phone"
    status: str = "pending"
    total_purchase: float = 0.0
    list_product: list = []
    list_amount: list = []

    def buy(self):
        return "compra realizada" 

    def cancel(self):
        return "compra cancelada"

    def get_purchases(self, id_user: str):
        db = Controller()
        return db.get_purchases(id_user)
    
    def delete_purchase(self, id_purchase: int):
        db = Controller()
        return db.delete_purchase(id_purchase)
        
