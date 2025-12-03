from flask import Flask
from dotenv import load_dotenv, dotenv_values
from .repository import repo
from .routes import bp
import os

load_dotenv()

def create_app():
    config = dotenv_values("./.env")
    app = Flask(__name__)
    app.config.from_mapping(config)

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

    print(app.config)

    # init MySQL extension
    repo.init_app(app)

    # register routes
    app.register_blueprint(bp)

    return app
