// src/pages/blog/GermanBlog.tsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

// local images
import img1 from '../../assets/germanBlogPic1.png'
import img2 from '../../assets/germanBlogPic2.png'
import BlogSection from '../../components/BlogSection'

const GermanBlog = () => {
    return (
        <>
            <div className="min-h-screen font-inter  text-black scroll-smooth">
                <Navbar />

                <main className="">

                    {/* ================= BLOG HEADER ================= */}
                    <section className="pt-28 pb-20 px-6">
                        <div className="max-w-4xl mx-auto text-center">

                            <div className="inline-flex px-4 py-2 rounded-full bg-[#e1edfc] text-[#276dc9] text-sm font-bold mb-6">
                                TEACHING & OPPORTUNITIES
                            </div>

                            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1f2937] leading-tight mb-4">
                                Teach German Language Online
                                <span className="block text-[#5186cd] mt-2">
                                    Join LearniLM🌎World as a German Instructor
                                </span>
                            </h1>

                            <p className="text-gray-500">
                                By LearniLM🌎World • 6 min read
                            </p>
                        </div>
                    </section>

                    {/* ================= HERO IMAGE ================= */}
                    <section className="px-6 mb-24">
                        <div className="max-w-6xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="rounded-3xl overflow-hidden p-6"
                            >
                                <img
                                    src={img1}
                                    alt="Teach German Online"
                                    className="w-full max-h-[360px] object-contain rounded-2xl mx-auto"
                                />
                            </motion.div>
                        </div>
                    </section>


                    {/* ================= ARTICLE CONTENT ================= */}
                    <section className="px-6 pb-32">
                        <div className="max-w-3xl mx-auto space-y-12 text-gray-800 text-lg leading-relaxed">

                            <p>
                                Interest in learning German is growing rapidly across the world.
                                From students planning to study abroad to professionals expanding
                                their careers, more people than ever want to learn the language.
                                This global demand creates powerful opportunities for skilled
                                German language educators.
                            </p>

                            <p>
                                If you teach German or have strong experience with the language,
                                LearniLM🌎World invites you to become part of a global learning
                                community — where your knowledge genuinely makes a difference.
                            </p>

                            <h2 className="text-3xl font-bold text-[#1f2937]">
                                Why Teach German Online?
                            </h2>

                            <p>
                                Online language teaching removes geographical limits. You can
                                teach students from different countries, backgrounds, and skill
                                levels — all from the comfort of your home.
                            </p>

                            {/* Inline article image */}
                            <img
                                src={img2}
                                alt="Teaching German online"
                                className="w-full rounded-2xl shadow-md my-8 object-cover"
                            />

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Teach beginners and advanced learners</li>
                                <li>Create lessons based on real-life language use</li>
                                <li>Help students build confidence in speaking German</li>
                                <li>Work with learners who are truly motivated</li>
                            </ul>

                            <div className="bg-[#e1edfc] border-l-4 border-[#5186cd] px-6 py-5 rounded-xl">
                                <p className="font-medium text-[#1f2937]">
                                    “Teaching German online allows educators to focus on how people
                                    actually speak and communicate — not just textbook grammar.”
                                </p>
                            </div>

                            <h2 className="text-3xl font-bold text-[#1f2937]">
                                Why Choose LearniLM🌎World?
                            </h2>

                            <p>
                                LearniLM🌎World is built for educators who love teaching.
                                The platform handles the technical side so you can focus on
                                what matters most — helping students learn effectively.
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Flexible teaching schedule</li>
                                <li>Freedom to design your own lessons</li>
                                <li>Access to students worldwide</li>
                                <li>Supportive and educator-first platform</li>
                            </ul>

                            <h2 className="text-3xl font-bold text-[#1f2937]">
                                Empowering German Language Educators
                            </h2>

                            <p>
                                Whether you specialize in grammar, pronunciation, or cultural
                                understanding, your expertise plays a key role in shaping
                                confident German speakers.
                            </p>

                            <p>
                                Many students struggle not because of vocabulary, but because
                                they lack confidence. As an instructor, you help bridge that gap
                                by guiding them through pronunciation, structure, and cultural
                                nuances of the language.
                            </p>

                            <h2 className="text-3xl font-bold text-[#1f2937]">
                                Become a German Instructor Today
                            </h2>

                            <p>
                                LearniLM🌎World welcomes passionate educators who want flexibility,
                                impact, and meaningful teaching experiences. Teaching German
                                online isn’t just a job — it’s a way to connect cultures and
                                empower learners worldwide.
                            </p>

                            {/* CTA */}
                            <div className="mt-10 p-8 rounded-2xl bg-[#5186cd] text-white text-center">
                                <h3 className="text-2xl font-bold mb-4">
                                    Ready to Teach German Online?
                                </h3>
                                <p className="mb-6 text-white/90">
                                    Join LearniLM🌎World and start teaching students from around the globe.
                                </p>
                                <Link
                                    to="/become-trainer"
                                    className="inline-block px-8 py-3 rounded-full bg-white text-[#276dc9] font-bold hover:scale-105 transition"
                                >
                                    Become a German Instructor →
                                </Link>
                            </div>

                        </div>
                    </section>

                    {/* ================= MORE BLOGS ================= */}
                    <section className="py-28 px-6 bg-[#e1edfc]">
                        <div className="max-w-7xl mx-auto text-center">

                            <div className="inline-flex px-5 py-2 rounded-full bg-white text-[#276dc9] text-sm font-bold mb-6 shadow">
                                MORE FROM OUR BLOG
                            </div>

                            <h2 className="text-4xl font-extrabold mb-16 text-[#1f2937]">
                                Explore More Insights
                            </h2>

                            <BlogSection variant="more" />


                            <div className="mt-16">
                                <Link to="/blog" className="text-[#5186cd] font-semibold hover:underline">
                                    View all blogs →
                                </Link>
                            </div>
                        </div>
                    </section>

                </main>

                <Footer />
            </div>
        </>
    )
}

export default GermanBlog
