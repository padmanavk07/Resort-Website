from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, current_app
)
from werkzeug.exceptions import abort

from resort.auth import admin_required
from resort.db import query_all, query_one, execute


bp = Blueprint('courses', __name__, url_prefix='/admin')


@bp.route('/')
@admin_required
def index():
    return render_template("admin/dashboard.html")