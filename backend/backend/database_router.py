# database_router.py
class AuthRouter:
    """
    A router to control all database operations on models in the
    auth application.
    """
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'src' or model._meta.app_label == 'home':
            return 'default'  # Use SQLite for auth-related tables
        return 'sqlite'

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'src' or model._meta.app_label == 'home':
            return 'default'
        return 'sqlite'

    def allow_relation(self, obj1, obj2, **hints):
        return True  # Allow all relations

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'src' or app_label == 'home':
            return db == 'default'  # Migrate auth tables only on SQLite
        return db == 'sqlite'    # Other apps use PostgreSQL