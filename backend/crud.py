from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from backend import models, schemas
from decimal import Decimal

# ----------------- PRODUCT CRUD -----------------

def get_product(db: Session, product_id: int) -> models.Product:
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    return product

def get_product_by_sku(db: Session, sku: str) -> models.Product | None:
    return db.query(models.Product).filter(models.Product.sku == sku).first()

def get_products(db: Session) -> list[models.Product]:
    return db.query(models.Product).order_by(models.Product.id.asc()).all()

def create_product(db: Session, product: schemas.ProductCreate) -> models.Product:
    # Validate SKU uniqueness
    db_product = get_product_by_sku(db, product.sku)
    if db_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with SKU '{product.sku}' already exists"
        )
    
    db_product = models.Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        quantity=product.quantity
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product_update: schemas.ProductUpdate) -> models.Product:
    db_product = get_product(db, product_id)
    
    # If SKU is changing, validate uniqueness
    if product_update.sku is not None and product_update.sku != db_product.sku:
        existing = get_product_by_sku(db, product_update.sku)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product with SKU '{product_update.sku}' already exists"
            )
            
    # Apply updates
    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
        
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int) -> bool:
    db_product = get_product(db, product_id)
    
    # Check if this product is part of any orders
    ordered_items_count = db.query(models.OrderItem).filter(models.OrderItem.product_id == product_id).count()
    if ordered_items_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete product '{db_product.name}' as it is referenced in {ordered_items_count} order line item(s). Consider updating its stock to 0 instead."
        )
        
    db.delete(db_product)
    db.commit()
    return True


# ----------------- CUSTOMER CRUD -----------------

def get_customer(db: Session, customer_id: int) -> models.Customer:
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {customer_id} not found"
        )
    return customer

def get_customer_by_email(db: Session, email: str) -> models.Customer | None:
    return db.query(models.Customer).filter(models.Customer.email == email).first()

def get_customers(db: Session) -> list[models.Customer]:
    return db.query(models.Customer).order_by(models.Customer.id.asc()).all()

def create_customer(db: Session, customer: schemas.CustomerCreate) -> models.Customer:
    # Validate Email uniqueness
    db_customer = get_customer_by_email(db, customer.email)
    if db_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Customer with email '{customer.email}' already exists"
        )
        
    db_customer = models.Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: int) -> bool:
    db_customer = get_customer(db, customer_id)
    db.delete(db_customer)
    db.commit()
    return True


# ----------------- ORDER CRUD -----------------

def get_order(db: Session, order_id: int) -> schemas.OrderResponse:
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )
        
    # Build clean Response with relations loaded
    items_response = []
    for item in order.items:
        items_response.append(
            schemas.OrderItemResponse(
                id=item.id,
                product_id=item.product_id,
                product_name=item.product.name,
                product_sku=item.product.sku,
                quantity=item.quantity,
                price_at_purchase=item.price_at_purchase
            )
        )
        
    return schemas.OrderResponse(
        id=order.id,
        customer_id=order.customer_id,
        customer_name=order.customer.name,
        total_amount=order.total_amount,
        created_at=order.created_at,
        items=items_response
    )

def get_orders(db: Session) -> list[schemas.OrderResponse]:
    orders = db.query(models.Order).order_by(models.Order.id.desc()).all()
    results = []
    for order in orders:
        items_response = []
        for item in order.items:
            items_response.append(
                schemas.OrderItemResponse(
                    id=item.id,
                    product_id=item.product_id,
                    product_name=item.product.name,
                    product_sku=item.product.sku,
                    quantity=item.quantity,
                    price_at_purchase=item.price_at_purchase
                )
            )
        results.append(
            schemas.OrderResponse(
                id=order.id,
                customer_id=order.customer_id,
                customer_name=order.customer.name,
                total_amount=order.total_amount,
                created_at=order.created_at,
                items=items_response
            )
        )
    return results

def create_order(db: Session, order_in: schemas.OrderCreate) -> schemas.OrderResponse:
    # 1. Verify customer exists
    customer = db.query(models.Customer).filter(models.Customer.id == order_in.customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {order_in.customer_id} not found"
        )
        
    # 2. Check and allocate items (transacted)
    order_items_to_create = []
    total_amount = Decimal("0.00")
    
    # We group incoming items by product_id to handle duplicates in the request properly
    grouped_items = {}
    for item in order_in.items:
        grouped_items[item.product_id] = grouped_items.get(item.product_id, 0) + item.quantity

    for product_id, quantity in grouped_items.items():
        product = db.query(models.Product).filter(models.Product.id == product_id).with_for_update().first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {product_id} not found"
            )
            
        # Check stock sufficiency
        if product.quantity < quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product '{product.name}'. Available: {product.quantity}, Requested: {quantity}"
            )
            
        # Deduct stock
        product.quantity -= quantity
        
        # Calculate pricing
        item_total = product.price * Decimal(str(quantity))
        total_amount += item_total
        
        order_item = models.OrderItem(
            product_id=product.id,
            quantity=quantity,
            price_at_purchase=product.price
        )
        order_items_to_create.append(order_item)
        
    # 3. Create core Order
    db_order = models.Order(
        customer_id=customer.id,
        total_amount=total_amount
    )
    db.add(db_order)
    db.flush()  # Flushes to get db_order.id
    
    # 4. Attach items to order
    for item in order_items_to_create:
        item.order_id = db_order.id
        db.add(item)
        
    # 5. Commit everything safely
    db.commit()
    db.refresh(db_order)
    
    return get_order(db, db_order.id)

def delete_order(db: Session, order_id: int) -> bool:
    order = db.query(models.Order).filter(models.Order.id == order_id).with_for_update().first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )
        
    # Restore stock for each item in the order before deletion
    for item in order.items:
        # Load product with write lock
        product = db.query(models.Product).filter(models.Product.id == item.product_id).with_for_update().first()
        if product:
            product.quantity += item.quantity
            
    # Delete order (Cascade handles deleting line items in database)
    db.delete(order)
    db.commit()
    return True


# ----------------- DASHBOARD STATS -----------------

def get_dashboard_stats(db: Session) -> schemas.DashboardStatsResponse:
    total_products = db.query(models.Product).count()
    total_customers = db.query(models.Customer).count()
    total_orders = db.query(models.Order).count()
    
    # Define "low stock" as less than 10 units
    low_stock_limit = 10
    low_stock_query = db.query(models.Product).filter(models.Product.quantity < low_stock_limit)
    low_stock_count = low_stock_query.count()
    low_stock_products = low_stock_query.order_by(models.Product.quantity.asc()).all()
    
    return schemas.DashboardStatsResponse(
        total_products=total_products,
        total_customers=total_customers,
        total_orders=total_orders,
        low_stock_count=low_stock_count,
        low_stock_products=[schemas.ProductResponse.model_validate(p) for p in low_stock_products]
    )
