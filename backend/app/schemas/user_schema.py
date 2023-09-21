from datetime import datetime
import re
from pydantic import BaseModel, validator, EmailStr, Field, root_validator
from typing import Optional


class BasePasswordSchema(BaseModel):
    """
    Pydantic model for validating user passwords.

    Attributes:
        password (str): The password for the user.
    """

    password: str

    @validator("password")
    def validate_password(cls, password) -> str:
        min_length = 8
        if len(password) < min_length:
            raise ValueError(f"Password must be at least {min_length} characters long.")

        pattern = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).+$")
        if not pattern.match(password):
            raise ValueError(
                "Password must have 1 lowercase, 1 uppercase, 1 number, and 1 special character."
            )

        return password

    @validator("confirm_password", check_fields=False)
    def confirm_passwords_match(cls, confirm_password, values) -> str:
        if "password" in values and confirm_password != values["password"]:
            raise ValueError("Passwords do not match.")
        return confirm_password


class UpdatePasswordSchema(BasePasswordSchema):
    """
    Pydantic model for validating user password updates.

    This schema is used when a user wants to update their password.
    It inherits from the `BasePasswordSchema` and adds an additional
    field `current_password` for the purpose of verification.

    Attributes:
        current_password (str): The user's current password. This is used to
                                validate the user's identity before changing the password.
        password (str): The new password the user wishes to set.
        confirm_password (str): Confirmation of the new password.

    Examples:
        >>> password_update = UserUpdatePasswordSchema(current_password="Old_Secure_Password",
        ...                                            password="New_Secure_Password",
        ...                                            confirm_password="New_Secure_Password")
    """

    current_password: str
    email: Optional[str]
    

# class UserCreateSchema(BasePasswordSchema):
#     """
#     Pydantic model for validating user creation data.

#     Attributes:
#         first_name (str): The first name of the user. Must be between 1 and 255 characters.
#         last_name (str): The last name of the user. Must be between 1 and 255 characters.
#         email (EmailStr): The email address of the user. Must be a valid email format.
#         is_premium_user (bool): A flag to identify premium users. Defaults to False.
#     """
#     id: Optional[int] = None
#     first_name: str = Field(..., min_length=1, max_length=255)
#     last_name: str = Field(..., min_length=1, max_length=255)
#     email: EmailStr
#     is_premium_user: bool = Field(default=False)

    
class UserRegistrationSchema(BaseModel):
    id: Optional[int] = None
    first_name: str = Field(..., min_length=1, max_length=255)
    last_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    password: str
    confirm_password: str
    is_premium_user: bool = Field(default=False)

    @validator("confirm_password", pre=True, always=True)
    def validate_passwords_match(cls, confirm_password, values):
        if "password" in values and confirm_password != values["password"]:
            raise ValueError("Passwords do not match")
        return confirm_password


class UserLoginSchema(BaseModel):
    """
    Pydantic model for validating user login data.

    Attributes:
        email (EmailStr): The email address of the user. Must be a valid email format.
        password (str): The password for the user.
    """

    email: EmailStr
    password: str
    
class UserInfoUpdateSchema(BaseModel):
    """
    Pydantic model for validating user information update data.

    Attributes:
        first_name (str): The first name of the user. Must be between 1 and 255 characters.
        last_name (str): The last name of the user. Must be between 1 and 255 characters.
        email (EmailStr): The email address of the user. Must be a valid email format.
    """

    first_name: str = Field(..., min_length=1, max_length=255)
    last_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr


class UserResponseSchema(BaseModel):
    """
    Pydantic model for serializing user data returned by the API.

    Attributes:
        id (int): The unique identifier for the user.
        first_name (str): The first name of the user.
        last_name (str): The last name of the user.
        email (EmailStr): The email address of the user.
        is_premium_user (bool): A flag to identify if the user is a premium user.
        created_at (datetime): The date and time when the user was created.
        updated_at (datetime): The date and time when the user was last updated.

    Examples:
        >>> user = UserResponseSchema(id=42, first_name="Forgotten", last_name="Fish",
        ...                           email="theforgottenfish@thedam.com", is_premium_user=True,
        ...                           created_at=datetime, updated_at=datetime)
    """

    id: int
    first_name: str
    last_name: str
    email: EmailStr 
    is_premium_user: bool
    created_at: datetime
    updated_at: datetime

class UserLogoutSchema(BaseModel):
    """
    Pydantic model for serializing user logout data returned by the API.

    Attributes:
        message (str): A message indicating that the user has been logged out.

    Examples:
        >>> user = UserLogoutSchema(message="User has been logged out.")
    """

    message: str
    

class UserUpdateSchema(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: EmailStr
    current_password: Optional[str]
    password: Optional[str]