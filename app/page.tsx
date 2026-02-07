import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustStrip from '@/components/TrustStrip';
import Experience from '@/components/Experience';
import PackagesPreview from '@/components/PackagesPreview';
import WhyChoose from '@/components/WhyChoose';
import Gallery from '@/components/Gallery';
import Itinerary from '@/components/Itinerary';
import BookingSection from '@/components/BookingSection';
import WhatsAppEnquiry from '@/components/WhatsAppEnquiry';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-20">
                <Hero />
                <TrustStrip />
                <Experience />
                <PackagesPreview />
                <WhyChoose />
                <Gallery />
                <Itinerary />
                <BookingSection />
                <WhatsAppEnquiry />
                <FAQ />
                <Footer />
                <WhatsAppButton />
            </main>
        </>
    );
}
