import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Register from './pages/Register/Register';
import LoginPage from './pages/Login/Login';
import Home from './pages/Home/MainPage';
import EnterCode from './pages/Register/EnterCode';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CatalogPage from './pages/Catalog/CatalogPage';
import CategoryPage from './pages/Catalog/CategoryPage';
import FavoritesPage from './pages/Favorite/FavoritesPage';
import ProductPage from './pages/Product/ProductPage';
import CompilationPage from './pages/DetailCompilationPage/CompilationPage';
import ProfilePage from './pages/Profile/ProfilePage';
import CartPage from './pages/CartPage/CartPage';
import SearchPage from './pages/SearchPage/SearchPage';

import LegalPage from './pages/Legal/LegalPage';
import OfertaContent from './pages/Legal/OfertaContent';
import AgreementContent from './pages/Legal/AgreementContent';
import PrivacyContent from "./pages/Legal/PrivacyContent";
import CookiesContent from "./pages/Legal/CookiesContent";
import ReturnsContent from "./pages/Legal/ReturnsContent";

import CustomerPage from './pages/CustomerPage/CustomerPage';
import ContactsContent from './pages/Customer/ContactsContent';
import AboutContent from './pages/Customer/AboutContent';
import BonusContent from './pages/Customer/BonusContent';
import FAQContent from './pages/Customer/FAQContent';


import GlobalModals from '../src/GlobalModals';


function AppContent() {
    const location = useLocation();

    const hideHeaderRoutes = ['/login', '/register', '/verify'];
    const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <GlobalModals />

            {!shouldHideHeader && <Header />}
            <main style={{ flex: 1 }}>
                <Routes>
                    {/* ОСНОВНЫЕ МАРШРУТЫ */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/verify" element={<EnterCode />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/catalog/:categoryId" element={<CategoryPage />} />
                    <Route path="/catalog/:categoryId/:subcategoryId" element={<CategoryPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/product/:productId" element={<ProductPage />} />
                    <Route path="/compilations/:id" element={<CompilationPage />} />
                    <Route path="/cart" element={<CartPage />} />

                    {/* МАРШРУТЫ ДЛЯ СТРАНИЦЫ "УСЛОВИЯ ПОЛЬЗОВАНИЯ" С САЙДБАРОМ */}
                    <Route path="/legal" element={<LegalPage />}>
                        <Route index element={<Navigate to="oferta" replace />} />
                        <Route path="oferta" element={<OfertaContent />} />
                        <Route path="agreement" element={<AgreementContent />} />
                        <Route path="privacy" element={<PrivacyContent />} />
                        <Route path="cookies" element={<CookiesContent />} />
                        <Route path="returns" element={<ReturnsContent />} />
                    </Route>
                    {/* КОНЕЦ МАРШРУТОВ ДЛЯ САЙДБАРА */}

                    {/* НОВЫЕ МАРШРУТЫ ДЛЯ СТРАНИЦЫ "ПОКУПАТЕЛЯМ" С САЙДБАРОМ */}
                    <Route path="/customer" element={<CustomerPage />}>
                        <Route index element={<Navigate to="contacts" replace />} />
                        <Route path="contacts" element={<ContactsContent />} />
                        <Route path="about" element={<AboutContent />} />
                        <Route path="bonus" element={<BonusContent />} />
                        <Route path="faq" element={<FAQContent />} />
                    </Route>
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