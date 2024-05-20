import json


class ListDictAdapter():

    def __init__(self, list: list, description: list) -> None:

        self.__list = list
        self.__description = description


    @property
    def list(self):
        return self.__list
    
    @list.setter
    def list(self, list):
        self.__list = list

    @property
    def description(self):
        return self.__description
    
    @description.setter
    def description(self, description):
        self.__description = description

    def rows_to_dict(self):
        dictionary = []
        for row in self.__list:
            for i in range(len(self.__list)):
                fields = [column[0] for column in self.__description]
            dictionary.append({key: value for key, value in zip(fields, row)})
        return dictionary