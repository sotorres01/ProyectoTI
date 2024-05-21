from pydantic import BaseModel, PositiveInt, PositiveFloat


class Product(BaseModel):

    name_product: str = "name_product"
    price: PositiveFloat = 1
    category: str = "category"
    brand: str = "brand"
    description: str = "description"
    stock: PositiveInt = 1