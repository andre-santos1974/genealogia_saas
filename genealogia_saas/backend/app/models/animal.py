from datetime import date
from typing import Optional

from sqlalchemy import Column, String, Date, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Animal(Base):
    """Modelo para representar um animal no sistema."""
    
    id = Column(Integer, primary_key=True, index=True)
    organizacao_id = Column(Integer, ForeignKey("organizacao.id"), nullable=False)
    nome = Column(String, nullable=False, index=True)
    especie = Column(String, nullable=False)
    raca = Column(String, nullable=True)
    data_nascimento = Column(Date, nullable=True)
    sexo = Column(String, nullable=True)
    caracteristicas_fisicas = Column(Text, nullable=True)
    imagem_url = Column(String, nullable=True)
    pai_id = Column(Integer, ForeignKey("animal.id"), nullable=True)
    mae_id = Column(Integer, ForeignKey("animal.id"), nullable=True)
    
    # Relacionamentos
    organizacao = relationship("Organizacao", back_populates="animais")
    pai = relationship("Animal", foreign_keys=[pai_id], remote_side=[id], backref="filhos_pai")
    mae = relationship("Animal", foreign_keys=[mae_id], remote_side=[id], backref="filhos_mae")
    
    def __repr__(self):
        return f"<Animal(id={self.id}, nome='{self.nome}', especie='{self.especie}')>"
    
    @property
    def idade(self) -> Optional[int]:
        """Calcula a idade do animal em anos."""
        if not self.data_nascimento:
            return None
        delta = date.today() - self.data_nascimento
        return delta.days // 365
    
    @property
    def tem_pais(self) -> bool:
        """Verifica se o animal tem pai ou mãe registrados."""
        return self.pai_id is not None or self.mae_id is not None
    
    @property
    def tem_genealogia_completa(self) -> bool:
        """Verifica se o animal tem pai e mãe registrados."""
        return self.pai_id is not None and self.mae_id is not None