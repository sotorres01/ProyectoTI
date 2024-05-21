from logic.purchaseService import PurchaseService
from controller.Controller import Controller
from logic.command import Command
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
import os.path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import base64
import mimetypes
import os
from email.message import EmailMessage
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import google.auth
from datetime import datetime


class MakePurchase(Command):

    def __init__(self, purchase: PurchaseService):
        self.purchase = purchase

    def execute(self):
        db = Controller()

        n_products = len(self.purchase.list_product)

        if n_products == 0:
            return "No hay productos en el carrito de compras"
        

        result = None
        products_without_stock = {}

        for i in range(n_products):
            db.cursor.execute("SELECT stock FROM product WHERE id_product = %s",
                              (self.purchase.list_product[i],))
            stock = db.cursor.fetchone()

            if stock[0] < self.purchase.list_amount[i]:
                products_without_stock[self.purchase.list_product[i]
                                       ] = f"No hay stock suficiente para el producto {self.purchase.list_product[i]}"
                result = products_without_stock

        if result == None:
            total_purchase = 0.0
            for i in range(n_products):
                db.cursor.execute("SELECT price FROM product WHERE id_product = %s",
                                  (self.purchase.list_product[i],))
                price = db.cursor.fetchone()
                total_purchase += price[0] * self.purchase.list_amount[i]

            self.purchase.total_purchase = total_purchase
            self.purchase.status = "REALIZADA"

            db.cursor.execute("INSERT INTO purchase (user_id, date_of_purchase, shipping_address, phone_contact, status, total_purchase) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id_purchase",
                              (self.purchase.user_id, self.purchase.date_of_purchase, self.purchase.shipping_address, self.purchase.phone_contact, self.purchase.status, self.purchase.total_purchase))
            purchase_id = db.cursor.fetchone()[0]

            subtotal = 0.0
            for i in range(n_products):

                db.cursor.execute("SELECT price FROM product WHERE id_product = %s",
                                  (self.purchase.list_product[i],))
                price = db.cursor.fetchone()
                subtotal = price[0] * self.purchase.list_amount[i]

                db.cursor.execute("INSERT INTO purchase_details (id_purchase, id_product, amount, subtotal) VALUES (%s, %s, %s, %s)",
                                  (purchase_id, self.purchase.list_product[i], self.purchase.list_amount[i], subtotal))

                db.cursor.execute("SELECT stock FROM product WHERE id_product = %s",
                                  (self.purchase.list_product[i],))
                stock = db.cursor.fetchone()

                new_stock = stock[0] - self.purchase.list_amount[i]

                db.cursor.execute("UPDATE product SET stock = %s WHERE id_product = %s",
                                  (new_stock, self.purchase.list_product[i]))

                db.connection.commit()

                result = self.purchase.buy()
            
            self.pdf(purchase_id,
                      self.purchase.user_id,
                        self.purchase.list_product,
                        self.purchase.list_amount,
                          self.purchase.total_purchase,
                          self.purchase.date_of_purchase,
                            self.purchase.shipping_address,
                            self.purchase.phone_contact
                          )

        db.connection.close()

        return result


    def pdf (self, id_purchase, id_user, list_products, list_amount, total, date_of_purchase, shipping_address, phone_contact):
        db = Controller()

        db.cursor.execute("SELECT user_name, email FROM users WHERE user_id = %s",
                            (id_user,))
        user = db.cursor.fetchone()


        products = []
        for i in range(len(list_products)):
            db.cursor.execute("SELECT name_product, price FROM product WHERE id_product = %s",
                                (list_products[i],))
            product = db.cursor.fetchone()
            product = list(product)
            product.append(list_amount[i])
            product.append(product[1] * list_amount[i])
            products.append(product)

        db.connection.close()
        
        
        for product in products:
            product[1] = str(product[1])
            product[2] = str(product[2])
            product[3] = str(product[3])

        date = str(date_of_purchase)
        date_obj = datetime.strptime(date, "%Y-%m-%d %H:%M:%S.%f%z")
        date_format = date_obj.strftime("%Y-%m-%d")



        # Crear el archivo PDF
        c = canvas.Canvas('Factura.pdf', pagesize=letter)
        width, height = letter

        # Definir los colores, fuentes e imágenes a usar
        color1 = colors.HexColor('#F0F0F0') # Gris claro
        color2 = colors.HexColor('#D9D9D9') # Gris oscuro
        color3 = colors.HexColor('#336EFF') # Azul
        font1 = 'Helvetica-Bold'
        font2 = 'Helvetica'
        logo = 'logo.png'

        # Crear el encabezado de la factura
        c.drawImage(logo, 50, height - 100, 100, 50) # Logo de la compañía
        c.setFont(font1, 24)
        c.setFillColor(color3)
        c.drawString(width - 200, height - 50, 'FACTURA') # Título de la factura
        c.line(50, height - 120, width - 50, height - 120) # Línea horizontal
        c.setFont(font2, 14)
        c.setFillColor(colors.black)
        c.drawString(50, height - 150, 'E-Commerce Company') # Nombre de la compañía
        c.drawString(50, height - 170, 'Dirección: '+ str(shipping_address)) # Dirección de la compañía
        c.drawString(50, height - 190, 'Teléfono: ' + str(phone_contact)) # Teléfono de la compañía
        c.drawString(50, height - 210, 'Email: ' + str(user[1])) # Email de la compañía
        c.drawString(width - 300, height - 150, 'Fecha: ' + date_format) # Fecha de la factura
        c.drawString(width - 300, height - 170, 'Factura #: '+ str(id_purchase)) # Número de la factura
        c.drawString(width - 300, height - 190, 'Cliente: '+ str(user[0])) # Nombre del cliente
        c.drawString(width - 300, height - 210, 'ID: '+ str(id_user)) # NIT del cliente

        # Crear una tabla para mostrar los productos con sus precios, cantidades y subtotales
        table_data = [['Nombre', 'Precio', 'Cantidad', 'Subtotal']] # Encabezado de la tabla
        for product in products:
            table_data.append(product) # Añadir una fila por cada producto

        # Calcular el ancho de las columnas según la longitud de las tuplas
        col_widths = [len(max(col, key=len)) * 0.1 * inch for col in zip(*table_data)]

        # Crear la tabla con el ancho de las columnas calculado
        table = Table(table_data, colWidths=col_widths)

        # Estilos para la tabla
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), color2), # Color de fondo del encabezado
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white), # Color de texto del encabezado
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'), # Alineación de las celdas
            ('FONTNAME', (0, 0), (-1, 0), font1), # Fuente del encabezado
            ('FONTSIZE', (0, 0), (-1, -1), 12), # Tamaño de la fuente
            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black), # Líneas internas de la tabla
            ('BOX', (0, 0), (-1, -1), 0.25, colors.black), # Borde externo de la tabla
        ]))

        # Dibujar la tabla en el PDF
        table.wrapOn(c, width, height)

        # Calcular el margen izquierdo de la tabla según el ancho de las columnas
        margin_left = (width - sum(col_widths)) / 2

        # Dibujar la tabla con el margen izquierdo calculado
        table.drawOn(c, margin_left, height - 500)

        for product in products:
            product[1] = float(product[1])
            product[2] = int(product[2])
            product[3] = float(product[3])



        # Crear una lista para mostrar el total, el impuesto y el descuento de la factura
        list_data = [
            ['Total:', f'${total:.2f}'],
        ]

        # Estilos para la lista
        styles = getSampleStyleSheet()
        styleN = styles['Normal']
        styleN.alignment = 2 # Alineación a la derecha
        styleB = styles['Normal']
        styleB.fontName = font1
        styleB.alignment = 2 # Alineación a la derecha

        # Dibujar la lista en el PDF
        x = width - 150
        y = height - 550
        for item in list_data:
            p = Paragraph(item[0], styleN)
            p.wrapOn(c, 60, 30)
            p.drawOn(c, x, y)
            q = Paragraph(item[1], styleB)
            q.wrapOn(c, 60, 20)
            q.drawOn(c, x + 60, y)
            y -= 20

        # Crear el pie de página de la factura
        c.line(50, 50, width - 50, 50) # Línea horizontal
        c.setFont(font2, 10)
        c.drawString(50, 40, 'Gracias por su compra') # Mensaje de agradecimiento
        c.drawString(width - 150, 40, f'Página {c.getPageNumber()}') # Número de página

        c.save()

        # Enviar la factura por correo electrónico

        SCOPES = ["https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/gmail.compose", "https://www.googleapis.com/auth/gmail.modify", "https://www.googleapis.com/auth/gmail.readonly"]
        """Shows basic usage of the Gmail API.
        Lists the user's Gmail labels.
        """
        creds = None
        # The file token.json stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first
        # time.
        if os.path.exists("token.json"):
            creds = Credentials.from_authorized_user_file("token.json", SCOPES)
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    "credentials.json", SCOPES
                )
                creds = flow.run_local_server(port=0)
            # Save the credentials for the next run
            with open("token.json", "w") as token:
                token.write(creds.to_json())

        try:
            # create gmail api client
            service = build("gmail", "v1", credentials=creds)
            mime_message = EmailMessage()

            # headers
            mime_message["To"] = user[1]
            mime_message["From"] = "ecomerce285@gmail.com"
            mime_message["Subject"] = "Factura de compra"

            # text
            mime_message.set_content(
                "Hi, this is automated mail with attachment.Please do not reply."
            )

            # attachment
            attachment_filename = "Factura.pdf"
            # guessing the MIME type
            type_subtype, _ = mimetypes.guess_type(attachment_filename)
            maintype, subtype = type_subtype.split("/")

            with open(attachment_filename, "rb") as fp:
                attachment_data = fp.read()
            mime_message.add_attachment(attachment_data, maintype, subtype, filename=attachment_filename)

            encoded_message = base64.urlsafe_b64encode(mime_message.as_bytes()).decode()

            create_draft_request_body =  {"raw": encoded_message}
            # pylint: disable=E1101
            # pylint: disable=E1101
            send_message = (
                service.users()
                .messages()
                .send(userId="me", body=create_draft_request_body)
                .execute()
            )
            print(f'Message Id: {send_message["id"]}')
        except HttpError as error:
            print(f"An error occurred: {error}")
            send_message = None
        return send_message   




