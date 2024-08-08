from flask import Flask, jsonify, request #imports flask and allows us to instantiate an app
from flask_sqlalchemy import SQLAlchemy # this is Object Relational Mapper
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session # this is a class that all of our classes will inherit
# provides base functionality for converting python objects to rows of data
from sqlalchemy import select, delete #query our database with a select statement
from flask_marshmallow import Marshmallow # creates our schema to validate incoming and outgoing data
from flask_cors import CORS # Cross Origin Resource Sharing - allows our application to be accessed by 3rd parties
import datetime
from typing import List #tie a one to many relationship back to the one
from marshmallow import ValidationError, fields, validate




app = Flask(__name__)
CORS(app) #initializes CORS for our application
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://root:Amoamati1.@localhost/e_commerce_db3"
#  'mysql+mysqlconnector://root:your_password@localhost/e_commerce_db'
#                           user  password                database name

# create a Base class for all of our Models (classes that become tables) to inherit from
# the child classes can then create attributes that become columns inside of tables in our db
# objects from those tables create rows of data in our db
class Base(DeclarativeBase):
    pass

# instantiate our db
db = SQLAlchemy(app, model_class=Base) #tells the db instance that we use the Base class for the model functionality
# model - class that becomes a table in the db
ma = Marshmallow(app) # creating a marshmallow object for the schema creation



# ========================= DB MODELS ==============================
class Customer(Base): #importing the Base class gives this class model functionality
    __tablename__ = "Customers" # sets the name of the table in our database
    # type hinting - column name is an attribute and we're creating a ty
    # variable_name: type <-- type hinting, what is the expected type for this variable    
    customer_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(255), nullable=False)
    email: Mapped[str] = mapped_column(db.String(320), nullable=False)
    phone: Mapped[str] = mapped_column(db.String(15))
    # one-to-one relationship with customer account
    customer_account: Mapped["CustomerAccount"] = db.relationship(back_populates="customer")
    # create a one-to-many relationship with Order
    orders: Mapped[List["Order"]] = db.relationship(back_populates="customer")

    def __str__(self):
        return {"customer_id": self.customer_id, "name": self.name, "email": self.email, "phone":self.phone}


# Customer Account with a one to one relationship with the Customer table
class CustomerAccount(Base):
    __tablename__ = "Customer_Accounts"
    # attribute_name: attribute type = any constraints for that column
    account_id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(db.String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(db.String(255), nullable = False)
    # create the foreign key from the customer table
    customer_id: Mapped[int] = mapped_column(db.ForeignKey('Customers.customer_id'))
    # create the back reference relationship between objects of the classes
    customer: Mapped["Customer"] = db.relationship(back_populates="customer_account")

# associate table between orders and products to manage the many to many relationship
order_product = db.Table(
    "Order_Product", #association table name
    Base.metadata,
    db.Column("order_id", db.ForeignKey("orders.order_id"), primary_key=True),
    db.Column("product_id", db.ForeignKey("Products.product_id"), primary_key=True)      
)

# creating Orders and a one to many relationship bewtween Customer and Order
class Order(Base):
    __tablename__ = "orders"

    order_id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[datetime.date] = mapped_column(db.Date, nullable = False)
    # creating relationship with Customer 
    customer_id: Mapped[int] = mapped_column(db.ForeignKey("Customers.customer_id"))
    status: Mapped[bool] = mapped_column(nullable=False, default=1)
    # Many-to-one relation from order to customer
    customer: Mapped["Customer"] = db.relationship(back_populates="orders")
    # Many to many with product, with no back populates
    products: Mapped[List["Product"]] = db.relationship(secondary=order_product)

class Product(Base):
    __tablename__ = "Products"
    product_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(255), nullable=False)
    price: Mapped[float] = mapped_column(db.Float, nullable=False)

# using context manager to create tables in our db
with app.app_context():
    # db.drop_all() drop all tables currently in the database
    db.create_all() #create tables if they dont exist, if they do exist, it does nothing


# Customer Schema
class CustomerSchema(ma.Schema):
    customer_id = fields.Integer()
    name = fields.String(required=True)
    email = fields.String(required=True)
    phone = fields.String(required=True)

    class Meta:
        # fields to expose (what is displayed during a GET request)
        fields = ("customer_id", "email", "name", "phone")

# instantiating our Schemas
customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)


# ======================================== API ROUTES ======================================================
# CUSTOMERS
# get all customers
@app.route("/customers", methods = ["GET"])
def get_customers():
    query = select(Customer) #using the select method from our ORM(SQLAlchemy) 
    # to run a SELECT query == SELECT * FROM Customers
    # uses the python class as representation for the Customers table
    result = db.session.execute(query).scalars() # returns a list of customer objects (instances of the customer class)
    # rather than a list of rows or tuples
    customers = result.all() #fetches all rows of data from the result
    for customer in customers:
        for order in customer.orders:
            print(order.products) #prints
    # convert to json through the instance of the CustomerSchema class
    return customers_schema.jsonify(customers)

