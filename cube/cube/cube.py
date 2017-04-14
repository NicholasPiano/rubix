# all the imports
import os
from os.path import join
import sqlite3
from flask import Flask, request, session, g, url_for, abort, render_template, flash, jsonify, send_from_directory

app = Flask(__name__) # create the application instance
app.config.from_object(__name__) # load config from this file, cube.py

# Load default config and override config from an environment variable
app.config.update({
	'DATABASE': join(app.root_path, 'db.sqlite3'),
	'SECRET_KEY': 'dev',
	'USERNAME': 'admin',
	'PASSWORD': 'default',
})
app.config.from_envvar('CUBE_SETTINGS', silent=True)

def connect_db():
	rv = sqlite3.connect(app.config['DATABASE'])
	rv.row_factory = sqlite3.Row
	return rv

def get_db():
	"""
	Opens a new database connection if there is none yet for the current application context.
	"""
	if not hasattr(g, 'sqlite_db'):
		g.sqlite_db = connect_db()
	return g.sqlite_db

@app.teardown_appcontext
def close_db(error):
	"""Closes the database again at the end of the request."""
	if hasattr(g, 'sqlite_db'):
		g.sqlite_db.close()

def init_db():
	db = get_db()
	with app.open_resource('schema.sql', mode='r') as f:
		db.cursor().executescript(f.read())
		db.commit()

@app.cli.command('initdb')
def initdb_command():
	"""Initializes the database."""
	init_db()
	print('Initialized the database.')

@app.route('/')
def show():
	db = get_db()
	current = db.execute('select id, name from cubes order by id desc')
	cubes = current.fetchall()
	return render_template('cubes.html', cubes=cubes)
