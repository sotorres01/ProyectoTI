resource "azurerm_network_security_group" "nsg_utb_front_2" {
  name                = "nsg_utb_front_2"
  location            = azurerm_resource_group.location.eastus
  resource_group_name = azurerm_resource_group.name.utb_proyectoEC

  security_rule {
    name                       = "allowSSH"
    priority                   = 101
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "allowPublicWeb"
    priority                   = 102
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  
  security_rule {
    name                       = "allowHttps"
    priority                   = 103
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_public_ip" "public_ip_front2" {
  name                = "vm_ip_front2"
  location            = azurerm_resource_group.location.eastus
  resource_group_name = azurerm_resource_group.name.utb_proyectoEC
  allocation_method   = "Static"
  domain_name_label   = "front2ec"
}

resource "azurerm_network_interface" "vm_nic_front2" {
  name                = "vm_nic_front2"
  location            = azurerm_resource_group.location.eastus
  resource_group_name = azurerm_resource_group.name.utb_proyectoEC

  ip_configuration {
    name                          = "ipconfig_nic_front2"
    subnet_id                     = azurerm_subnet.utb_subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.public_ip_front2.id
  }
}

resource "azurerm_network_interface_security_group_association" "nsg_nic_assoc_front2" {
  network_interface_id      = azurerm_network_interface.vm_nic_front2.id
  network_security_group_id = azurerm_network_security_group.nsg_utb_front_2.id
}

resource "azurerm_linux_virtual_machine" "utb_vm_front2" {
  name                  = "frontend2_vm"
  location              = azurerm_resource_group.location.eastus
  resource_group_name   = azurerm_resource_group.name.utb_proyectoEC
  network_interface_ids = [azurerm_network_interface.vm_nic_front2.id]
  size                  = "Standard_DS1_v2"

  os_disk {
    name                 = "myOsDisk_front2"
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }

  computer_name                   = "utbvmfront2"
  admin_username                  = "azureuser"
  disable_password_authentication = true

  admin_ssh_key {
    username   = "azureuser"
    public_key = tls_private_key.ssh_key.public_key_openssh
  }
}

resource "local_file" "ansible_inventory_front2" {
  depends_on = [azurerm_linux_virtual_machine.utb_vm_front2]
  content  =templatefile("inventory.tftpl", {
    ip_addrs = [azurerm_public_ip.public_ip_front2.ip_address]
    ssh_keyfile = format("%s/%s", abspath(path.root), "priv_key.ssh")

  })
  filename = "inventory_front2"
}

resource "null_resource" "run_ansible_front2" {
  depends_on = [azurerm_linux_virtual_machine.utb_vm_front2]

  provisioner "local-exec" {
    command = "sleep 30 && ansible-playbook -i ${local_file.ansible_inventory_front2.filename} --private-key ${local_sensitive_file.private_key.filename} frontend.yaml"
  }
}

output "virtual_machine_ip_front2" {
  value = azurerm_public_ip.public_ip_front2.ip_address
}