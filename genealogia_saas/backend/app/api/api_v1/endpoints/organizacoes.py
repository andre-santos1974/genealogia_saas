from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user_admin
from app.models.organizacao import Organizacao
from app.models.plano_assinatura import PlanoAssinatura
from app.schemas.organizacao import OrganizacaoCreate, OrganizacaoUpdate, OrganizacaoResponse

router = APIRouter()


@router.get("/", response_model=List[OrganizacaoResponse])
def listar_organizacoes(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    admin = Depends(get_current_user_admin)
) -> Any:
    """Lista todas as organizações cadastradas."""
    organizacoes = db.query(Organizacao).offset(skip).limit(limit).all()
    return organizacoes


@router.post("/", response_model=OrganizacaoResponse, status_code=status.HTTP_201_CREATED)
def criar_organizacao(
    *,
    db: Session = Depends(get_db),
    organizacao_in: OrganizacaoCreate,
    admin = Depends(get_current_user_admin)
) -> Any:
    """Cria uma nova organização."""
    # Verificar se já existe uma organização com o mesmo email
    organizacao_existente = db.query(Organizacao).filter(Organizacao.email == organizacao_in.email).first()
    if organizacao_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe uma organização cadastrada com este email."
        )
    
    # Verificar se já existe uma organização com o mesmo CNPJ (se fornecido)
    if organizacao_in.cnpj:
        organizacao_existente = db.query(Organizacao).filter(Organizacao.cnpj == organizacao_in.cnpj).first()
        if organizacao_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Já existe uma organização cadastrada com este CNPJ."
            )
    
    # Verificar se o plano de assinatura existe
    plano = db.query(PlanoAssinatura).filter(PlanoAssinatura.id == organizacao_in.plano_assinatura_id).first()
    if not plano:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plano de assinatura não encontrado."
        )
    
    # Criar a organização
    organizacao = Organizacao(
        nome=organizacao_in.nome,
        email=organizacao_in.email,
        cnpj=organizacao_in.cnpj,
        plano_assinatura_id=organizacao_in.plano_assinatura_id,
        data_assinatura=organizacao_in.data_assinatura,
        status_assinatura=organizacao_in.status_assinatura
    )
    
    db.add(organizacao)
    db.commit()
    db.refresh(organizacao)
    
    return organizacao


@router.get("/{organizacao_id}", response_model=OrganizacaoResponse)
def obter_organizacao(
    organizacao_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_current_user_admin)
) -> Any:
    """Obtém uma organização pelo ID."""
    organizacao = db.query(Organizacao).filter(Organizacao.id == organizacao_id).first()
    if not organizacao:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organização não encontrada."
        )
    
    return organizacao


@router.put("/{organizacao_id}", response_model=OrganizacaoResponse)
def atualizar_organizacao(
    *,
    db: Session = Depends(get_db),
    organizacao_id: int,
    organizacao_in: OrganizacaoUpdate,
    admin = Depends(get_current_user_admin)
) -> Any:
    """Atualiza uma organização existente."""
    organizacao = db.query(Organizacao).filter(Organizacao.id == organizacao_id).first()
    if not organizacao:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organização não encontrada."
        )
    
    # Verificar se o email já está em uso por outra organização
    if organizacao_in.email and organizacao_in.email != organizacao.email:
        organizacao_existente = db.query(Organizacao).filter(Organizacao.email == organizacao_in.email).first()
        if organizacao_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este email já está em uso por outra organização."
            )
    
    # Verificar se o CNPJ já está em uso por outra organização
    if organizacao_in.cnpj and organizacao_in.cnpj != organizacao.cnpj:
        organizacao_existente = db.query(Organizacao).filter(Organizacao.cnpj == organizacao_in.cnpj).first()
        if organizacao_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este CNPJ já está em uso por outra organização."
            )
    
    # Verificar se o plano de assinatura existe
    if organizacao_in.plano_assinatura_id and organizacao_in.plano_assinatura_id != organizacao.plano_assinatura_id:
        plano = db.query(PlanoAssinatura).filter(PlanoAssinatura.id == organizacao_in.plano_assinatura_id).first()
        if not plano:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plano de assinatura não encontrado."
            )
    
    # Atualizar os campos da organização
    update_data = organizacao_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(organizacao, field, value)
    
    db.add(organizacao)
    db.commit()
    db.refresh(organizacao)
    
    return organizacao


@router.delete("/{organizacao_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_organizacao(
    *,
    db: Session = Depends(get_db),
    organizacao_id: int,
    admin = Depends(get_current_user_admin)
) -> Any:
    """Exclui uma organização."""
    organizacao = db.query(Organizacao).filter(Organizacao.id == organizacao_id).first()
    if not organizacao:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organização não encontrada."
        )
    
    # Excluir a organização
    db.delete(organizacao)
    db.commit()
    
    return None