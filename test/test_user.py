import unittest
from unittest.mock import MagicMock
from logic.user import User
from logic.command import Command


class TestUser(unittest.TestCase):

    def setUp(self):
        self.user = User()


    def test_default_values(self):
        user = User()
        self.assertEqual(user.user_id, "id")
        self.assertEqual(user.user_name, "name")
        self.assertEqual(user.email, "email")
        self.assertEqual(user.role, "role")

    def test_custom_values(self): 
        user = User(user_id="user123", user_name="Test User", email="example@email.com", role="Admin")
        self.assertEqual(user.user_id, "user123")
        self.assertEqual(user.user_name, "Test User")
        self.assertEqual(user.email, "example@email.com")
        self.assertEqual(user.role, "Admin")

    def test_set_command(self):
        command = MagicMock(spec=Command)
        self.user.set_command(command)
        self.assertEqual(self.user.command, command)

    def test_execute_command(self):
        command = MagicMock(spec=Command)
        command.execute.return_value = "Command executed successfully"
        self.user.set_command(command)
        result = self.user.execute_command()
        self.assertEqual(result, "Command executed successfully")

    def test_add_user(self):
        controller = MagicMock()
        controller.insert_user.return_value = "User added successfully"
        with unittest.mock.patch('controller.Controller.Controller', return_value=controller):
            result = self.user.add_user()
            self.assertEqual(result, "User added successfully")
            controller.insert_user.assert_called_once_with(self.user)