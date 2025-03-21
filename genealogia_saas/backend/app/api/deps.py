from typing import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.organizacao import Organizacao
from app.models.usuario_admin_saas import UsuarioAdminSaaS
from app.schemas.token import TokenPayload

# Configuração do OAuth2 para autenticação via token
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login/admin",
    scheme_name="JWT"
)

# Configuração do OAuth2 para autenticação de organizações
oauth2_scheme_organizacao = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login/organizacao",
    scheme_name="JWT"
)


def get_db() -> Generator:
    """Dependência para obter uma sessão do banco de dados."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user_admin(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> UsuarioAdminSaaS:
    """Obtém o usuário administrador atual a partir do token JWT."""
    try:
        # Decodificar o token JWT
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = TokenPayload(**payload)
        
        # Verificar se o token é de um administrador
        if payload.get("tipo") != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Não autorizado. Acesso apenas para administradores.",
            )
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Não foi possível validar as credenciais",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Buscar o usuário no banco de dados
    user = db.query(UsuarioAdminSaaS).filter(UsuarioAdminSaaS.id == int(token_data.sub)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado",
        )
    return user


def get_current_organizacao(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme_organizacao)
) -> Organizacao:
    """Obtém a organização atual a partir do token JWT."""
    try:
        # Decodificar o token JWT
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = TokenPayload(**payload)
        
        # Verificar se o token é de uma organização
        if payload.get("tipo") != "organizacao":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Não autorizado. Acesso apenas para organizações.",
            )
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Não foi possível validar as credenciais",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Buscar a organização no banco de dados
    organizacao = db.query(Organizacao).filter(Organizacao.id == int(token_data.sub)).first()
    if not organizacao:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organização não encontrada",
        )
    
    # Verificar se a assinatura está ativa
    if not organizacao.assinatura_ativa:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Assinatura inativa. Por favor, renove sua assinatura para continuar.",
        )
    
    return organizacao