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
from .repository import (get_all_ideoms,
    get_all_concepts,
    insert_suggestion,
    get_pending_suggestions,
    approve_suggestion,
    reject_suggestion,
    get_languages,
    get_concept_id_by_description
)
from .ai_helper import (
    suggest_concept_from_text,
    generate_meaning_with_llm,
    generate_translation_with_llm
)

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

        # text from frontend AI suggestion
        suggested_concept = request.form.get("suggested_concept", "").strip()

        # final DB value 
        concept_id= None

        # AI auto-suggestion if frontend didn't provide one
        if not suggested_concept:
            ai_result = suggest_concept_from_text(idiom, meaning)
            suggested_concept = ai_result["suggested_concept"]

        # convert concept text -> concept.id
        if suggested_concept:
            concept_id = get_concept_id_by_description(suggested_concept)

        # validation
        if not language or not idiom or not meaning:
            error = "Language, idiom, and meaning are required."
            return render_template("suggest.html", error=error)

        insert_suggestion(
            language,
            idiom,
            meaning,
            idiom_translation,
            meaning_translation,
            concept_id   # THIS is the key change for ai assistant
        )

        return render_template("suggest_success.html")

    return render_template("suggest.html")

@bp.route('/heart-sayings/admin/suggestions', methods=['GET'])
def review_suggestions():
    if not session.get("admin_logged_in"):
        return redirect("/heart-sayings/admin/login")

    raw_suggestions = get_pending_suggestions()

    suggestions = []
    for s in raw_suggestions:
        ai = suggest_concept_from_text(s[2], s[3])  # idiom, meaning
        suggestions.append((s, ai))

    return render_template(
        "review_suggestions.html",
        suggestions=suggestions,
        admin_logged_in=session.get("admin_logged_in")
    )

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

@bp.route('/heart-sayings/api/idioms', methods=['GET'])
def api_idioms():
    language = request.args.get('language', '').strip()
    search = request.args.get('search', '').strip().lower()

    data = get_all_ideoms()

    if language:
        data = [
            i for i in data
            if (i.get("language") or "").strip().lower() == language.lower()
        ]

    if search:
        filtered = []
        for i in data:
            fields = [
                i.get("idiom", ""),
                i.get("meaning", ""),
                i.get("idiom_translation", ""),
                i.get("meaning_translation", ""),
                i.get("concept_description", "")
            ]
            if any(isinstance(f, str) and search in f.lower() for f in fields):
                filtered.append(i)
        data = filtered

    return jsonify(data[:10]) # returns first 10 results

@bp.route('/heart-sayings/api/suggest-concept', methods=['POST'])
def api_suggest_concept():
    data = request.get_json(silent=True) or {}

    idiom = (data.get("idiom") or "").strip()
    meaning = (data.get("meaning") or "").strip()

    if not idiom and not meaning:
        return jsonify({
            "success": False,
            "error": "Please provide an idiom or meaning."
        }), 400

    result = suggest_concept_from_text(idiom, meaning)

    return jsonify({
        "success": True,
        "suggested_concept": result["suggested_concept"],
        "confidence": result["confidence"],
        "reason": result["reason"]
    })

@bp.route('/heart-sayings/api/generate-meaning', methods=['POST'])
def api_generate_meaning():
    data = request.get_json(silent=True) or {}

    idiom = (data.get("idiom") or "").strip()
    language = (data.get("language") or "").strip()
    idiom_translation = (data.get("idiom_translation") or "").strip()

    if not idiom:
        return jsonify({
            "success": False,
            "error": "Please provide an idiom."
        }), 400

    result = generate_meaning_with_llm(
        idiom=idiom,
        language=language,
        idiom_translation=idiom_translation
    )

    return jsonify({
        "success": True,
        "source": result["source"],
        "generated_meaning": result["generated_meaning"]
    })

@bp.route('/heart-sayings/api/generate-translation', methods=['POST'])
def api_generate_translation():
    data = request.get_json(silent=True) or {}

    text = (data.get("text") or "").strip()
    target_language = (data.get("target_language") or "English").strip()

    if not text:
        return jsonify({
            "success": False,
            "error": "Please provide text to translate."
        }), 400

    result = generate_translation_with_llm(
        text=text,
        target_language=target_language
    )

    return jsonify({
        "success": True,
        "source": result["source"],
        "generated_translation": result["generated_translation"]
    })

@bp.route('/privacy')
def privacy():
    return render_template("privacy.html")

@bp.route('/terms')
def terms():
    return render_template("terms.html")