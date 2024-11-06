import Footer from "./Footer/Footer";
import Navbar from "./Navbar/Navbar";
import ProductSection from "./Product Section/ProductSection";
import StyleSection from "./Style Section/StyleSection";

export default function Root() {
    return (
        <>
            <Navbar />
            <StyleSection />
            <ProductSection />
            <Footer />
        </>
    );
}