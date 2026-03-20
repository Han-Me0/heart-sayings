# from flask import Blueprint, render_template
# from flask import render_template
# from .repository import get_all_ideoms

# bp = Blueprint('main', __name__)

# # Home page
# @bp.route('/heart-sayings', methods = ['GET']) 
# def index():
#     data = get_all_ideoms()
#     return render_template("index.html", result=data)

# # Project page
# @bp.route('/heart-sayings/project') 
# def project():
#     return render_template("project.html")

# # Help page
# @bp.route('/heart-sayings/help') 
# def help():
#     return render_template("help.html")

# ------------------------------------------------------------------

from flask import Blueprint, render_template, jsonify
from .repository import get_all_ideoms

bp = Blueprint('main', __name__)

# Health check route for AWS Load Balancer
@bp.route('/health', methods=['GET'])
def health():
    """
    Simple health check endpoint for AWS ALB.
    Returns 200 OK if the service is running.
    """
    return jsonify({"status": "ok"}), 200


# Home page
@bp.route('/heart-sayings', methods=['GET'])
def index():
    data = get_all_ideoms()
    return render_template("index.html", result=data)


# Project page
@bp.route('/heart-sayings/project')
def project():
    return render_template("project.html")


# Help page
@bp.route('/heart-sayings/help')
def help():
    return render_template("help.html")
