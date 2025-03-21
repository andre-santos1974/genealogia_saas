from fastapi import APIRouter

from app.api.api_v1.endpoints import organizacoes, planos_assinatura, usuarios_admin, animais, auth

api_router = APIRouter()

# Incluir rotas para autenticação
api_router.include_router(auth.router, prefix="/auth", tags=["autenticação"])

# Incluir rotas para organizações
api_router.include_router(organizacoes.router, prefix="/organizacoes", tags=["organizações"])

# Incluir rotas para planos de assinatura
api_router.include_router(planos_assinatura.router, prefix="/planos-assinatura", tags=["planos de assinatura"])

# Incluir rotas para usuários administradores
api_router.include_router(usuarios_admin.router, prefix="/usuarios-admin", tags=["usuários administradores"])

# Incluir rotas para animais
api_router.include_router(animais.router, prefix="/animais", tags=["animais"])