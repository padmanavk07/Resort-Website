from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, current_app
)
from werkzeug.exceptions import abort

from resort.auth import login_required
from resort.db import query_all, query_one, execute


bp = Blueprint('home', __name__)


@bp.route('/')
def index():
    return render_template("index.html")


@bp.route('/services')
def services():
    return render_template("services.html")

@bp.route('/profile')
@login_required
def profile():
    user_id = g.user['id']
    user = query_one('SELECT * FROM users WHERE id = %s', (user_id,))
    if user is None:
        abort(404, "User not found.")
    return render_template("profile.html", user=user)