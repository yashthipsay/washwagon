import Link from 'next/link'
import './landing.css'

export default function LandingPage() {
    return (
        <div className="landing-page">
            {/* Navbar */}
            <header className="navbar">
                <div className="container">
                    <Link href="/" className="logo">MyLandingPage</Link>
                    <nav className="nav-links">
                        <Link href="#features" className="nav-link">Features</Link>
                        <Link href="#about" className="nav-link">About</Link>
                        <Link href="#contact" className="nav-link">Contact</Link>
                        <Link href="/signup" className="signup-btn">Sign Up / Login</Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                {/* Sign Up / Login Button */}
                <div className="signup-btn-container">
                    <Link href="/signup" className="cta-btn primary">Sign Up / Login</Link>
                </div>

                <div className="container text-center">
                    <h1 className="hero-title">Welcome to My Landing Page</h1>
                    <p className="hero-description">
                        A clean and responsive landing page built with Next.js and Tailwind CSS.
                    </p>
                    <div className="cta-buttons">
                        <Link href="#features" className="cta-btn">Learn More</Link>
                        <Link href="/signup" className="cta-btn primary">Get Started</Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features">
                <div className="container">
                    <h2 className="section-title">Features</h2>
                    <div className="feature-cards">
                        {[
                            {
                                title: "Fast Performance",
                                description: "Enjoy blazing fast performance for your website."
                            },
                            {
                                title: "Mobile-Friendly",
                                description: "Fully responsive design for any device."
                            },
                            {
                                title: "Easy to Customize",
                                description: "Easily adapt the design to meet your needs."
                            }
                        ].map((feature, index) => (
                            <div key={index} className="feature-card">
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about">
                <div className="container text-center">
                    <h2 className="section-title">About Us</h2>
                    <p className="about-description">
                        We are passionate about building user-friendly web applications with modern
                        technologies like Next.js and Tailwind CSS.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container text-center">
                    <p>&copy; {new Date().getFullYear()} MyLandingPage. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
