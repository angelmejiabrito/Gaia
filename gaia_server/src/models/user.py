from marshmallow import Schema, fields, validates, ValidationError
from src.models.devices import DeviceSchema


class UserSchema(Schema):
    full_name = fields.String(required=False)
    identification_number = fields.String(required=False)  
    address = fields.String(required=False) 
    phone = fields.String(required=False)  
    email = fields.Email(required=False)

    identity_document = fields.String(required=False)

    bank_account_status = fields.String(allow_none=False)  
    tax_declarations = fields.String(allow_none=False)
    other_financial_documents = fields.String(allow_none=False)  
    
    credentials = fields.String(required=False)
    secret_key = fields.String(required=False) 
    
    identity_document_url = fields.String(required=False)
    bank_account_status_url = fields.String(required=False)
    tax_declarations_url = fields.String(required=False)
    other_financial_documents_url = fields.String(required=False)
    
    devices = fields.List(fields.Nested(DeviceSchema), allow_none=False)
    
    api_key = fields.String(required=False)
    
@validates('email')
def validate_unique_email(self, value):
    # Verificar en tu base de datos si ya existe un usuario con este correo electrónico
    # Puedes adaptar esta lógica según la forma en que estés manejando tu base de datos
    if user_exists_with_email(value):
        raise ValidationError('El correo electrónico ya está en uso. Debe ser único.')
