from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.plano_assinatura import PlanoAssinatura
from app.models.usuario_admin_saas import UsuarioAdminSaaS
from app.core.security import get_password_hash


def init_db(db: Session) -> None:
    """Inicializa o banco de dados com dados iniciais."""
    # Criar planos de assinatura padrão se não existirem
    criar_planos_padrao(db)
    
    # Criar usuário admin padrão se não existir
    criar_usuario_admin_padrao(db)


def criar_planos_padrao(db: Session) -> None:
    """Cria os planos de assinatura padrão se não existirem."""
    # Verificar se já existem planos cadastrados
    planos_existentes = db.query(PlanoAssinatura).count()
    if planos_existentes > 0:
        return
    
    # Definir planos padrão
    planos = [
        PlanoAssinatura(
            nome="Bronze",
            preco=99.90,
            limite_animais=50,
            descricao="Plano básico para pequenas organizações",
            funcionalidades=["Cadastro de animais", "Visualização básica de genealogia"]
        ),
        PlanoAssinatura(
            nome="Prata",
            preco=199.90,
            limite_animais=200,
            descricao="Plano intermediário para organizações médias",
            funcionalidades=["Cadastro de animais", "Visualização avançada de genealogia", "Exportação de relatórios"]
        ),
        PlanoAssinatura(
            nome="Ouro",
            preco=399.90,
            limite_animais=500,
            descricao="Plano completo para grandes organizações",
            funcionalidades=["Cadastro de animais", "Visualização avançada de genealogia", "Exportação de relatórios", "API de integração", "Suporte prioritário"]
        ),
    ]
    
    # Adicionar planos ao banco de dados
    for plano in planos:
        db.add(plano)
    
    db.commit()


def criar_usuario_admin_padrao(db: Session) -> None:
    """Cria um usuário administrador padrão se não existir."""
    # Verificar se já existe um admin cadastrado
    admin_existente = db.query(UsuarioAdminSaaS).filter(UsuarioAdminSaaS.email == "admin@genealogiasaas.com").first()
    if admin_existente:
        return
    
    # Criar usuário admin padrão
    admin = UsuarioAdminSaaS(
        nome="Administrador",
        email="admin@genealogiasaas.com",
        senha_hash=get_password_hash("admin123"),  # Senha temporária que deve ser alterada após o primeiro login
        permissoes=["admin", "gerenciar_organizacoes", "gerenciar_planos", "gerenciar_usuarios"]
    )
    
    db.add(admin)
    db.commit()