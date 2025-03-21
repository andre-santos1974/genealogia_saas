from datetime import date
from typing import Optional

from sqlalchemy import Column, String, Date, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Organizacao(Base):
    """Modelo para representar uma organização no sistema."""
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    cnpj = Column(String, unique=True, nullable=True)
    plano_assinatura_id = Column(Integer, ForeignKey("planoassinatura.id"))
    data_assinatura = Column(Date, nullable=True)
    status_assinatura = Column(String, nullable=False, default="Pendente")
    
    # Relacionamentos
    plano_assinatura = relationship("PlanoAssinatura", back_populates="organizacoes")
    animais = relationship("Animal", back_populates="organizacao")
    
    def __repr__(self):
        return f"<Organizacao(id={self.id}, nome='{self.nome}', email='{self.email}')>"
    
    @property
    def assinatura_ativa(self) -> bool:
        """Verifica se a assinatura da organização está ativa."""
        return self.status_assinatura == "Ativa"
    
    @property
    def dias_desde_assinatura(self) -> Optional[int]:
        """Calcula o número de dias desde a assinatura."""
        if not self.data_assinatura:
            return None
        delta = date.today() - self.data_assinatura
        return delta.days