from fastapi import Depends, FastAPI, Response, status, Query
from fastapi.security import HTTPBearer
from API.application.utils import VerifyToken , set_up
from starlette.middleware.cors import CORSMiddleware
from logic.inventoryService import InventoryService
from logic.product import Product
from logic.purchaseService import PurchaseService
from logic.Commands.makePurchase import MakePurchase
from logic.Commands.cancelPurchase import CancelPurchase
from logic.user import User
from typing import List
import json
import uvicorn
import http.client


app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

token_auth_scheme = HTTPBearer()


@app.get("/api/public")
def public():
    """No access token required to access this route"""

    result = {
        "status": "success",
        "msg": ("Hello from a public endpoint! "
                "You don't need to be authenticated to see this.")
    }
    return result


@app.post("/ADD_PRODUCT/")
async def add_product(response: Response,
                      product: Product,
                      image_1: str = Query(..., alias="image1"),
                      image_2: str = Query(default=None, alias="image2"),
                      image_3: str = Query(default=None, alias="image3"),
                      token: str = Depends(token_auth_scheme)):

    result = VerifyToken(token.credentials).verify()

    if result.get("status"):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return result
    service = InventoryService()

    result = service.add_product(product=product,
                                 image_1=image_1, image_2=image_2, image_3=image_3)
    return result


@app.delete("/DELETE_PRODUCT/")
async def delete_product(response: Response,
                         id_product: str = Query(..., alias="id_product"),
                         token: str = Depends(token_auth_scheme)):

    result = VerifyToken(token.credentials).verify()

    if result.get("status"):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return result

    service = InventoryService()

    result = service.delete_product(id_pr=id_product)
    return result


@app.get("/GET_PRODUCT/")
async def get_product(id_product: str = Query(default=None, alias="id_product")):
    service = InventoryService()
    result = service.get_product(id_product)
    return result


@app.post("/ADD_USER/")
async def add_user(user: User):
    return user.add_user()


@app.post("/BUY/")
async def buy(response: Response, purchase: PurchaseService,
        token: str = Depends(token_auth_scheme)):

    result = VerifyToken(token.credentials).verify()

    if result.get("status"):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return result
    
    makepurchase_command = MakePurchase(purchase)
    
    user = User(user_id=purchase.user_id)

    user.set_command(makepurchase_command)
    return user.execute_command()

@app.delete("/CANCEL_PURCHASE/")
async def cancel_purchase(response: Response,
                          user : User,
                          id_purchase: int = Query(..., alias="id_purchase"),
                          token: str = Depends(token_auth_scheme)):
    
        result = VerifyToken(token.credentials).verify()
    
        if result.get("status"):
            response.status_code = status.HTTP_400_BAD_REQUEST
            return result
    
        User = user
        User.set_command(CancelPurchase(id_purchase, User.user_id))
        return User.execute_command()

@app.get("/GET_MANAGEMENT_TOKEN/")
async def get_management_token(response: Response, token: str = Depends(token_auth_scheme)):
    """A valid access token is required to access this route"""

    config_management = set_up()

    result = VerifyToken(token.credentials).verify()

    if result.get("status"):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return result

    conn = http.client.HTTPSConnection("asecommercesystem.us.auth0.com")


    payload_template = "{{\"client_id\":\"{}\",\"client_secret\":\"{}\",\"audience\":\"{}\",\"grant_type\":\"{}\"}}"

    payload = payload_template.format(config_management["CLIENT_ID"], config_management["CLIENT_SECRET"],
                                       config_management["AUDIENCE"], config_management["GRANT_TYPE"] )


    headers = { 'content-type': "application/json" }

    conn.request("POST", "/oauth/token", payload, headers)

    res = conn.getresponse()
    data = res.read()
    data  =  json.loads(data.decode("utf-8"))
    return data.get("access_token")

@app.put("/UPDATE_PRODUCT/")
async def update_product(response: Response, product: Product, id_pr: int = Query(..., alias="id_product"),
                   token: str = Depends(token_auth_scheme)):

    result = VerifyToken(token.credentials).verify()

    if result.get("status"):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return result

    service = InventoryService()

    result = service.update_product(product, id_pr)
    return result

@app.post("/SEE-SHOOPING-CART/")
async def see_shopping_cart(response: Response, list_products: List[int],
                      list_amount: List[int],
                      token: str = Depends(token_auth_scheme)):

    result = VerifyToken(token.credentials).verify()

    if result.get("status"):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return result

    service = InventoryService()

    result = service.see_shopping_cart(list_products, list_amount)
    return result


@app.get("/GET-PURCHASES/")
async def get_purchases(response: Response, user_id: str = Query(default=None, alias="user_id"),
                        token: str = Depends(token_auth_scheme)):

    result = VerifyToken(token.credentials).verify()

    if result.get("status"):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return result

    service = PurchaseService()

    result = service.get_purchases(user_id)
    return result

@app.delete("/DELETE_PURCHASE/")
async def delete_purchase(response: Response,
                         id_purchase: int = Query(..., alias="id_purchase"),
                         token: str = Depends(token_auth_scheme)):

    result = VerifyToken(token.credentials).verify()

    if result.get("status"):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return result

    service = PurchaseService()

    result = service.delete_purchase(id_purchase)
    return result

@app.get("/api/private")
async def private(response: Response, token: str = Depends(token_auth_scheme)):
    """A valid access token is required to access this route"""

    result = VerifyToken(token.credentials).verify()

    if result.get("status"):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return result

    result = {
        "status": "success",
        "msg": ("Hello from a private endpoint! "
                "You need to be authenticated to see this.")
    }
    return result
