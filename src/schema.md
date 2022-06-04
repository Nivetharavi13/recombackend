#SCHEMA 
- ##User
    - firstName : String
    - lastName : String 
    - email : String 
    - password : String (Hashed) 
    - Address : [
        {
         - Address( from address schema) 
        }
    ] 
    - Orders : [
        {
            address : Adress ( from address schema)
        }
    ]
- ##Order 
    - address : Address ( from address schema) 
    - user : User ( from user schema )
    - products : [
        product : Product (from Product schema)
    ]
    - total : Number 
    - status : ["payment_pending", "payment_success", "payment_errored"]

- ##Address
    -  houseNumber : String
    -  fullAddress : String
    -  landMark : String

- ##Category 
    - name : String
    - description : String

- ##Product
    - name : String 
    - stickerPrice : Number
    - markedPrice : Number
    - category : Category ( from category schema )
    - image : String (URL)
    - compatibleWith : ["iPhone", "iPhone12", "Apple Watch"]
    - stock : Number
    - color : String 
    - weight : String 
    