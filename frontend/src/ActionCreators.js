const {
  CLIENTE_DIALOG,
  PRODUCTO_DIALOG,
  MEDICO_DIALOG,
} = require('./DialogTypes');
const {
  NEW_FACTURA_PAGE,
  FACTURA_LIST_PAGE,
  CLIENTE_LIST_PAGE,
  PRODUCTO_LIST_PAGE,
  EDITAR_FACTURA_PAGE,
  NEW_FACTURA_EXAMEN_PAGE,
  EDITAR_FACTURA_EXAMEN_PAGE,
} = require('./PageTypes');
const {
  CAMBIAR_DIALOG_ACTION,
  CAMBIAR_PAGE_ACTION,
  CERRAR_DIALOG_CON_MSG_ACTION,
  ABRIR_LINK_CON_SNACKBAR,
  MOSTRAR_ERROR_CON_SNACKBAR,
} = require('./ActionTypes');

const cambiarPagina = (tipoPagina, props) => {
  switch (tipoPagina) {
    case FACTURA_LIST_PAGE:
      return {
        type: CAMBIAR_PAGE_ACTION,
        value: FACTURA_LIST_PAGE,
        props: props,
      };
    case CLIENTE_LIST_PAGE:
      return {
        type: CAMBIAR_PAGE_ACTION,
        value: CLIENTE_LIST_PAGE,
        props: props,
      };
    case PRODUCTO_LIST_PAGE:
      return {
        type: CAMBIAR_PAGE_ACTION,
        value: PRODUCTO_LIST_PAGE,
        props: props,
      };
    case NEW_FACTURA_PAGE:
      return {
        type: CAMBIAR_PAGE_ACTION,
        value: NEW_FACTURA_PAGE,
        props: props,
      };
    case EDITAR_FACTURA_PAGE:
      return {
        type: CAMBIAR_PAGE_ACTION,
        value: EDITAR_FACTURA_PAGE,
        props: props,
      };
    case NEW_FACTURA_EXAMEN_PAGE:
      return {
        type: CAMBIAR_PAGE_ACTION,
        value: NEW_FACTURA_EXAMEN_PAGE,
        props: props,
      };
    case EDITAR_FACTURA_EXAMEN_PAGE:
      return {
        type: CAMBIAR_PAGE_ACTION,
        value: EDITAR_FACTURA_EXAMEN_PAGE,
        props: props,
      };
    default:
      throw new Error('Tipo de pagina desconocida: ' + tipoPagina);
  }
};

module.exports = {
  mostrarDialog(tipoDialog, editar) {
    const open = true;
    switch (tipoDialog) {
      case CLIENTE_DIALOG:
        return {
          type: CAMBIAR_DIALOG_ACTION,
          value: CLIENTE_DIALOG,
          editar,
          open,
        };
      case MEDICO_DIALOG:
        return {
          type: CAMBIAR_DIALOG_ACTION,
          value: MEDICO_DIALOG,
          editar,
          open,
        };
      case PRODUCTO_DIALOG:
        return {
          type: CAMBIAR_DIALOG_ACTION,
          value: PRODUCTO_DIALOG,
          editar,
          open,
        };
      default:
        throw new Error('Tipo de dialog desconocido: ' + tipoDialog);
    }
  },

  cancelarDialog() {
    return {
      type: CAMBIAR_DIALOG_ACTION,
      open: false,
    };
  },

  editarCliente(clienteAEditar) {
    return {
      type: CAMBIAR_DIALOG_ACTION,
      value: CLIENTE_DIALOG,
      editar: clienteAEditar,
      open: true,
    };
  },

  editarProducto(productoAEditar) {
    return {
      type: CAMBIAR_DIALOG_ACTION,
      value: PRODUCTO_DIALOG,
      editar: productoAEditar,
      open: true,
    };
  },

  editarFactura(codigo, empresa) {
    return cambiarPagina(EDITAR_FACTURA_PAGE, {
      ventaKey: {
        codigo: codigo,
        empresa: empresa,
      },
    });
  },

  editarFacturaExamen(codigo, empresa) {
    return cambiarPagina(EDITAR_FACTURA_EXAMEN_PAGE, {
      ventaKey: {
        codigo: codigo,
        empresa: empresa,
      },
    });
  },

  cambiarPagina: cambiarPagina,

  cerrarDialogConMsg(msg) {
    return {
      type: CERRAR_DIALOG_CON_MSG_ACTION,
      message: msg,
      open: false,
    };
  },

  abrirLinkConSnackbar(msg, link) {
    return {
      type: ABRIR_LINK_CON_SNACKBAR,
      message: msg,
      link: link,
    };
  },

  mostrarErrorConSnackbar(msg) {
    return {
      type: MOSTRAR_ERROR_CON_SNACKBAR,
      message: msg,
      duration: 5000,
    };
  },
};
