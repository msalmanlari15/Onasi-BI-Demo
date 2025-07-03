import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { TableIcon, LayoutDashboard } from "lucide-react";

export function Sidebar({ className, tables, selectedTable, onTableSelect, onViewChange, currentView }) {
  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Views
          </h2>
          <div className="space-y-1">
            <Button 
              variant={currentView === 'dashboard' ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => onViewChange('dashboard')}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant={currentView === 'table' ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => onViewChange('table')}
            >
              <TableIcon className="mr-2 h-4 w-4" />
              Tables
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Database Tables
          </h2>
          <div className="space-y-1">
            {tables.map((table) => (
              <Button
                key={table}
                variant={selectedTable === table ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTableSelect(table)}
              >
                <TableIcon className="mr-2 h-4 w-4" />
                {table}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
