import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white/70"
        >
          Product design & fabrication studio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl"
        >
          Baja Works Co.
          <span className="block text-white/70">Modern goods. Built in-house.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <a className="rounded-full bg-white px-5 py-3 text-black" href="/shop">
            Shop
          </a>
          <a className="rounded-full border border-white/20 px-5 py-3 text-white" href="/contact">
            Custom Order
          </a>
        </motion.div>
      </div>

      {/* subtle animated background */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{
          background:
            "radial-gradient(900px 450px at 20% 20%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(900px 450px at 80% 30%, rgba(255,255,255,0.06), transparent 60%)"
        }}
      />
    </section>
  );
}
