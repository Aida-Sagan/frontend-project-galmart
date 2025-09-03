import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Register from './pages/Register/Register.jsx';
import LoginPage from './pages/Login/Login.jsx';
import Home from './pages/Home/MainPage.jsx';
import EnterCode from './pages/Register/EnterCode.jsx';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import CatalogPage from './pages/Catalog/CatalogPage.jsx';
import CategoryPage from './pages/Catalog/CategoryPage.jsx';
import FavoritesPage from './pages/Favorite/FavoritesPage.jsx';
import ProductPage from './pages/Product/ProductPage';


function AppContent() {
    const location = useLocation();
    const hideHeaderRoutes = ['/login', '/register', '/verify'];
    const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {!shouldHideHeader && <Header />}
            <main style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify" element={<EnterCode />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/catalog/:categoryId" element={<CategoryPage />} />
                    <Route path="/catalog/:categoryId/:subcategoryId" element={<CategoryPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/product/:productId" element={<ProductPage />} />
                </Routes>
            </main>
            {!shouldHideHeader &&  <Footer />}
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;