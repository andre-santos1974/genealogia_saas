from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.models.organizacao import Organizacao
from app.models.usuario_admin_saas import UsuarioAdminSaaS
from app.schemas.token import Token, TokenPayload

router = APIRouter()


@router.post("/login/admin", response_model=Token)
def login_admin(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """Endpoint para autenticação de administradores do SaaS."""
    # Buscar usuário pelo email
    usuario = db.query(UsuarioAdminSaaS).filter(UsuarioAdminSaaS.email == form_data.username).first()
    
    # Verificar se o usuário existe e se a senha está correta
    if not usuario or not verify_password(form_data.password, usuario.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Criar token de acesso
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(usuario.id),
        "email": usuario.email,
        "tipo": "admin",
        "permissoes": usuario.permissoes
    }
    
    return {
        "access_token": create_access_token(
            payload, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/login/organizacao", response_model=Token)
def login_organizacao(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """Endpoint para autenticação de organizações."""
    # Buscar organização pelo email
    organizacao = db.query(Organizacao).filter(Organizacao.email == form_data.username).first()
    
    # Verificar se a organização existe e se a senha está correta
    # Nota: Nesta implementação inicial, estamos usando a senha diretamente para simplificar
    # Em uma implementação real, seria necessário adicionar um campo de senha hash à tabela de organizações
    # e implementar a verificação adequada
    if not organizacao or form_data.password != "senha_temporaria":  # Implementação simplificada
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verificar se a assinatura está ativa
    if not organizacao.assinatura_ativa:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Assinatura inativa. Por favor, renove sua assinatura para continuar.",
        )
    
    # Criar token de acesso
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(organizacao.id),
        "email": organizacao.email,
        "tipo": "organizacao",
        "plano_id": organizacao.plano_assinatura_id
    }
    
    return {
        "access_token": create_access_token(
            payload, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }