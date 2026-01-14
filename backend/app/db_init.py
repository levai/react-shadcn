#!/usr/bin/env python3
"""数据库初始化脚本"""

import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from app.core.database import Base, engine
from app.models import User
from app.utils.password import get_password_hash
from sqlalchemy.orm import Session
from app.core.database import SessionLocal


def init_db():
    """初始化数据库"""
    # 创建所有表
    Base.metadata.create_all(bind=engine)

    # 创建默认管理员用户（如果不存在）
    db: Session = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            admin_user = User(
                username="admin",
                password_hash=get_password_hash("admin123"),
                name="管理员",
                is_active=True,
            )
            db.add(admin_user)
            db.commit()
            print("✅ 默认管理员用户已创建：")
            print("   用户名: admin")
            print("   密码: admin123")
        else:
            print("ℹ️  管理员用户已存在")
    except Exception as e:
        db.rollback()
        print(f"❌ 初始化失败: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    print("🚀 开始初始化数据库...")
    init_db()
    print("✅ 数据库初始化完成！")
