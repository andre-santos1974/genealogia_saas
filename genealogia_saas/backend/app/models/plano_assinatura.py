from sqlalchemy import Column, String, Integer, Numeric, Text, JSON
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class PlanoAssinatura(Base):
    """Modelo para representar um plano de assinatura no sistema."""
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, unique=True, nullable=False, index=True)
    preco = Column(Numeric(10, 2), nullable=False)
    limite_animais = Column(Integer, nullable=False)
    descricao = Column(Text, nullable=True)
    funcionalidades = Column(JSON, nullable=True)
    
    # Relacionamentos
    organizacoes = relationship("Organizacao", back_populates="plano_assinatura")
    
    def __repr__(self):
        return f"<PlanoAssinatura(id={self.id}, nome='{self.nome}', preco={self.preco})>"
    
    @property
    def preco_formatado(self) -> str:
        """Retorna o preço formatado como moeda."""
        return f"R$ {self.preco:.2f}"
    
    def permite_mais_animais(self, quantidade_atual: int) -> bool:
        """Verifica se o plano permite adicionar mais animais."""
        return quantidade_atual < self.limite_animais