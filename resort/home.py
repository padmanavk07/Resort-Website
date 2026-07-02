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

@bp.route('/about')
def about():
    return render_template("about.html", user=g.user)

@bp.route('/gallery')
def gallery():
    return render_template("image.html", user=g.user)

@bp.route('/reviews', methods=['GET', 'POST'])
def reviews():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        location = request.form.get('location')
        rating = request.form.get('rating')
        feedback = request.form.get('feedback')
        # print(f"Received review from {name} ({email}) in {location} with rating {rating}: {feedback}")
        execute('INSERT INTO reviews (name, email, location, rating, feedback) VALUES (%s, %s, %s, %s, %s)', (name, email, location, rating, feedback))
        flash('Thank you for your review!', 'success')
    
    reviews = query_all('SELECT * FROM reviews ORDER BY id DESC')
    return render_template("reviews.html", user=g.user, reviews=reviews)

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

        execute('INSERT INTO applications (fname, lname, email, phone, position, exp, cletter, resume) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)',
                (fname, lname, email, phone, position, exp, cletter, resume_url))
        flash('Application submitted successfully!', 'success')
    return render_template("joinfam.html")


@bp.route('/booking', methods=['GET', 'POST'])
@login_required
def booking():
    ubookings = query_all(f'SELECT bid, type, payamt, startdate, enddate FROM bookings WHERE id={g.user['id']}')

    if request.method == 'POST':
        typeroom = request.form.get('typeroom')
        totalcost = int(float(request.form.get('totalcost')))
        checkindate = request.form.get('checkindate')
        checkoutdate = request.form.get('checkoutdate')
        specialrequests = request.form.get('specialrequests')
        execute('INSERT INTO bookings (id, name, type, payamt, startdate, enddate, specialrequests) VALUES (%s, %s, %s, %s, %s, %s, %s)',
                (g.user['id'], g.user['username'], typeroom, totalcost, checkindate, checkoutdate, specialrequests))
        flash('Booking successful!', 'success')

    return render_template("booking.html", user=g.user, ubookings=ubookings)