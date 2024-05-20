import psycopg2
import requests
import base64
import os
from typing import List
from math import trunc
from logic.product import Product
from logic.user import User
from API.application.utils import set_up
from io import BytesIO
from PIL import Image
from controller.listDictAdapter import ListDictAdapter


INSERT_SUCCESS = "inserted successfully"
DELETE_SUCCESS = "deleted successfully"


class Controller():

    def __init__(self) -> None:

        config_db = set_up()

        DBNAME = config_db['DBNAME']
        USER = config_db['USER']
        PASSWORD = config_db['PASSWORD']
        HOST = config_db['HOST']
        PORT = config_db['PORT']

        self.connection = psycopg2.connect(
            dbname=DBNAME, user=USER, password=PASSWORD, host=HOST, port=PORT)
        self.cursor = self.connection.cursor()

    def save_image(self, url):
        response = requests.get(url)
        img_data = BytesIO(response.content)
        return img_data.getvalue()

    def insert_product(self, pr: Product, image_1: str, image_2: str, image_3: str):

        list_images = [image_1, image_2, image_3]
        data_img = []

        for image in list_images:
            if image != None:
                data_img.append(self.save_image(image))
            else:
                data_img.append(None)

        self.cursor.execute(
            "INSERT INTO Product (name_product, price, category, brand, description, stock) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id_product",
            (pr.name_product, pr.price, pr.category, pr.brand, pr.description, pr.stock))
        pr_id = self.cursor.fetchone()[0]
        self.cursor.execute(
            "INSERT INTO Product_images (Id_product, image_1, image_2, image_3) VALUES (%s, %s, %s, %s)",
            (pr_id, data_img[0], data_img[1], data_img[2]))
        self.connection.commit()
        self.connection.close()
        return INSERT_SUCCESS

    def delete_product(self, id_product: int):
        self.cursor.execute(
            "DELETE FROM Product WHERE id_product = %s", (id_product,))
        self.connection.commit()
        self.connection.close()
        return DELETE_SUCCESS

    def get_product(self, id_product: int = None):
        if id_product == None:
            self.cursor.execute(
                "SELECT * FROM product INNER JOIN product_images USING(id_product) ORDER BY id_product")
            
            product = self.cursor.fetchall()

            n_product = len(product)

            for i in range(n_product):
                for j in range(7, 10):
                    if product[i][j] != None:
                        encoded_image = base64.b64encode(
                            product[i][j]).decode('utf-8')
                        encoded_image = "data:image/png;base64,"+encoded_image
                        product[i] = list(product[i])
                        product[i][j] = encoded_image
                        product[i] = tuple(product[i])

            new_dict = ListDictAdapter(product, self.cursor.description)
            product = new_dict.rows_to_dict()
            self.connection.close()

            return product

        self.cursor.execute(
            "SELECT * FROM product INNER JOIN product_images USING(id_product) WHERE id_product = %s", (id_product,))
        product = self.cursor.fetchone()


        for i in range(7, 10):
            if product[i] != None:
                encoded_image = base64.b64encode(
                    product[i]).decode('utf-8')
                encoded_image = "data:image/png;base64,"+encoded_image
                product = list(product)
                product[i] = encoded_image
                product = tuple(product)

        product = [product]
        new_dict = ListDictAdapter(product, self.cursor.description)
        product = new_dict.rows_to_dict()
        self.connection.close()

        return product

    def insert_user(self, user: User):
        self.cursor.execute(
            "INSERT INTO Users (user_id, user_name, email, role) VALUES (%s, %s, %s, %s) ON CONFLICT (user_id) DO UPDATE SET user_id = %s, user_name = %s, email = %s, role = %s",
            (user.user_id, user.user_name, user.email, user.role, user.user_id, user.user_name, user.email, user.role))
        self.connection.commit()
        self.connection.close()
        return INSERT_SUCCESS
    
    def get_user(self, user_id: str ):
        self.cursor.execute(
            "SELECT * FROM Users WHERE user_id = %s", (user_id,))
        user = self.cursor.fetchall()
        self.connection.close()
        return user
    
    def update_product(self, product: Product, id_product: int):

        self.cursor.execute("SELECT COUNT(*) FROM Product WHERE id_product = %s", (id_product,))
        if self.cursor.fetchone()[0] == 0:
            self.connection.close()
            return "Product not found"
        
        
        self.cursor.execute(
            "UPDATE Product SET name_product = %s, price = %s, category = %s, brand = %s, description = %s, stock = %s WHERE id_product = %s",
            (product.name_product, product.price, product.category, product.brand, product.description, product.stock, id_product))
        self.connection.commit()
        self.connection.close()
        return INSERT_SUCCESS
    
    def view_shopping_cart(self, list_products: List[int],
                      list_amount: List[int]):
        self.cursor.execute(
            "SELECT *  FROM product  JOIN product_images USING (id_product) WHERE id_product IN (SELECT unnest(%s)) ORDER BY ARRAY_POSITION(%s, id_product);", (list_products,list_products))
        shoppingcart = self.cursor.fetchall()

        n_product = len(shoppingcart)

        for i in range(n_product):
            for j in range(7, 10):
                if shoppingcart[i][j] != None:
                    encoded_image = base64.b64encode(
                        shoppingcart[i][j]).decode('utf-8')
                    encoded_image = "data:image/png;base64,"+encoded_image
                    shoppingcart[i] = list(shoppingcart[i])
                    shoppingcart[i][j] = encoded_image
                    shoppingcart[i] = tuple(shoppingcart[i])
        new_dict = ListDictAdapter(shoppingcart, self.cursor.description)
        shoppingcart = new_dict.rows_to_dict()

        total_purchase = 0

        def truncate(number: float, max_decimals: int) -> float:
            int_part, dec_part = str(number).split(".")
            return float(".".join((int_part, dec_part[:max_decimals])))

        for i in range(n_product):
            total_purchase += shoppingcart[i]["price"] * list_amount[i]
        self.connection.close()

        total_purchase = truncate(total_purchase, 2)
        shoppingcart = {"total_purchase": total_purchase, "list_product": shoppingcart, "list_amount": list_amount}

        return shoppingcart

    def get_purchases(self, user_id: str):
        if user_id == None:
            self.cursor.execute('''SELECT
                                        p.id_purchase,
                                        u.user_name,
                                        p.date_of_purchase,
                                        p.shipping_address,
                                        p.phone_contact,
                                        p.total_purchase,
                                        ARRAY_AGG(pd.id_product) AS product_ids,
                                        ARRAY_AGG(pd.amount) AS amounts
                                    FROM
                                        public.purchase p
                                    JOIN
                                        public.purchase_details pd ON p.id_purchase = pd.id_purchase
                                    JOIN
                                        public.users u ON p.user_id = u.user_id
                                    GROUP BY
                                        p.id_purchase, u.user_name, p.date_of_purchase, p.shipping_address, p.phone_contact, p.total_purchase
                                    ORDER BY
                                        p.id_purchase''')
            purchases = self.cursor.fetchall()

            new_dict = ListDictAdapter(purchases, self.cursor.description)
            purchases = new_dict.rows_to_dict()
            self.connection.close()
            return purchases
        else:
            self.cursor.execute('''SELECT
                                        p.id_purchase,
                                        u.user_name,
                                        p.date_of_purchase,
                                        p.shipping_address,
                                        p.phone_contact,
                                        p.total_purchase,
                                        ARRAY_AGG(pd.id_product) AS product_ids,
                                        ARRAY_AGG(pd.amount) AS amounts
                                    FROM
                                        public.purchase p
                                    JOIN
                                        public.purchase_details pd ON p.id_purchase = pd.id_purchase
                                    JOIN
                                        public.users u ON p.user_id = u.user_id
                                    WHERE
                                        p.user_id = %s
                                    GROUP BY
                                        p.id_purchase, u.user_name, p.date_of_purchase, p.shipping_address, p.phone_contact, p.total_purchase
                                    ORDER BY
                                        p.id_purchase;''', (user_id,))
            
            purchases = self.cursor.fetchall()
            new_dict = ListDictAdapter(purchases, self.cursor.description)
            purchases = new_dict.rows_to_dict()
            self.connection.close()
            return purchases
        
    def delete_purchase(self, id_purchase: int):
        self.cursor.execute(
            "DELETE FROM Purchase WHERE id_purchase = %s", (id_purchase,))
        self.connection.commit()
        self.connection.close()
        return DELETE_SUCCESS