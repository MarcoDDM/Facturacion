import React, { Component } from 'react';

import PaperContainer from '../lib/PaperContainer';
import FacturaForm from './FacturaForm';
import FacturaTable from './FacturaTable';
import FacturaResults from './FacturaResults';
import {
  getFacturaURL,
  getFacturaExamenURL,
  verVenta,
  verVentaExamen,
} from '../api';
import {
  agregarProductoComoFacturable,
  calcularValoresTotales,
  editarFacturaExistente,
  getDefaultState,
  modificarValorEnFacturaData,
  modificarValorEnFacturable,
  puedeGuardarFactura,
  prepararFacturaParaGuardar,
  removeFacturableAt,
} from './EditorState';

export default class FacturaEditorView extends Component {
  constructor(props) {
    super(props);
    this.state = getDefaultState();
  }

  onFacturaDataChanged = (key, newValue) => {
    const modificacion = modificarValorEnFacturaData(key, newValue);
    if (modificacion != null) this.setState(modificacion);
  };

  onFacturableChanged = (index, key, newValue) => {
    const modificacion = modificarValorEnFacturable(index, key, newValue);
    if (modificacion != null) this.setState(modificacion);
  };

  onFacturableDeleted = index => {
    this.setState(removeFacturableAt(index));
  };

  onNewCliente = newCliente => {
    this.setState({ cliente: newCliente });
    if (newCliente && newCliente.descDefault > 0)
      this.onFacturaDataChanged('descuento', '' + newCliente.descDefault);
  };

  onNewMedico = newMedico => {
    this.setState({ medico: newMedico });
  };

  onNewProductFromKeyboard = newProduct => {
    this.setState(agregarProductoComoFacturable(newProduct));
  };

  resetearEditorYMostrarResultado = (ventaGuardada, msg) => {
    this.setState(getDefaultState());
    const pdfLink = this.props.isExamen
      ? getFacturaExamenURL(ventaGuardada.codigo, ventaGuardada.empresa)
      : getFacturaURL(ventaGuardada.codigo, ventaGuardada.empresa);
    window.open(pdfLink);
    this.props.abrirLinkConSnackbar(msg, pdfLink);
  };

  guardarFacturaAsync = (guardarPromise, ventaAGuardar, guardadoExitoMsg) => {
    guardarPromise
      .then(() => {
        this.resetearEditorYMostrarResultado(ventaAGuardar, guardadoExitoMsg);
      })
      .catch(err => {
        console.error('error ', err.status, err.response.text);
      });
  };

  onGenerarFacturaClick = () => {
    const { empresa, iva } = this.props.ajustes;
    const editar = this.props.ventaKey;
    const isExamen = this.props.isExamen;

    const { errors, msg, prom, ventaRow } = prepararFacturaParaGuardar(
      this.state,
      editar,
      empresa,
      isExamen,
      iva
    );
    if (errors) this.setState({ errors: errors });
    else this.guardarFacturaAsync(prom, ventaRow, msg);
  };

  componentDidMount() {
    const facturaAEditar = this.props.ventaKey;
    const isExamen = this.props.isExamen;
    const obtenerFacturaInfo = isExamen ? verVentaExamen : verVenta;
    if (facturaAEditar)
      obtenerFacturaInfo(
        facturaAEditar.codigo,
        facturaAEditar.empresa
      ).then(resp => {
        this.setState(editarFacturaExistente(resp));
      });
  }

  render() {
    const { cliente, errors, facturables, facturaData, medico } = this.state;

    const { isExamen, ventaKey, ajustes } = this.props;

    const errorUnidades = errors && errors.unidades;
    const porcentajeDescuentoString = facturaData.get('descuento');
    const fleteString = facturaData.get('flete');
    const detallado = facturaData.get('detallado');
    const porcentajeIVA = ajustes.iva;
    const { subtotal, rebaja, impuestos, total } = calcularValoresTotales(
      facturables,
      fleteString,
      isExamen ? 0 : porcentajeIVA,
      porcentajeDescuentoString
    );

    return (
      <div style={{ height: '100%', overflow: 'auto' }}>
        <PaperContainer>
          <div
            style={{
              marginTop: '24px',
              marginLeft: '36px',
              marginRight: '36px',
            }}
          >
            <FacturaForm
              data={facturaData.toJS()}
              errors={errors}
              cliente={cliente}
              medico={medico}
              onDataChanged={this.onFacturaDataChanged}
              ventaKey={ventaKey}
              onNewMedico={this.onNewMedico}
              onNewCliente={this.onNewCliente}
              onNewProduct={this.onNewProductFromKeyboard}
              isExamen={isExamen}
            />
            <FacturaTable
              items={facturables}
              onFacturableChanged={this.onFacturableChanged}
              onFacturableDeleted={this.onFacturableDeleted}
              isExamen={isExamen}
            />
            <FacturaResults
              errorUnidades={errorUnidades}
              subtotal={subtotal}
              rebaja={rebaja}
              impuestos={impuestos}
              total={total}
              porcentajeIVA={porcentajeIVA}
              detallado={detallado}
              onGuardarClick={this.onGenerarFacturaClick}
              onFacturaDataChanged={this.onFacturaDataChanged}
              nuevo={!ventaKey}
              guardarButtonDisabled={!puedeGuardarFactura(this.state, isExamen)}
              isExamen={isExamen}
            />
          </div>
        </PaperContainer>
      </div>
    );
  }
}

FacturaEditorView.propTypes = {
  abrirLinkConSnackbar: React.PropTypes.func.isRequired,
  isExamen: React.PropTypes.bool,
  ventaKey: React.PropTypes.shape({
    codigo: React.PropTypes.string.isRequired,
    empresa: React.PropTypes.string.isRequired,
  }),
};

FacturaEditorView.defaultProps = {
  isExamen: false,
};
