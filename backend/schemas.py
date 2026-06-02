import re
from datetime import datetime
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from decimal import Decimal

# Custom regex for email validation
EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

# ----------------- PRODUCT SCHEMAS -----------------
class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Product Name")
    sku: str = Field(..., min_length=1, max_length=100, description="Unique SKU Code")
    price: Decimal = Field(..., description="Unit Price")
    quantity: int = Field(..., description="Stock Quantity")

    @field_validator("sku")
    @classmethod
    def validate_sku(cls, v: str) -> str:
        v = v.strip().upper()
        if not v:
            raise ValueError("SKU cannot be empty or blank")
        return v

    @field_validator("price")
    @classmethod
    def validate_price(cls, v: Decimal) -> Decimal:
        if v < 0:
            raise ValueError("Price must be greater than or equal to 0.00")
        return round(v, 2)

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Quantity cannot be negative")
        return v


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    sku: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[Decimal] = None
    quantity: Optional[int] = None

    @field_validator("sku")
    @classmethod
    def validate_sku(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip().upper()
            if not v:
                raise ValueError("SKU cannot be empty")
            return v
        return v

    @field_validator("price")
    @classmethod
    def validate_price(cls, v: Optional[Decimal]) -> Optional[Decimal]:
        if v is not None:
            if v < 0:
                raise ValueError("Price must be greater than or equal to 0.00")
            return round(v, 2)
        return v

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v: Optional[int]) -> Optional[int]:
        if v is not None:
            if v < 0:
                raise ValueError("Quantity cannot be negative")
            return v
        return v


class ProductResponse(ProductBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ----------------- CUSTOMER SCHEMAS -----------------
class CustomerBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Full Name")
    email: str = Field(..., description="Email Address")
    phone: str = Field(..., description="Phone Number")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not re.match(EMAIL_REGEX, v):
            raise ValueError("Invalid email address format")
        if not v.endswith(".com"):
            raise ValueError("Only .com emails are allowed")
        return v

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be empty")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = re.sub(r"\D", "", v.strip())
        if len(v) != 10:
            raise ValueError("Phone number must be exactly 10 digits")
        return v


class CustomerCreate(CustomerBase):
    pass


class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ----------------- ORDER SCHEMAS -----------------
class OrderItemCreate(BaseModel):
    product_id: int = Field(..., description="ID of the Product")
    quantity: int = Field(..., description="Quantity ordered")

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("Ordered quantity must be greater than 0")
        return v


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_sku: str
    quantity: int
    price_at_purchase: Decimal

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    customer_id: int = Field(..., description="Customer ID placing the order")
    items: List[OrderItemCreate] = Field(..., description="List of items in the order")

    @field_validator("items")
    @classmethod
    def validate_items(cls, v: List[OrderItemCreate]) -> List[OrderItemCreate]:
        if not v:
            raise ValueError("An order must contain at least one item")
        return v


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    customer_name: str
    total_amount: Decimal
    created_at: datetime
    items: List[OrderItemResponse]

    model_config = {"from_attributes": True}


# ----------------- DASHBOARD STATS SCHEMA -----------------
class DashboardStatsResponse(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    low_stock_count: int
    low_stock_products: List[ProductResponse]
