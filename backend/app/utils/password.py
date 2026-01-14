from passlib.context import CryptContext

# 密码加密上下文（兼容 bcrypt 5.x）
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    """生成密码哈希"""
    # bcrypt 限制密码长度不超过 72 字节
    if len(password.encode('utf-8')) > 72:
        raise ValueError("密码长度不能超过 72 字节")
    return pwd_context.hash(password)
