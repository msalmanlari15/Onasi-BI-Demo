import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  TableIcon,
  DollarSign
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function AdvancedSidebar({ 
  className, 
  tables = [], 
  selectedTable, 
  onTableSelect, 
  onViewChange, 
  currentView,
  onCollapseChange
}) {
  const [collapsed, setCollapsed] = useState(true);
  const [activeCategory, setActiveCategory] = useState("dashboard");
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const toggleCollapse = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

  const handleCategoryClick = (category) => {
    if (category === "dashboard") {
      onViewChange("dashboard");
    } else if (category === "revenue-cycle") {
      onViewChange("revenue-cycle");
      setActiveCategory(category);
    } else if (category === "tables") {
      setActiveCategory(category);
    } else {
      setActiveCategory(category);
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <h2 className="text-lg font-semibold">Healthcare BI</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className={cn("ml-auto", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {/* Dashboard main button */}
          <Button
            variant={activeCategory === "dashboard" ? "secondary" : "ghost"}
            className={cn(
              "flex items-center justify-start h-10",
              collapsed && "justify-center px-0"
            )}
            onClick={() => {
              setDashboardOpen((prev) => !prev);
              setActiveCategory("dashboard");
            }}
          >
            <LayoutDashboard className={cn("h-4 w-4", collapsed ? "mx-auto" : "mr-2")} />
            {!collapsed && <span>Dashboard</span>}
            {!collapsed && (
              <span className="ml-auto">{dashboardOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}</span>
            )}
          </Button>

          {/* Nested Revenue Cycle under Dashboard */}
          {dashboardOpen && !collapsed && (
            <Button
              variant={activeCategory === "revenue-cycle" ? "secondary" : "ghost"}
              className={cn(
                "flex items-center justify-start h-10 ml-6 border-l-2 border-sidebar-border",
                collapsed && "justify-center px-0"
              )}
              onClick={() => handleCategoryClick("revenue-cycle")}
            >
              <DollarSign className={cn("h-4 w-4", collapsed ? "mx-auto" : "mr-2")} />
              <span>Revenue Cycle</span>
            </Button>
          )}

          {/* Tables button */}
          <Button
            variant={activeCategory === "tables" ? "secondary" : "ghost"}
            className={cn(
              "flex items-center justify-start h-10",
              collapsed && "justify-center px-0"
            )}
            onClick={() => handleCategoryClick("tables")}
          >
            <TableIcon className={cn("h-4 w-4", collapsed ? "mx-auto" : "mr-2")} />
            {!collapsed && <span>Tables</span>}
          </Button>
        </nav>

        {/* Database tables submenu */}
        {activeCategory === "tables" && !collapsed && (
          <div className="mt-2 pl-6 pr-2 space-y-1">
            <p className="text-xs text-muted-foreground mb-2 px-2">Database Tables</p>
            {tables.map((table) => (
              <Button
                key={table}
                variant={selectedTable === table ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start text-xs h-8"
                onClick={() => {
                  onTableSelect(table);
                  onViewChange("table");
                }}
              >
                {table}
              </Button>
            ))}
            {tables.length === 0 && (
              <p className="text-xs text-muted-foreground px-2">No tables available</p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border">
        <div className="flex flex-col gap-1">
          <ThemeToggle collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
}
