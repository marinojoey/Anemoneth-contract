from .db import db
from sqlalchemy.sql import func
from datetime import datetime


upvote = db.Table(
    "upvote",
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('post_id', db.Integer, db.ForeignKey('posts.id'), primary_key=True)
)

class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    caption = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now())

    user = db.relationship('User', back_populates='posts')
    user_upvotes = db.relationship('User', back_populates='upvote_posts', secondary=upvote)


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'caption': self.caption,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'username': self.user.username
        }
