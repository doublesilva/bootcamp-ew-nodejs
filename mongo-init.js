db.auth('admin', 'senhaadmin')

db = db.getSiblingDB('heroes')

db.createUser({
  user: 'doublesilva',
  pwd: 'lapro203',
  roles: [
    {
      role: 'readWrite',
      db: 'heroes',
    },
  ],
});