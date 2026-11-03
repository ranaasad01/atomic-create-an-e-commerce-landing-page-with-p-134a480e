"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, ArrowRight, Sparkles, Shield, Truck, RefreshCw, Heart, ChevronRight, Zap, Award, Users } from 'lucide-react';
import { products, categories, type Product } from "@/lib/data";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
  slideInLeft,
  slideInRight,
} from "@/lib/motion";
import { useCartStore } from "@/lib/cartStore";

// ─── helpers ────────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${
              s <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">
        {rating.toFixed(1)} ({count.toLocaleString()})
      </span>
    </div>
  );
}

// ─── Product Card ────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const shouldReduce = useReducedMotion();

  const handleAdd = () => {
    addItem({ ...product, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const discount =
    product.originalPrice != null
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : null;

  return (
    <motion.div variants={scaleIn} whileHover={shouldReduce ? {} : { y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.10)" }} transition={{ duration: 0.3 }} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80";
          }} />
        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${
              product.badge === "Sale"
                ? "bg-rose-500 text-white"
                : "bg-indigo-600 text-white"
            }`}>
            {product.badge}
          </span>
        )}
        {discount != null && (
          <span className="absolute top-3 right-12 text-xs font-bold px-2 py-1 rounded-full bg-amber-400 text-amber-900">
            -{discount}%
          </span>
        )}
        {/* Wishlist */}
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => setWished((w) => !w)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors" aria-label="Toggle wishlist">
          <Heart
            className={`w-4 h-4 transition-colors ${
              wished ? "fill-rose-500 text-rose-500" : "text-gray-400"
            }`}
          />
        </motion.button>
      </div>
      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 flex-1">
          {product.description}
        </p>
        <StarRating rating={product.rating} count={product.reviewCount} />

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-1 gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice != null && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <motion.button
            whileHover={shouldReduce ? {} : { scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              added
                ? "bg-green-500 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}>
            <ShoppingCart className="w-3.5 h-3.5" />
            {added ? "Added!" : "Add"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Value Props ─────────────────────────────────────────────────────────────

const valueProps = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On all orders over $75. Express delivery available at checkout.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Shield,
    title: "2-Year Warranty",
    desc: "Every product is backed by our comprehensive quality guarantee.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: RefreshCw,
    title: "30-Day Returns",
    desc: "Not in love? Return it hassle-free within 30 days, no questions asked.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Zap,
    title: "Fast Checkout",
    desc: "One-click checkout with Apple Pay, Google Pay, and all major cards.",
    color: "bg-rose-50 text-rose-600",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: "Sarah M.",
    role: "Verified Buyer",
    avatar: "https://mormonartist.net/images/interviews/sarah-m-eden/sarah-m-eden-01.jpg",
    text: "The headphones are absolutely incredible. The noise cancellation is on another level — I wore them on a 10-hour flight and arrived refreshed. Worth every penny.",
    product: "Wireless Noise-Cancelling Headphones",
    rating: 5,
  },
  {
    name: "James T.",
    role: "Verified Buyer",
    avatar: "https://s3.amazonaws.com/arc-authors/cmg/8adde958-cd42-477c-9467-0ee150778a71.png",
    text: "The leather watch is even more beautiful in person. The craftsmanship is exceptional and it pairs perfectly with both casual and formal outfits.",
    product: "Minimalist Leather Watch",
    rating: 5,
  },
  {
    name: "Priya K.",
    role: "Verified Buyer",
    avatar: "https://media.licdn.com/dms/image/v2/D4D03AQFjb0oGgSOYPA/profile-displayphoto-shrink_200_200/B4DZZCoiL8G8AY-/0/1744874647031?e=2147483647&v=beta&t=iz-x6HzQIMtn31vtR_7FQLb0f3k09LJMyTJzm42hHDI",
    text: "I've tried dozens of serums and this Vitamin C formula is genuinely transformative. My skin tone has evened out noticeably in just three weeks.",
    product: "Organic Vitamin C Serum",
    rating: 5,
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = [
  { icon: Users, value: "120K+", label: "Happy Customers" },
  { icon: Award, value: "4.9★", label: "Average Rating" },
  { icon: Sparkles, value: "500+", label: "Curated Products" },
  { icon: Truck, value: "98%", label: "On-Time Delivery" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const shouldReduce = useReducedMotion();

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 text-white">
        {/* decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-800/30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <motion.div initial="hidden" animate="visible" variants={shouldReduce ? {} : staggerContainer} className="flex flex-col gap-6">
            <motion.div variants={shouldReduce ? {} : fadeInUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium w-fit">
              <Sparkles className="w-4 h-4 text-amber-400" />
              New arrivals just dropped
            </motion.div>

            <motion.h1 variants={shouldReduce ? {} : fadeInUp} className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Curated for
              <br />
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-400"
                style={{
                  color: "#ef4444",
                  WebkitTextFillColor: "#ef4444"
                }}>
                modern living.
              </span>
            </motion.h1>

            <motion.p variants={shouldReduce ? {} : fadeInUp} className="text-lg text-indigo-200 max-w-md leading-relaxed">
              Discover premium electronics, fashion, and home essentials —
              thoughtfully selected for quality, design, and everyday joy.
            </motion.p>

            <motion.div variants={shouldReduce ? {} : fadeInUp} className="flex flex-wrap gap-3">
              <motion.a href="#products" whileHover={shouldReduce ? {} : { scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-50 transition-colors">Shop</motion.a>
              <motion.a href="#categories" whileHover={shouldReduce ? {} : { scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm">
                Browse Categories
              </motion.a>
            </motion.div>

            {/* mini stats */}
            <motion.div variants={shouldReduce ? {} : fadeInUp} className="flex flex-wrap gap-6 pt-2">
              {[
                { val: "120K+", lbl: "Customers" },
                { val: "4.9★", lbl: "Rating" },
                { val: "Free", lbl: "Shipping $75+" },
              ].map((s) => (<div key={s.lbl} className="flex flex-col">
                <span className="text-xl font-extrabold text-white">
                  {s.val}
                </span>
                <span className="text-xs text-indigo-300">{s.lbl}</span>
              </div>))}
            </motion.div>
          </motion.div>

          {/* Right — hero product collage */}
          <motion.div initial={shouldReduce ? {} : { opacity: 0, x: 60 }} animate={shouldReduce ? {} : { opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }} className="hidden md:grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((p, i) => (
              <motion.div
                key={p.id}
                whileHover={shouldReduce ? {} : { scale: 1.04, rotate: 1 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl overflow-hidden shadow-2xl aspect-square ${
                  i === 0 ? "col-span-2 aspect-video" : ""
                }`}>
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80";
                  }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* ── VALUE PROPS ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={shouldReduce ? {} : staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {valueProps.map((vp) => (<motion.div key={vp.title} variants={shouldReduce ? {} : fadeInUp} className="flex flex-col items-center text-center gap-3 p-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${vp.color}`}>
                <vp.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{vp.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{vp.desc}</p>
            </motion.div>))}
          </motion.div>
        </div>
      </section>
      {/* ── PRODUCTS ─────────────────────────────────────────────────────── */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={shouldReduce ? {} : staggerContainer} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <motion.p variants={shouldReduce ? {} : fadeInUp} className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-1">
                Our Collection
              </motion.p>
              <motion.h2 variants={shouldReduce ? {} : fadeInUp} className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Featured Products
              </motion.h2>
            </div>
            <motion.div variants={shouldReduce ? {} : fadeInUp}>
              <Link href="/cart" className="inline-flex items-center gap-1.5 text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors">
                View cart <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Category filter */}
          <motion.div id="categories" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={shouldReduce ? {} : fadeIn} className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (<motion.button
              key={cat}
              whileHover={shouldReduce ? {} : { scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}>
              {cat}
            </motion.button>))}
          </motion.div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory} initial="hidden" animate="visible" exit={{ opacity: 0, transition: { duration: 0.15 } }} variants={shouldReduce ? {} : staggerContainer} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      {/* ── STATS BAND ───────────────────────────────────────────────────── */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={shouldReduce ? {} : staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            {stats.map((s) => (<motion.div key={s.label} variants={shouldReduce ? {} : scaleIn} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-1">
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-extrabold">{s.value}</span>
              <span className="text-indigo-200 text-sm font-medium">
                {s.label}
              </span>
            </motion.div>))}
          </motion.div>
        </div>
      </section>
      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={shouldReduce ? {} : staggerContainer} className="text-center mb-12">
            <motion.p variants={shouldReduce ? {} : fadeInUp} className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-2">
              Social Proof
            </motion.p>
            <motion.h2 variants={shouldReduce ? {} : fadeInUp} className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Loved by thousands
            </motion.h2>
            <motion.p variants={shouldReduce ? {} : fadeInUp} className="mt-3 text-gray-500 max-w-xl mx-auto">
              Real reviews from real customers who've made Lumière part of their
              everyday lives.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={shouldReduce ? {} : staggerContainer} className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (<motion.div
              key={t.name}
              variants={shouldReduce ? {} : fadeInUp}
              whileHover={
                shouldReduce ? {} : { y: -4, boxShadow: "0 16px 32px rgba(0,0,0,0.08)" }
              }
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col gap-4 transition-shadow">
              {/* Stars */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden flex-shrink-0">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.style.display = "none";
                    }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
                <span className="ml-auto text-xs text-indigo-600 font-medium text-right leading-tight max-w-[100px]">
                  {t.product}
                </span>
              </div>
            </motion.div>))}
          </motion.div>
        </div>
      </section>
      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-violet-950 via-indigo-900 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={shouldReduce ? {} : staggerContainer} className="flex flex-col items-center gap-6">
            <motion.div variants={shouldReduce ? {} : scaleIn} className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-amber-300" />
            </motion.div>
            <motion.h2 variants={shouldReduce ? {} : fadeInUp} className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Your next favourite
              <br />
              thing is waiting.
            </motion.h2>
            <motion.p variants={shouldReduce ? {} : fadeInUp} className="text-indigo-200 text-lg max-w-lg">
              Join over 120,000 customers who trust Lumière for premium products
              delivered with care, speed, and a smile.
            </motion.p>
            <motion.div variants={shouldReduce ? {} : fadeInUp} className="flex flex-wrap gap-3 justify-center">
              <motion.a href="#products" whileHover={shouldReduce ? {} : { scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl shadow-xl hover:bg-indigo-50 transition-colors text-base">
                Shop the Collection
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.div whileHover={shouldReduce ? {} : { scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/cart" className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm text-base">
                  <ShoppingCart className="w-5 h-5" />
                  View Cart
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}