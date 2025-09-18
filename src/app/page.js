"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaTasks,
  FaFilter,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.landingMain}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              CacheNest
              <br></br>
              To-Do List Made Simple
            </h1>
            <p className={styles.heroSubtitle}>
              Organize your tasks effectively and boost your productivity with CacheNest.
            </p>
            <Link href="/signup" className={styles.ctaButton}>
              Get Started
            </Link>
          </div>
        </section>


        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>Features of CacheNest</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <FaTasks className={styles.featureIcon} />
              <h3>Task Management</h3>
              <p>
                Easily perform CRUD operations on your tasks.
              </p>
            </div>
            <div className={styles.featureCard}>
              <FaFilter className={styles.featureIcon} />
              <h3>Advanced Filtering</h3>
              <p>
                Filter tasks by category, priority, and completion status.
              </p>
            </div>
            <div className={styles.featureCard}>
              <FaCalendarAlt className={styles.featureIcon} />
              <h3>Google Calendar Sync</h3>
              <p>
                Connect your Google Calendar to
                automatically sync tasks with due dates.
                <br></br>
                <b>COMING SOON!</b>
              </p>
            </div>
            <div className={styles.featureCard}>
              <FaCheckCircle className={styles.featureIcon} />
              <h3>Stay Organized</h3>
              <p>
                Use categories and priorities to keep your tasks sorted.
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
