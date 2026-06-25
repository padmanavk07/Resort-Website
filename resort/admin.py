from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, current_app
)
from werkzeug.exceptions import abort

from resort.auth import admin_required
from resort.db import query_all, query_one, execute


bp = Blueprint('admin', __name__, url_prefix='/admin')


@bp.route('/')
@admin_required
def dashboard():
    applicants = query_all('SELECT * FROM applications WHERE accepted IS NULL')
    return render_template("admin/dashboard.html", applicants=applicants)

@bp.route('/applicants/<int:applicant_id>/accept')
@admin_required
def acceptapp(applicant_id):
    execute(f'UPDATE applications SET accepted = TRUE WHERE id = {applicant_id}')
    flash('Applicant accepted successfully!', 'success')
    return redirect(url_for('admin.dashboard'))

@bp.route('/applicants/<int:applicant_id>/reject')
@admin_required
def rejectapp(applicant_id):
    execute(f'UPDATE applications SET accepted = FALSE WHERE id = {applicant_id}')
    flash('Applicant rejected successfully!', 'success')
    return redirect(url_for('admin.dashboard'))