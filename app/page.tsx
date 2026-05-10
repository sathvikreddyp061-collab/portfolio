import Nav from "@/components/nav/Nav";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import TechUniverseLazy from "@/components/stack/TechUniverseLazy";
import Projects from "@/components/projects/Projects";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/footer/Footer";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Page() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <SectionDivider index="01" label="The arc · who I am" accent="#22f0ff" />
      <About />
      <SectionDivider index="02" label="Technology universe" accent="#7c5cff" />
      <TechUniverseLazy />
      <SectionDivider index="03" label="Field work · case studies" accent="#ff3cac" />
      <Projects />
      <SectionDivider index="04" label="Open a channel" accent="#A8FF60" />
      <Contact />
      <Footer />
    </main>
  );
}
