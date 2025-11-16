import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { obtenerPedidosPorUsuario } from '../../service/pedidoService';
import { toast } from 'react-toastify';
import { Card } from '@mui/material';
import { getMonedaSymbol } from '../../utils/Monedas';
import './PerfilComprador.css';

const PerfilComprador = () => {
    const { user } = useAppContext();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user._id) {
            cargarPedidos();
        }
    }, [user]);

    const cargarPedidos = async () => {
        try {
            setLoading(true);
            const data = await obtenerPedidosPorUsuario(user._id);
            setPedidos(data);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            toast.error('Error al cargar el historial de pedidos');
        } finally {
            setLoading(false);
        }
    };

    const getEstadoBadgeClass = (estado) => {
        switch (estado.toLowerCase()) {
            case 'pendiente':
                return 'badge bg-warning';
            case 'enviado':
                return 'badge bg-info';
            case 'entregado':
                return 'badge bg-success';
            case 'cancelado':
                return 'badge bg-danger';
            default:
                return 'badge bg-secondary';
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 perfil-comprador">
            <h2 className="mb-4">Mi Historial de Pedidos</h2>
            
            {pedidos.length === 0 ? (
                <Card className="p-4 text-center">
                    <p className="mb-0">Aún no has realizado ningún pedido</p>
                </Card>
            ) : (
                <div className="row g-3">
                    {pedidos.map((pedido) => (
                        <div key={pedido._id} className="col-12">
                            <Card className="pedido-card p-3">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h5 className="mb-1">Pedido #{pedido._id.slice(-8)}</h5>
                                        <small className="text-muted">
                                            {new Date(pedido.fechaAlta).toLocaleDateString('es-AR', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </small>
                                    </div>
                                    <span className={getEstadoBadgeClass(pedido.estado)}>
                                        {pedido.estado}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <h6>Productos:</h6>
                                    {pedido.items.map((item, idx) => (
                                        <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                                            <div className="d-flex align-items-center gap-2">
                                                {item.producto.fotos && item.producto.fotos[0] && (
                                                    <img 
                                                        src={item.producto.fotos[0]} 
                                                        alt={item.producto.titulo}
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            objectFit: 'cover',
                                                            borderRadius: '6px'
                                                        }}
                                                    />
                                                )}
                                                <div>
                                                    <div>{item.producto.titulo}</div>
                                                    <small className="text-muted">Cantidad: {item.cant}</small>
                                                </div>
                                            </div>
                                            <div>
                                                {getMonedaSymbol(item.moneda)} {(item.precio * item.cant).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-top pt-3">
                                    <div className="d-flex justify-content-between">
                                        <strong>Total:</strong>
                                        <strong>
                                            {getMonedaSymbol(pedido.items[0]?.moneda || 'ARS')} {pedido.total.toFixed(2)}
                                        </strong>
                                    </div>
                                    <div className="mt-2">
                                        <small className="text-muted">
                                            <strong>Dirección de entrega:</strong> {pedido.direccionEntrega.calle} {pedido.direccionEntrega.altura}, 
                                            {pedido.direccionEntrega.ciudad}, {pedido.direccionEntrega.provincia}
                                        </small>
                                    </div>
                                </div>

                                {pedido.estado === 'CANCELADO' && pedido.cambiosEstado.length > 0 && (
                                    <div className="alert alert-warning mt-3 mb-0">
                                        <small>
                                            <strong>Motivo de cancelación:</strong> {pedido.cambiosEstado[pedido.cambiosEstado.length - 1].motivo || 'No especificado'}
                                        </small>
                                    </div>
                                )}
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PerfilComprador;
