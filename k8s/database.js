db = db.getSiblingDB('admin');
db.auth('admin', 'password');

db = db.getSiblingDB('f4_db');
db.createUser({
	user: 'f4_user',
	pwd: 'f4_password',
	roles: [
		{
			role: 'readWrite',
			db: 'f4_db',
		},
	],
});

db.createCollection('users');
db.createCollection('posts');
