const convict = require('convict');

export const config = convict({
  // shared config
  stage: {
    doc: 'The stage being deployed',
    format: String,
    default: '',
    env: 'STAGE',
  },
  // stateful config
  tableName: {
    doc: 'The database table where we store items',
    format: String,
    default: '',
    env: 'TABLE_NAME',
  },
}).validate({ allowed: 'strict' });
