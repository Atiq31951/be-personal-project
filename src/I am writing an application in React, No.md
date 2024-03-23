I am writing an application in React, Node.js, express, mongodb. I want some features to implement.

Account:
A user can buy our subscription. He will be a super admin. We will give them an account if he has paid subscription for month pre-paidly. app will give him an warning from day 1 to day 7 in month everyday about his subscription is already end of the time to pay for the subscription. if the user does not pay the bill of running month, this account will be discontinued. Not closed or deleted. But if an account holder does not pay for last 2 month his all data will deleted to his account. Any account can be discontinued by the super powered user. One suer poered user can be created by another super powered user or discontinued. Only the ceo can do everything all.

The account holder can create new users for his account but their role must be lower-grade to the account holder. Account holders role can be super admin. An account holder can only be created by the super powered admin. The account holder with have an id, phone number (required), photo, address, shop/organization name.

User:
For each user there can be its parent who has created this user. Each user can create another user also. Each user have some authority role and power. Each user can see only what his immidiate descendent is doing. Each user can create new user with his lower roles user. The users has different roles and tasks.

1. Super-powered admin: who is the owner of this application and can remove any account holder or discontinue the account, I mean the super admin of an account also. Even all of his successor role like -> 'distributor', 'inventory_manager', 'super_powered_admin'.

2. Super admin for an account (who will purchase our service for an organization)

3. Inventory manager: who is only responsible for creating product, generet invoice of each item with count.  Mainly creating all created to inventory ins and out and tracking the inventory management rule an decission. He can assign delivery task to multiple delivery vender or boy. And he will never be able to change the price of the procut. To make price of products, He only can create an 

4. Distributor: who is related to distributing products to the deliveryman. with product. Then when automatically a log will be generated into a database. for a deliveryman, there may be multiple orders will be assigned to be delivered. With full payment or partial payment. So his basic access will be monitoring distribution and removing item count. of product. And he has to Assign a delivery man /. venders. He has to make a request to the inventory manager to change the price of a product. And that delivary all information should be logged in somewhere.


Customer:

there will be a customer model. The customer can be added or deleted or discontinued by the super admin. Customer will not have an account, that means he can not login into this system.

Customer will have

name (required)
email
phone number (required)
and photo if needed, and this will be a link uploaded to the CDN or app memory
payments
total buy
total paid
total pending
address (required)
shop name

payment:
And there will be a payment model where payment can be partial, full, or even will pay later. This payment will be only for a particular account.  But payment can be created by super admin or inventory manager. A payment never can be deleted. And a payment can only be created by the inventory manager and super admin. The all other user will never see any payment history.

Please do not reply anything.

I will ask you later something.