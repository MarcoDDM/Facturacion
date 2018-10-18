const setup = require('../scripts/setupDB.js');

function clearTestDB(done) {
  this.timeout(5000);
  setup().then(() => done()).catch(err => done(err));
}

module.exports = {
  clearTestDB,
};