import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

export function ThemeToggle({ className, collapsed }) {
  const [theme, setTheme] = useState("light");

  // On component mount, get the theme from localStorage or use default
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    
    // Apply theme to document
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Apply theme to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <Button
      variant="ghost"
      className={cn("flex items-center justify-start h-10", 
        collapsed && "justify-center px-0",
        className
      )}
      onClick={toggleTheme}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === "light" ? (
        <Moon className={cn("h-4 w-4", collapsed ? "mx-auto" : "mr-2")} />
      ) : (
        <Sun className={cn("h-4 w-4", collapsed ? "mx-auto" : "mr-2")} />
      )}
      {!collapsed && <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>}
    </Button>
  );
}
