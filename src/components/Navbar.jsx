"use client";
import React, { useState, useEffect } from "react";
import styles from "@/app/page.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: "", username: "" });
  const [theme, setTheme] = useState("dark");


  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);

    document.body.classList.remove("dark", "light");
    document.body.classList.add(savedTheme);
  }, []);

  useEffect(() => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get("/api/users/userInfo");
        if (res.data?.user) {
          setUserInfo(res.data.user);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <div className={styles.logoContainer}>
          <img
            src="https://www.shutterstock.com/image-vector/check-list-icon-vector-symbol-600nw-2477440299.jpg"
            alt="CacheNest Logo"
            width={40}
            height={40}
            className={styles.logo}
          />
          <span className={styles.appName}>CacheNest</span>
        </div>
      </div>
      <div className={styles.navRight}>
        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "🔆" : "🌙"}
        </button>

        {isLoggedIn ? (
          <div className={styles.userSection}>
            <button
              className={`${styles.navButton} ${styles.logoutButton}`}
              onClick={async () => {
                await axios.delete("/api/users/userInfo");
                setIsLoggedIn(false);
                setUserInfo({ email: "", username: "" });
                router.push("/");
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className={styles.authButtons}>
            <a
              className={`${styles.navButton} ${styles.loginButton}`}
              href="/login"
            >
              Login
            </a>
            <a
              className={`${styles.navButton} ${styles.signupButton}`}
              href="/signup"
            >
              Sign Up
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}