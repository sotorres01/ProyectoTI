from typing import Optional
from pydantic import BaseModel
from logic.command import Command


class User(BaseModel):

    user_id: str = "id"
    user_name: str = "name"
    email: str = "email"
    role: str = "role"
    command: str = Optional[str]


    def set_command(self, command):
        self.command = command

    def execute_command(self):
        return self.command.execute()

    def add_user(self):
        from controller.Controller import Controller
        db = Controller()
        return db.insert_user(self)
