from flask import Flask
from dotenv import load_dotenv, dotenv_values
from flask import Flask
from .repository import repo
from .routes import bp
import os

# Loading environment variables
load_dotenv()

def create_app():
    config = dotenv_values("./.env")
    app = Flask(__name__)
    app.config.from_mapping(config)

    # Prioritize env vars over config if set
    app.config["MYSQL_HOST"] = os.getenv("MYSQL_HOST")
    if os.getenv("MYSQL_PORT") != None:
        app.config["MYSQL_PORT"] = int(os.getenv("MYSQL_PORT"))
    app.config["MYSQL_USER"] = os.getenv("MYSQL_USER")
    app.config["MYSQL_PASSWORD"] = os.getenv("MYSQL_PASSWORD")
    app.config["MYSQL_DB"] = os.getenv("MYSQL_DB")
    app.config["MYSQL_DATABASE_CHARSET"] = "utf8mb4"
    app.config["MYSQL_CHARSET"] = "utf8mb4"
    app.config["FLASK_APP"]="ideoms"
    app.config["FLASK_ENV"]="development"
    app.config["FLASK_DEBUG"]="True"

    print(app.config)


    # MySQL initialization from app
    repo.init_app(app)

    # Routing
    app.register_blueprint(routes.bp)

    return app