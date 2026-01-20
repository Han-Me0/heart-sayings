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

from flask import Blueprint, render_template, jsonify, request, redirect, url_for, session
import os 
from .repository import get_all_ideoms , get_all_concepts, insert_suggestion, get_pending_suggestions, approve_suggestion, reject_suggestion, get_languages

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
    languages = get_languages()
    print("FIRST ROW FROM DB:", data[0])
    return render_template("index.html", result=data, languages = languages)


# Project page
@bp.route('/heart-sayings/project')
def project():
    return render_template("project.html")


# Help page
@bp.route('/heart-sayings/help')
def help():
    return render_template("help.html")

# concepts page
@bp.route('/heart-sayings/concepts', methods=['GET'])
def concepts_overview():
    concepts = get_all_concepts()
    idioms = get_all_ideoms() # includes concept_id + concept_description
    return render_template("concepts.html", concepts=concepts, idioms=idioms)

# User suggestion
@bp.route("/heart-sayings/suggest", methods=["GET","POST"])
def suggest():
    if request.method == "POST":
        language = request.form.get("language", "").strip()
        idiom = request.form.get("idiom", "").strip()
        meaning = request.form.get("meaning", "").strip()
        idiom_translation = request.form.get("idiom_translation", "").strip()
        meaning_translation = request.form.get("meaning_translation", "").strip()

        # Very simple validation
        if not language or not idiom or not meaning:
            # later: we use flash messages; for now just re-render with error
            error = "Language, idiom, and meaning are required."
            return render_template("suggest.html", error=error)
        
        insert_suggestion(language, idiom, meaning, idiom_translation, meaning_translation, None)

        return render_template("suggest_success.html")

    # GET → show form
    return render_template("suggest.html")

@bp.route('/heart-sayings/admin/suggestions', methods=['GET'])
def review_suggestions():
    if not session.get("admin_logged_in"):
        return redirect("/heart-sayings/admin/login")

    suggestions = get_pending_suggestions()
    return render_template("review_suggestions.html", suggestions=suggestions)

@bp.route('/heart-sayings/admin/approve/<int:suggestion_id>')
def approve_suggestion_route(suggestion_id):
    if not session.get("admin_logged_in"):
        return redirect("/heart-sayings/admin/login")

    approve_suggestion(suggestion_id)
    return redirect("/heart-sayings/admin/suggestions")


@bp.route('/heart-sayings/admin/reject/<int:suggestion_id>')
def reject_suggestion_route(suggestion_id):
    if not session.get("admin_logged_in"):
        return redirect("/heart-sayings/admin/login")

    reject_suggestion(suggestion_id)
    return redirect("/heart-sayings/admin/suggestions")

    # Add login + logout routes
@bp.route('/heart-sayings/admin/login', methods=['GET', 'POST'])
def admin_login():
    error = None

    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()

        expected_user = os.getenv("ADMIN_USERNAME", "admin")
        expected_pass = os.getenv("ADMIN_PASSWORD", "admin123")

        if username == expected_user and password == expected_pass:
            session["admin_logged_in"] = True
            return redirect("/heart-sayings/admin/suggestions")
        else:
            error = "Invalid username or password."

    return render_template("admin_login.html", error=error)


@bp.route('/heart-sayings/admin/logout')
def admin_logout():
    session.pop("admin_logged_in", None)
    return redirect("/heart-sayings")
