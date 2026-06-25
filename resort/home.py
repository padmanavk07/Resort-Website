from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, current_app
)
from werkzeug.exceptions import abort

from resort.auth import login_required
from resort.db import query_all, query_one, execute
from resort.supabase_client import upload_resume


bp = Blueprint('home', __name__)


@bp.route('/')
def index():
    return render_template("index.html", user=g.user)


@bp.route('/services')
def services():
    return render_template("services.html", user=g.user)

@bp.route('/profile')
@login_required
def profile():
    user_id = g.user['id']
    user = query_one('SELECT * FROM users WHERE id = %s', (user_id,))
    if user is None:
        abort(404, "User not found.")
    return render_template("profile.html", user=g.user)

@bp.route('/join', methods=['GET', 'POST'])
def join():
    if request.method == 'POST':
        # Handle form submission here
        fname = request.form.get('fname')
        lname = request.form.get('lname')
        email = request.form.get('email')
        phone = request.form.get('phone')
        position = request.form.get('position')
        exp = request.form.get('exp')
        cletter = request.form.get('cletter')
        resume = request.files['resume']
        resume_url = upload_resume(resume)
        print(f"Resume URL: {resume_url}")  # Debugging line to check the resume URL

        execute('INSERT INTO applications (fname, lname, email, phone, position, exp, cletter, resume) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)',
                (fname, lname, email, phone, position, exp, cletter, resume_url))
    return render_template("joinfam.html")