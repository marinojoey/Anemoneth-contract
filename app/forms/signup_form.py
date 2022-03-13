from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError, EqualTo
from app.models import User


def username_exists(form, field):
    # Checking if user exists
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')

def address_exists(form, field):
    # Checking if user exists
    address = field.data
    user = User.query.filter(User.address == address).first()
    if user:
        raise ValidationError('Address is already in use.')


class SignUpForm(FlaskForm):
    username = StringField('username', validators=[DataRequired(), username_exists])
    address = IntegerField('address', validators=[DataRequired(), address_exists])
    password = StringField('password', validators=[DataRequired(), EqualTo('repeatPassword', message='Passwords must match.')])
    repeatPassword = StringField('repeatPassword', validators=[DataRequired()])
