import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app
)
from werkzeug.security import check_password_hash, generate_password_hash

from resort.db import execute, query_all, query_one


bp = Blueprint('auth', __name__, url_prefix='/auth')



@bp.route('/register', methods=('GET', 'POST'))
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        phoneno = request.form['phoneno']
        password = request.form['password']
        cpassword = request.form['cpassword']
        error = None

        if not username:
            error = 'Username is required.'
        elif not email:
            error = 'Email is required.'
        elif not password:
            error = 'Password is required.'
        elif query_one(
            'SELECT id FROM users WHERE email = %s', (email,)
        ) is not None:
            error = f"Email {email} is already registered."
        elif password != cpassword:
            error = "Passwords do not match."

        if error is None:
            execute(
                'INSERT INTO users (username, password, email, phoneno) VALUES (%s, %s, %s, %s)',
                (username, generate_password_hash(password), email, phoneno)
            )
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('home.index'))

        flash(error, 'error')

    return render_template('auth/register.html')


@bp.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        error = None
        user = query_one(
            'SELECT * FROM users WHERE email = %s', (email,)
        )
        if user is None:
            flash('Account with that email does not exist.', 'error')
            return redirect(url_for('auth.register'))
        
        elif not check_password_hash(user['password'], password):
            flash('Incorrect password.', 'error')
            return redirect(url_for('home.index'))

        if error is None:
            session.clear()
            session['user_id'] = user['id']
            if user['admin']:
                flash('Welcome Admin', 'success')
                return redirect(url_for('admin.dashboard'))
            else:
                flash('Login successful!', 'success')
                return redirect(url_for('home.index'))


@bp.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'success')
    return redirect(url_for('home.index'))


@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = query_one(
            'SELECT * FROM users WHERE id = %s', (user_id,)
        )


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('home.index'))
        return view(**kwargs)
    
    return wrapped_view

# another decorator but check if user is admin and then allows, in table there is a column 'admin' which is boolean
def admin_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None or not g.user['admin']:
            return redirect(url_for('home.index'))
        return view(**kwargs)
    
    return wrapped_view