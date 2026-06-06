import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { TESTIMONIALS } from '../data/content'
import { ArrowRight, Quote, Heart, Users, Calendar, Trophy, Zap, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal(0.05)
  const { ref: storyRef, isVisible: storyVisible } = useScrollReveal(0.1)
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollReveal(0.1)
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollReveal(0.1)
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal(0.1)

  const timelineMilestones = [
    {
      year: '2021',
      title: 'The Spark of Change',
      desc: 'Coach Adrian saw that kids got too stressed and tired (burnout) in normal sports groups. He decided we needed a new way to keep kids happy and safe while playing.',
      icon: Zap,
      color: '#6A9BC7'
    },
    {
      year: '2022',
      title: 'EcoHoops Launches',
      desc: 'We started in Mississauga with 15 players in local school gyms. We focused on having fun, playing freely, and making sure kids felt safe to try new things without fear.',
      icon: Users,
      color: '#97B3D2'
    },
    {
      year: '2023',
      title: 'Science of Play',
      desc: 'We brought in modern learning science. We use the **Constraints-Led Approach** (which means **changing the game rules to teach kids how to move**). We threw out standard orange cones and replaced them with active games.',
      icon: Star,
      color: '#B0C8E0'
    },
    {
      year: '2024',
      title: 'Competitive Rep Teams',
      desc: 'We started our travel team program (Rep Teams). We wanted to show that kids can play in big leagues and win, even with coaches who are kind and never yell.',
      icon: Trophy,
      color: '#4A7FB5'
    },
    {
      year: '2026',
      title: 'The Movement Today',
      desc: 'Now we help hundreds of kids. We have girls-only teams, junior games, and modern player profiles. We are the best place for healthy growth.',
      icon: Calendar,
      color: '#F0E6D3'
    }
  ]

  return (
    <div className="pt-28 pb-20 overflow-hidden relative">
      {/* Background ambient glows */}
      <div className="absolute top-12 left-1/4 w-[600px] h-[600px] rounded-full bg-eco-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] rounded-full bg-eco-navy/10 blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 relative z-10"
          >
            <span className="tag mb-4 inline-block">The EcoHoops Story</span>
            <h1 className="font-display text-hero uppercase mb-6 leading-[0.9] tracking-[0.04em]">
              <span className="text-white">BUILDING PEOPLE,</span>
              <br />
              <span className="text-white">NOT JUST </span>
              <span className="gradient-text">PROS</span>
            </h1>
            <p className="text-xl text-eco-muted-light leading-relaxed">
              We started EcoHoops to save youth sports from too much pressure and stress. We believe basketball is a great tool to build happy, strong, and confident kids.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative rounded-2xl overflow-hidden h-[300px] lg:h-[400px] z-0"
          >
            <img
              src="/images/IMG_0283.JPG"
              alt="EcoHoops coaching staff and players gathering"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-eco-black/50 via-transparent to-eco-navy/20" />
            <div className="absolute inset-0 rounded-2xl border border-eco-blue/10" />
          </motion.div>
        </div>
      </section>

      {/* Coach Adrian Story Section */}
      <section ref={storyRef} className="max-w-6xl mx-auto px-6 lg:px-8 mb-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={storyVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="glow-card p-8 md:p-12"
        >
          <div className="border-b border-white/5 pb-8 mb-8">
            <span className="tag mb-3 inline-block">The Founder's Journey</span>
            <h2 className="font-display text-4xl uppercase text-white mb-4">
              COACH ADRIAN'S BACKSTORY
            </h2>
            <p className="text-xl md:text-2xl text-eco-blue leading-relaxed font-heading font-semibold italic max-w-4xl">
              "We kept the grit, the community, and the love for the game — and burned the rest."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Roots Profile column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] lg:aspect-square w-full">
                <img
                  src="/images/IMG_0281.JPG"
                  alt="Coach Adrian teaching a player on court"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              <div className="p-5 rounded-2xl bg-eco-black/40 border border-white/5 space-y-3">
                <h4 className="font-heading font-bold text-white text-xs uppercase tracking-widest text-eco-blue">
                  The Roots: Little Burgundy, Montreal
                </h4>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  Adrian grew up in Little Burgundy, Montreal, in the 1980s and 1990s. It was a tough neighborhood. Adrian found a safe place and learned how to be a good person by playing sports with kind mentors.
                </p>
              </div>
            </div>

            {/* Content narrative column */}
            <div className="lg:col-span-7 space-y-6 text-base text-eco-muted-light leading-relaxed">
              <p>
                When Adrian was a teenager, famous sports players from his own neighborhood helped him.
                They taught him how to lead with kindness, order, and respect:
              </p>

              {/* Mentors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-eco-surface2 border border-white/5">
                  <h5 className="font-heading font-bold text-white text-sm uppercase mb-1">
                    Trevor Williams & Wayne Yearwood
                  </h5>
                  <p className="text-xs text-eco-muted-light leading-relaxed">
                    Wayne played in the 1988 Olympics. Trevor played against the famous USA "Dream Team" in 1992. Their basketball camps showed Adrian how to build good character in young players.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-eco-surface2 border border-white/5">
                  <h5 className="font-heading font-bold text-white text-sm uppercase mb-1">
                    Alvin Powell
                  </h5>
                  <p className="text-xs text-eco-muted-light leading-relaxed">
                    Alvin was a big football player in the NFL. He became a counselor. He spent his life helping kids stay calm and feel safe when life gets too hard.
                  </p>
                </div>
              </div>

              <p>
                Adrian worked hard and became the main point guard for a championship college basketball team. He was named a star player.
              </p>

              <p>
                But Adrian's best skills do not come from books. Members of his own family had hard times with mental health. Adrian spent his life learning how to help and understand people who feel sad, stressed, or scared. This gives him a lot of kindness that you cannot learn in a standard coaching class.
              </p>

              <p>
                At first, Adrian coached the old way. He pushed kids hard. But he saw it made them sad and play with fear. Many kids quit sports by age 13. He decided to change things. He started EcoHoops to mix high-level basketball with kind support and brain science.
              </p>

              <div className="p-4 rounded-xl bg-[#97B3D2]/5 border border-[#97B3D2]/10">
                <p className="text-sm font-semibold text-white">
                  "When we walk into the gym, we bring the skills of a champion, the street smarts of a tough neighborhood, and a promise to keep every kid happy and safe."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Brand History Timeline Section */}
      <section ref={timelineRef} className="max-w-5xl mx-auto px-6 lg:px-8 mb-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={timelineVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Our History</span>
          <h2 className="font-display text-section uppercase">
            <span className="text-white">ECOHOOPS </span>
            <span className="gradient-text">MILESTONES</span>
          </h2>
          <p className="text-eco-muted-light text-base max-w-xl mx-auto mt-4 leading-relaxed">
            From a single play-based community group to a thriving GTA basketball organization, look back at the key moments of our journey.
          </p>
        </motion.div>

        {/* Timeline Line & Milestones */}
        <div className="relative border-l border-[#97B3D2]/20 ml-4 md:ml-32 space-y-12">
          {timelineMilestones.map((milestone, idx) => {
            const Icon = milestone.icon
            return (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: -30 }}
                animate={timelineVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative pl-8 md:pl-12 group"
              >
                {/* Year Badge floating left for desktop */}
                <div className="hidden md:block absolute right-[calc(100%+24px)] top-1 font-display text-4xl text-right text-eco-muted group-hover:text-white transition-colors duration-300">
                  {milestone.year}
                </div>

                {/* Timeline node icon */}
                <div
                  className="absolute left-[-20px] top-1 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--eco-surface)',
                    borderColor: `${milestone.color}50`,
                    boxShadow: `0 0 15px ${milestone.color}20`
                  }}
                >
                  <Icon size={16} style={{ color: milestone.color }} />
                </div>

                {/* Content Card */}
                <div className="glow-card p-6 bg-eco-surface border border-eco-border rounded-xl">
                  {/* Year display for mobile */}
                  <span className="md:hidden inline-block text-xs font-mono font-bold uppercase tracking-wider mb-2" style={{ color: milestone.color }}>
                    {milestone.year}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-white mb-2 uppercase tracking-wide">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-eco-muted-light leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Parent Testimonials Grid */}
      <section ref={testimonialsRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={testimonialsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Real Impact</span>
          <h2 className="font-display text-section uppercase">
            <span className="text-white">PARENT </span>
            <span className="gradient-text">TESTIMONIALS</span>
          </h2>
          <p className="text-eco-muted-light text-base max-w-xl mx-auto mt-4 leading-relaxed">
            Hear from the parents who have witnessed their children grow, play, and build resilience with us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="glow-card p-6 flex flex-col justify-between"
            >
              <div>
                <Quote size={32} className="text-[#97B3D2]/10 mb-4" />
                <p className="text-sm text-eco-muted-light leading-relaxed italic mb-6">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-[#97B3D2]/10 border border-[#97B3D2]/20 flex items-center justify-center text-[#97B3D2] font-mono text-sm font-semibold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-white uppercase leading-tight">
                    {testimonial.name}
                  </h4>
                  <p className="text-[11px] text-eco-muted uppercase tracking-wider">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={ctaVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="glow-card p-8 md:p-12 relative overflow-hidden"
        >
          {/* Subtle colored ambient drop */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#97B3D2]/10 blur-[50px] pointer-events-none rounded-full" />
          
          <Heart size={48} className="text-[#97B3D2]/30 mx-auto mb-6" />
          <h2 className="font-display text-section uppercase text-white mb-4">
            DISCOVER THE SCIENCE
          </h2>
          <p className="text-eco-muted-light max-w-xl mx-auto mb-8 leading-relaxed">
            We do not guess how to teach. Read about our methods, like the **Constraints-Led Approach** (which means **changing the game rules to help kids learn**), and why play comes first.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/philosophy" className="btn-glow inline-flex items-center gap-2 px-8 py-3">
              Explore Our Philosophy <ArrowRight size={16} />
            </Link>
            <Link to="/blog" className="px-6 py-3 border border-white/10 hover:border-[#97B3D2]/30 bg-eco-surface2/50 rounded-xl text-sm font-heading font-semibold text-white uppercase transition-all duration-300">
              Read the Blog
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
