import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import MainFeatures from '@/components/landing/MainFeatures';
import AIFeatures from '@/components/landing/AIFeatures';
import TeacherTools from '@/components/landing/TeacherTools';
import Leaderboard from '@/components/landing/Leaderboard';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/CTA';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <MainFeatures />
        <AIFeatures />
        <TeacherTools />
        <Leaderboard />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}