# add a customer
@app.route("/customers", methods = ["POST"])
def add_customer():
    try:
        # validate the incoming data from the request
        # making sure it adheres to our schema
        customer_data = customer_schema.load(request.json)
    
    except ValidationError as err:
        return jsonify(err.messages), 400 #Bad Request - insufficient data or mismatched type
    
    # start the db session using the Session import
    # instantiate the Session class with a context manager
    with Session(db.engine) as session: #temporarily instantiates Session to get access to a session object 
        with session.begin(): #Start the db transaction to post data
            name = customer_data['name']
            email = customer_data['email']
            phone = customer_data['phone']

            new_customer = Customer(name=name, email=email, phone=phone) 
            # INSERT INTO Customers (name, email, phone) VALUES(%s, %s, %s)
            # new_customer = (name, email, phone)
            session.add(new_customer)
            session.commit()
    
    return jsonify({"message": "Customer created"}), 201

@app.route("/customers/<int:id>", methods = ["PUT"])
def update_customer(id):
    with Session(db.engine) as session:
        with session.begin():
            # select the customer who's data we'd like to update
            #                         WHERE customer_id = id
            query = select(Customer).filter(Customer.customer_id == id)
            # grabbing the first first result from scalars, returning the object out of the list of results
            result = session.execute(query).scalars().first()
            if result is None:
                return jsonify({"message": "Customer not found"}), 404 # resource not found
            
            # setting a variable to the result
            customer = result

            try: 
                # validate incoming data to update the customer object above
                customer_data = customer_schema.load(request.json)
            except ValidationError as err:
                return jsonify(err.messages), 400 #Bad Request
            
            # update the customer object with the values from the incoming data
            # and then commit the changes
            for field, value in customer_data.items():
                setattr(customer, field, value)

            session.commit() #commits the transaction

    return jsonify({"message": "Customer details updated successfully"}), 200 #Successful request


@app.route("/customers/<int:id>", methods=["DELETE"])
def delete_customer(id):
    # delete_statement = delete(Customer).where(Customer.customer_id == id)
    with Session(db.engine) as session:
        with session.begin():
            query = select(Customer).filter(Customer.customer_id == id)
            result = session.execute(query).scalars().first()
            
            if result is None:
                return jsonify({"error": "Customer not found..."}), 404 #not found
            
            session.delete(result) #delete within the session
            
            # delete_statement = delete(Customer).where(Customer.customer_id == id)

            # result = db.session.execute(delete_statement)
            # print(result)
            # print(result.rowcount)

            # if result.rowcount == 0:
            #     return jsonify({"error": "Customer not found."}), 404

        return jsonify({"message": "Customer removed successfully!"})
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------Product Schema and routes
# Product Schema with validation rules
class ProductSchema(ma.Schema):
    product_id = fields.Integer(required=False)
    name = fields.String(required=True, validate=validate.Length(min=1))
    price = fields.Float(required=True, validate=validate.Range(min=0))

    class Meta:
        fields = ("product_id", "name", "price")
# instantiating our Schemas
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

# WORKING WITH OUR PRODUCTS
# adding a product
@app.route('/products', methods=["POST"])
def add_product():
    try:
        #validate Data
        product_data = product_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400 #Bad Request - insufficient data or mismatched type

    with Session(db.engine) as session:
        with session.begin():
            # Create a new product instance
            new_product = Product(name=product_data['name'], price=product_data['price'])
            session.add(new_product)
            session.commit()

    return jsonify({"Message": "New product successfully added!"}), 201 #new resource has been created
#get all products
@app.route('/products', methods=["GET"])
def get_products():
    query = select(Product) #SELECT * FROM Product
    result = db.session.execute(query).scalars()
    products = result.all()

    return products_schema.jsonify(products)
#get products by id
@app.route("/products/<int:product_id>", methods=["GET"])
def get_product_by_id(product_id):
    query = select(Product).filter(Product.product_id == product_id)
    result = db.session.execute(query).scalar()
    print(result)
    if result is None:
        return jsonify({"error": "Product not found"}), 404 # not found
    product = result
    try:
        
        return product_schema.jsonify(product)
    except ValidationError as err:
        return jsonify(err.messages), 400 # Bad request
# get product by name
@app.route("/products/by-name", methods=["GET"])
def get_product_by_name():
    name = request.args.get("name")
    search = f"%{name}%" #% is a wildcard
    # use % with LIKE to find partial matches
    query = select(Product).where(Product.name.like(search)).order_by(Product.price.asc())

    products = db.session.execute(query).scalars().all()
    print(products)

    return product_schema.jsonify(products)
