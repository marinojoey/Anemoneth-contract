from app.models import db, User


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(username='demo', address=123, password='password')
    joey = User(username='joey', address=1234, password='password')
    savanah = User(username='savanah', address=12345, password='password')

    db.session.add(demo)
    db.session.add(joey)
    db.session.add(savanah)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
