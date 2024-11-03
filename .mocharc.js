module.exports = {
  require: 'ts-node/register',
  extension: ['ts'],
  spec: 'src/tests/*.spec.ts',
  loader: 'ts-node/esm',  // Usa 'ts-node/esm' si estás en un entorno ESM.
};