#updating a product by its ID
@app.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    with Session(db.engine) as session:
        with session.begin():
            query = select(Product).filter(Product.product_id == product_id)
            result = session.execute(query).scalar() # the same as scalars().first() - first result in the scalars object
            print(result)            
            
            if result is None:
                return jsonify({"error": "Product not found!"}), 404
            product = result
            try:
                #validate input
                product_data = product_schema.load(request.json)
            except ValidationError as err:
                #if we get an error let them know
                return jsonify(err.messages), 400
            #now we can actually update the values
            for field, value in product_data.items():
                setattr(product, field, value)

            session.commit()
            return jsonify({"message": "Product details succesfully updated!"}), 200 #200 as we have successfully updated
 # deleting a product by its ID       
@app.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    delete_statement = delete(Product).where(Product.product_id==product_id)
    with db.session.begin():
        result = db.session.execute(delete_statement)
        if result.rowcount == 0:
            return jsonify({"error" "Product not found"}), 404
        
        return jsonify({"message": "Product successfully deleted!"}), 200
#---------------------------------------------------------------------------------------------------------------------------------------------------------order scheme and routes   ---------------------------------    
class OrderSchema(ma.Schema):
    order_id = fields.Integer(required=False)
    customer_id = fields.Integer(required=True)
    date = fields.Date(required=True)
    products = fields.List(fields.Nested(ProductSchema))
    status = fields.Boolean()

    class Meta:
        fields = ("order_id", "customer_id", "date", "products", "status")
# instantiating our Schemas
order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)

# creating an order
@app.route("/orders", methods=["POST"])
def add_order():
    try:
        json_order = request.json
        products = json_order.pop('products', [])
        if not products:
            return jsonify({"Error": "Cannot place an order without products"}), 400

        # Validate the order data excluding products
        order_data = order_schema.load(json_order)
    except ValidationError as err:
        # If there's a validation error, return a 400 response with error messages
        return jsonify(err.messages), 400

    # Create a new session
    with Session(db.engine) as session:
        with session.begin():
            # Create a new order instance
            new_order = Order(customer_id=order_data['customer_id'], date=order_data['date'])

            # Populate order products using product IDs passed in via JSON
            for id in products:
                product = session.execute(select(Product).filter(Product.product_id == id)).scalar()
                if product:
                    new_order.products.append(product)
                else:
                    return jsonify({"Error": f"Product with ID {id} not found"}), 404
            
            # Add and commit the new order
            session.add(new_order)
            session.commit()
            print("new order made")

    # Return a success message with a 201 status code
    return jsonify({"message": "New order successfully added!"}), 201


#get all orders
@app.route("/orders", methods=["GET"])
def get_orders():
    query = select(Order)
    result = db.session.execute(query).scalars()
    products = result.all()
    return orders_schema.jsonify(products)
#get order by id
@app.route("/orders/<int:order_id>", methods=["GET"])
def get_orders_by_id(order_id):
    query = select(Order).filter(Order.order_id==order_id)
    result = db.session.execute(query).scalars()
    if result is None:
            return jsonify({"message": "Order Not Found"}), 404
    order = result.all()
    try:
        return orders_schema.jsonify(order)
    except ValidationError as err:
            #if we error let them know
            return jsonify(err.messages), 400

# update an order by its ID
@app.route('/orders/<int:order_id>', methods=["PUT"])
def update_order(order_id):
    try:
        json_order = request.json
        products = json_order.pop('products', None)

# Validate the order data excluding products
        order_data = order_schema.load(json_order, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 400

    with Session(db.engine) as session:
        with session.begin():
            query = select(Order).filter(Order.order_id == order_id)
            result = session.execute(query).scalar()
            if result is None:
                return jsonify({"message": "Order Not Found"}), 404

            order = result

            for field, value in order_data.items():
                setattr(order, field, value)

# If products are provided, update the products associated with the order
            if products is not None:
                order.products.clear()
                for id in products:
                    product = session.execute(select(Product).filter(Product.product_id == id)).scalar()
                    if product:
                        order.products.append(product)
                    else:
                        return jsonify({"Error": f"Product with ID {id} not found"}), 404

            session.commit()

    return jsonify({"message": "Order was successfully updated!"}), 200
#Delete an order by its ID
@app.route("/orders/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    delete_statement = delete(Order).where(Order.order_id==order_id)
    with db.session.begin():
        result = db.session.execute(delete_statement)
        if result.rowcount == 0:
            return jsonify({"error": "Order not found" }), 404
        return jsonify({"message": "Order removed successfully"}), 200






    

    










@app.route("/")
def home():
    return "<h1>This a tasty api (ヘ･_･)ヘ┳━┳  (╯°□°）╯︵ ┻━┻</h1>"



if __name__ == "__main__": #check that the file we're in is the file thats being run
    app.run(host="0.0.0.0", port=5001 ,debug=True) #if so we run our application and turn on the debugger



