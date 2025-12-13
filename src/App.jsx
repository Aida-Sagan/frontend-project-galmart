import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

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
import CompilationPage from './pages/DetailCompilationPage/CompilationPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage';
import CartPage from './pages/CartPage/CartPage.jsx';

import LegalPage from './pages/Legal/LegalPage.jsx';
import OfertaContent from './pages/Legal/OfertaContent.jsx';
import AgreementContent from './pages/Legal/AgreementContent.jsx';
import PrivacyContent from "./pages/Legal/PrivacyContent.jsx";
import CookiesContent from "./pages/Legal/CookiesContent.jsx";
import ReturnsContent from "./pages/Legal/ReturnsContent.jsx";

import CustomerPage from './pages/CustomerPage/CustomerPage.jsx';
import ContactsContent from './pages/Customer/ContactsContent.jsx';
import AboutContent from './pages/Customer/AboutContent.jsx';
import BonusContent from './pages/Customer/BonusContent.jsx';
import FAQContent from './pages/Customer/FAQContent.jsx';

import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';
import { ProfileProvider } from './context/ProfileContext';

import GlobalModals from '../src/GlobalModals.jsx';


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
                        <Route path="oferta" element={<OfertaContent />} />             {/* 1 */}
                        <Route path="agreement" element={<AgreementContent />} />     {/* 2 */}
                        <Route path="privacy" element={<PrivacyContent />} />         {/* 3 */}
                        <Route path="cookies" element={<CookiesContent />} />         {/* 4 */}
                        <Route path="returns" element={<ReturnsContent />} />         {/* 5 */}
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
            <ProfileProvider>
                <AuthProvider>
                    <FavoritesProvider>
                        <LocationProvider>
                            <CartProvider>
                                    <AppContent />
                            </CartProvider>
                        </LocationProvider>
                    </FavoritesProvider>
                </AuthProvider>
            </ProfileProvider>
        </Router>
    );
}

export default App;