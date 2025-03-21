from sqlalchemy import Column, String, Integer, JSON
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class UsuarioAdminSaaS(Base):
    """Modelo para representar um administrador do sistema SaaS."""
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    senha_hash = Column(String, nullable=False)
    permissoes = Column(JSON, nullable=True)
    
    def __repr__(self):
        return f"<UsuarioAdminSaaS(id={self.id}, nome='{self.nome}', email='{self.email}')>"
    
    def tem_permissao(self, permissao: str) -> bool:
        """Verifica se o usuário tem uma permissão específica."""
        if not self.permissoes:
            return False
        return permissao in self.permissoes
    
    def tem_todas_permissoes(self, permissoes: list) -> bool:
        """Verifica se o usuário tem todas as permissões da lista."""
        if not self.permissoes:
            return False
        return all(perm in self.permissoes for perm in permissoes)