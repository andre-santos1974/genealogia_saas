from typing import Any, List, Optional

from pydantic import BaseModel


class Token(BaseModel):
    """Esquema para representar um token de acesso."""
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    """Esquema para representar o payload de um token JWT."""
    sub: Optional[str] = None
    email: Optional[str] = None
    tipo: Optional[str] = None  # 'admin' ou 'organizacao'
    permissoes: Optional[List[str]] = None  # apenas para admin
    plano_id: Optional[int] = None  # apenas para organizacao