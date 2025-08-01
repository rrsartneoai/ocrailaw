import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_restx import Api
from flask_cors import CORS # Import CORS
import logging
from logging.handlers import RotatingFileHandler

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
main_api = Api(
    title="Document Analysis API",
    version="1.0",
    description="REST API for Document Analysis Platform",
    doc="/docs"
)

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}}) # Initialize CORS
    app.config.from_object("app.config.Config")

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    main_api.init_app(app)

    from app.api.auth_ns import ns as auth_ns
    from app.api.orders_ns import ns as orders_ns
    from app.api.documents_ns import ns as documents_ns
    from app.api.analyses_ns import ns as analyses_ns
    from app.api.payments_ns import ns as payments_ns

    main_api.add_namespace(auth_ns, path="/api/v1/auth")
    main_api.add_namespace(orders_ns, path="/api/v1/orders")
    main_api.add_namespace(documents_ns, path="/api/v1/documents")
    main_api.add_namespace(analyses_ns, path="/api/v1/analyses")
    main_api.add_namespace(payments_ns, path="/api/v1/payments")

    if not app.debug and not app.testing:
        if not os.path.exists("logs"):
            os.mkdir("logs")
        file_handler = RotatingFileHandler("logs/app.log", maxBytes=10240, backupCount=10)
        file_handler.setFormatter(
            logging.Formatter("%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]")
        )
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info("Document Analysis startup")

    from app.utils.exceptions import register_error_handlers
    register_error_handlers(app)

    return app
