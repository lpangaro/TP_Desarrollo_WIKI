import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './features/layout/Layout';
import Home from './features/home/Home';
import Checkout from './features/checkout/Checkout.jsx';
import Carrito from './features/carrito/Carrito.jsx';
import ProductoDetailPage from './features/productos/ProductoDetailPage.jsx';
import PerfilComprador from './features/perfil/PerfilComprador.jsx';
import React, { useState, useEffect } from 'react';
import { getProductos } from './service/productoService.js';
import PerfilVendedor from "./components/perfilVendedor/PerfilVendedor.jsx";
import Register from './components/forms/Register.jsx';
import Login from './components/forms/Login.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: "#165354"
    }
  }
});

function App() {
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para el término de búsqueda
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPaginas, setTotalPaginas] = useState(1); //TODO: FALTA desde el backend

  // Cargar productos al montar la app
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const productosCargados = await getProductos();
    setProductos(productosCargados);
    setProductosFiltrados(productosCargados);
    // setCurrentPage();
  };

  // Función para filtrar productos (ahora solo actualiza el término de búsqueda)
  const filtrarProductos = (searchText) => {
    setSearchTerm(searchText);
  };

  const actualizarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
  };

  const agregarAlCarrito = (producto) => {
    const productoExistente = carrito.find(item => item._id === producto._id);
    if (productoExistente) {
      const nuevoCarrito = carrito.map(item =>
        item._id === producto._id
          ? { ...item, cant: item.cant + (producto.cant || 1) }
          : item
      );
      setCarrito(nuevoCarrito);
    } else {
      // Asegurar que el producto tenga la propiedad cant inicializada
      setCarrito([...carrito, { ...producto, cant: producto.cant || 1 }]);
    }
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path="/"
            element={<Layout carrito={carrito} filtrarProductos={filtrarProductos} />}
          >
            <Route index
              // element={<Home productos={productos} productosFiltrados={productosFiltrados} filtrarProductos={filtrarProductos} />}
              element={<Home productos={productos} productosFiltrados={productosFiltrados} filtrarProductos={filtrarProductos} agregarAlCarrito={agregarAlCarrito} setProductosFiltrados={setProductosFiltrados} searchTerm={searchTerm} />}
            />
            <Route path="producto/:id"
              element={<ProductoDetailPage productos={productos} carrito={carrito} actualizarCarrito={agregarAlCarrito} />}
            />
            <Route path="carrito"
              element={<Carrito carrito={carrito} limpiarCarrito={limpiarCarrito} actualizarCarrito={actualizarCarrito} />}
            />
            <Route path="checkout"
              element={<Checkout carrito={carrito} limpiarCarrito={limpiarCarrito} actualizarCarrito={actualizarCarrito} recargarProductos={cargarProductos} />}
            />
            <Route path='productos/vendedor/:id'
              element={<PerfilVendedor carrito={carrito} agregarAlCarrito={agregarAlCarrito} />}
            />
            <Route path='mi-perfil'
              element={<PerfilComprador />}
            />
            <Route path='register'
              element={<Register />}
            />
            <Route path='login'
              element={<Login />}
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;