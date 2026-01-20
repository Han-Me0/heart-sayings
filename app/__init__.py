from flask import Flask, session
from dotenv import load_dotenv, dotenv_values
from .repository import repo
from .routes import bp
import os

def create_app():
    load_dotenv()  # ensure .env is loaded

    app = Flask(__name__)

    # REQUIRED for session to work
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY") or "fallback-dev-secret"

    # MySQL config (keep yours; example below)
    host = os.getenv("MYSQL_HOST")
    if host:
        app.config["MYSQL_HOST"] = host

    port = os.getenv("MYSQL_PORT")
    if port:
        app.config["MYSQL_PORT"] = int(port)

    user = os.getenv("MYSQL_USER")
    if user:
        app.config["MYSQL_USER"] = user

    password = os.getenv("MYSQL_PASSWORD")
    if password is not None:
        app.config["MYSQL_PASSWORD"] = password

    db = os.getenv("MYSQL_DB")
    if db:
        app.config["MYSQL_DB"] = db

    app.config["MYSQL_DATABASE_CHARSET"] = "utf8mb4"
    app.config["MYSQL_CHARSET"] = "utf8mb4"

    # init MySQL extension
    repo.init_app(app)

    # register routes
    app.register_blueprint(bp)

    # Make admin login state available in ALL templates
    @app.context_processor
    def inject_admin_status():
        return {"admin_logged_in": session.get("admin_logged_in", False)}

    return app
