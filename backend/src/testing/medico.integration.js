const api = require('../../../frontend/src/api.js');
const server = require('../server.js');
const setup = require('../scripts/setupDB.js');

describe('/medico/ endpoints', () => {
  beforeAll(setup);
  afterAll(server.destroy);

  describe('/medico/new', () => {
    it('retorna 200 al ingresar datos correctos', () =>
      api
        .insertarMedico(
          'Dr. Juan Coronel',
          'Avenida Leopoldo Carrera Calvo 493',
          'jcoronel23@yahoo.com.ec',
          '20',
          '2448272',
          '2885685'
        )
        .then(res => {
          expect(res.status).toBe(200);
        }));

    it('retorna 500 al ingresar medico con un nombre ya existente', async () => {
      const res = await api.insertarMedico(
        'Dra. Olga Saldarreaga',
        'Via a Samborondon km. 7.5 Urbanizacion Tornasol mz. 5 villa 20',
        'olga@outlook.com',
        10,
        '2854345',
        '28654768'
      );

      expect(res.status).toBe(200);
      return api
        .insertarMedico(
          'Dra. Olga Saldarreaga',
          'Via a Samborondon km. 7.5 Urbanizacion Tornasol mz. 5 villa 20',
          'olga@outlook.com',
          10,
          '2854345',
          '28654768'
        )
        .then(
          () => Promise.reject('expected to fail'),
          ({ response: res }) => {
            expect(res.status).toBe(422);
            expect(res.body.code).toEqual('SQLITE_CONSTRAINT');
          }
        );
    });
  });

  describe('/medico/find', () => {
    it('retorna 200 al encontrar medicos', async () => {
      const res1 = await api.insertarMedico(
        'Dr. Julio Plaza',
        'Via a Samborondon km. 7.5 Urbanizacion Tornasol mz. 5 villa 20',
        'jplaza@outlook.com',
        10,
        '2854345',
        '28654768'
      );
      expect(res1.status).toBe(200);

      const res2 = await api.findMedicos('pla');
      expect(res2.status).toBe(200);

      const clientes = res2.body;
      expect(clientes).toHaveLength(1);
      expect(clientes[0].nombre).toEqual('Dr. Julio Plaza');
    });

    it('retorna 404 si no encuentra medicos', () =>
      api.findMedicos('xyz').then(
        () => Promise.reject(new Error('Expected to fail')),
        ({ response: res }) => {
          expect(res.status).toBe(404);
          expect(res.text).toEqual(expect.any(String));
        }
      ));
  });
});
