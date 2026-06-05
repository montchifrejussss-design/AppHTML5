import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Play, RotateCcw, Copy, Check, Sliders, ExternalLink, Sparkles } from "lucide-react";
import { SemanticTag } from "../types";
import { playSound } from "../utils/audio";

interface CssPlaygroundProps {
  tag: SemanticTag;
  isDark: boolean;
}

export default function CssPlayground({ tag, isDark }: CssPlaygroundProps) {
  const propertyName = tag.name.toLowerCase().trim();

  // Determine standard default values for interactive previews based on the CSS property
  const getInitialValues = (prop: string) => {
    switch (prop) {
      case "display":
        return { value: "flex", itemsCount: 3 };
      case "flex-direction":
        return { value: "row", itemsCount: 3 };
      case "justify-content":
        return { value: "space-between", itemsCount: 3 };
      case "align-items":
        return { value: "center", itemsCount: 3 };
      case "flex-wrap":
        return { value: "nowrap", itemsCount: 6 };
      case "gap":
        return { value: "16px", itemsCount: 3 };
      case "background-color":
        return { value: "#4f46e5", itemsCount: 1 };
      case "color":
        return { value: "#ffffff", itemsCount: 1 };
      case "border-radius":
        return { value: "12px", itemsCount: 1 };
      case "padding":
        return { value: "16px", itemsCount: 1 };
      case "margin":
        return { value: "16px", itemsCount: 1 };
      case "font-size":
        return { value: "16px", itemsCount: 1 };
      case "box-shadow":
        return { value: "0px 10px 15px -3px rgba(0,0,0,0.1)", itemsCount: 1 };
      case "opacity":
        return { value: "1", itemsCount: 1 };
      case "transform":
        return { value: "scale(1)", itemsCount: 1 };
      case "transition":
        return { value: "all 0.3s ease", itemsCount: 1 };
      default:
        // Parse snippet to find a property value
        const matches = tag.codeSnippet.match(new RegExp(`${tag.name}\\s*:\\s*([^;]+);`));
        return { value: matches ? matches[1].trim() : "initial", itemsCount: 3 };
    }
  };

  const initial = getInitialValues(propertyName);
  const [currentValue, setCurrentValue] = useState<string>(initial.value);
  const [customCss, setCustomCss] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [demoItemsCount, setDemoItemsCount] = useState<number>(initial.itemsCount);

  // Sync state with selected tag
  useEffect(() => {
    const fresh = getInitialValues(propertyName);
    setCurrentValue(fresh.value);
    setDemoItemsCount(fresh.itemsCount);
    
    // Construct simplified CSS rules to display
    const rawClass = `.${propertyName}-demo {
  ${tag.name}: ${fresh.value};
}`;
    setCustomCss(rawClass);
  }, [tag]);

  const handleValueChange = (val: string) => {
    setCurrentValue(val);
    setCustomCss(`.${propertyName}-demo {
  ${tag.name}: ${val};
}`);
    playSound("ding");
  };

  const handleCustomCssChange = (val: string) => {
    setCustomCss(val);
    // Attempt basic extraction of property value
    const regex = new RegExp(`${tag.name}\\s*:\\s*([^;\\n\\}]+)`);
    const match = val.match(regex);
    if (match && match[1]) {
      setCurrentValue(match[1].trim());
    }
  };

  const handleReset = () => {
    const fresh = getInitialValues(propertyName);
    setCurrentValue(fresh.value);
    setDemoItemsCount(fresh.itemsCount);
    const rawClass = `.${propertyName}-demo {
  ${tag.name}: ${fresh.value};
}`;
    setCustomCss(rawClass);
    playSound("ding");
  };

  const handleCopyCss = () => {
    navigator.clipboard.writeText(customCss);
    setCopied(true);
    playSound("success");
    setTimeout(() => setCopied(false), 2000);
  };

  // Predefined controls depending on propertyName
  const renderControls = () => {
    switch (propertyName) {
      case "display":
        return (
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Valeurs courantes :</label>
            <div className="flex flex-wrap gap-1.5">
              {["flex", "grid", "block", "inline-block", "none"].map((val) => (
                <button
                  key={val}
                  onClick={() => handleValueChange(val)}
                  className={`px-2.5 py-1 text-xs font-mono rounded border transition-all cursor-pointer ${
                    currentValue === val
                      ? "bg-purple-600 text-white border-purple-600 font-bold"
                      : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-app-text hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-app-muted italic">Modifie l'agencement des 3 boîtes ci-dessous.</p>
          </div>
        );

      case "flex-direction":
        return (
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Axe principal :</label>
            <div className="flex flex-wrap gap-1.5">
              {["row", "column", "row-reverse", "column-reverse"].map((val) => (
                <button
                  key={val}
                  onClick={() => handleValueChange(val)}
                  className={`px-2.5 py-1 text-xs font-mono rounded border transition-all cursor-pointer ${
                    currentValue === val
                      ? "bg-purple-600 text-white border-purple-600 font-bold"
                      : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-app-text hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        );

      case "justify-content":
        return (
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Alignement Horizontal :</label>
            <div className="grid grid-cols-2 gap-1.5">
              {["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"].map((val) => (
                <button
                  key={val}
                  onClick={() => handleValueChange(val)}
                  className={`px-2 py-1 text-[11px] font-mono rounded border transition-all cursor-pointer text-left ${
                    currentValue === val
                      ? "bg-purple-600 text-white border-purple-600 font-bold"
                      : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-app-text hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        );

      case "align-items":
        return (
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Alignement Vertical :</label>
            <div className="flex flex-wrap gap-1.5">
              {["stretch", "center", "flex-start", "flex-end"].map((val) => (
                <button
                  key={val}
                  onClick={() => handleValueChange(val)}
                  className={`px-2.5 py-1 text-xs font-mono rounded border transition-all cursor-pointer ${
                    currentValue === val
                      ? "bg-purple-600 text-white border-purple-600 font-bold"
                      : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-app-text hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        );

      case "gap":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Espacement :</label>
              <span className="text-xs font-mono font-bold text-purple-600">{currentValue}</span>
            </div>
            <input
              type="range"
              min="0"
              max="48"
              step="4"
              value={parseInt(currentValue) || 0}
              onChange={(e) => handleValueChange(`${e.target.value}px`)}
              className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[9px] text-app-muted font-mono">
              <span>0px</span>
              <span>16px</span>
              <span>32px</span>
              <span>48px</span>
            </div>
          </div>
        );

      case "background-color":
        return (
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Couleur d'arrière-plan :</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={currentValue.startsWith("#") ? currentValue : "#4f46e5"}
                onChange={(e) => handleValueChange(e.target.value)}
                className="w-10 h-10 border border-slate-350 dark:border-slate-700 rounded cursor-pointer"
              />
              <div className="flex flex-wrap gap-1">
                {["#4f46e5", "#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#6b7280"].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleValueChange(color)}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      currentValue === color ? "ring-2 ring-purple-600 scale-110" : "border-white dark:border-slate-900"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case "color":
        return (
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Couleur du texte :</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={currentValue.startsWith("#") ? currentValue : "#ffffff"}
                onChange={(e) => handleValueChange(e.target.value)}
                className="w-10 h-10 border border-slate-350 dark:border-slate-700 rounded cursor-pointer"
              />
              <div className="flex flex-wrap gap-1">
                {["#ffffff", "#f8fafc", "#e2e8f0", "#a5f3fc", "#fef08a", "#fecdd3"].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleValueChange(color)}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      currentValue === color ? "ring-2 ring-purple-600 scale-110" : "border-gray-200 dark:border-slate-900"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case "border-radius":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Arrondi d'angle :</label>
              <span className="text-xs font-mono font-bold text-purple-600">{currentValue}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="2"
              value={parseInt(currentValue) || 0}
              onChange={(e) => handleValueChange(`${e.target.value}px`)}
              className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[9px] text-app-muted font-mono">
              <span>0px</span>
              <span>12px (Standard)</span>
              <span>24px</span>
              <span>50px (Cercle / Pilule)</span>
            </div>
          </div>
        );

      case "padding":
      case "margin":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">
                {propertyName === "padding" ? "Marge intérieure (Padding) :" : "Marge externe (Margin) :"}
              </label>
              <span className="text-xs font-mono font-bold text-purple-600">{currentValue}</span>
            </div>
            <input
              type="range"
              min="0"
              max="64"
              step="4"
              value={parseInt(currentValue) || 0}
              onChange={(e) => handleValueChange(`${e.target.value}px`)}
              className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[9px] text-app-muted font-mono">
              <span>0px</span>
              <span>16px</span>
              <span>32px</span>
              <span>64px</span>
            </div>
          </div>
        );

      case "font-size":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Taille de police :</label>
              <span className="text-xs font-mono font-bold text-purple-600">{currentValue}</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              step="1"
              value={parseInt(currentValue) || 16}
              onChange={(e) => handleValueChange(`${e.target.value}px`)}
              className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[9px] text-app-muted font-mono">
              <span>10px</span>
              <span>16px</span>
              <span>28px</span>
              <span>40px</span>
            </div>
          </div>
        );

      case "opacity":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Transparence (opacité) :</label>
              <span className="text-xs font-mono font-bold text-purple-600">{currentValue}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={parseFloat(currentValue) ?? 1}
              onChange={(e) => handleValueChange(e.target.value)}
              className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>
        );

      case "box-shadow":
        return (
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Intensité d'Ombre :</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { name: "Aucune", css: "none" },
                { name: "Légère", css: "0 1px 3px rgba(0,0,0,0.1)" },
                { name: "Moderne", css: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" },
                { name: "Fluorescente", css: "0 0 15px rgba(168,85,247,0.5)" }
              ].map((style) => (
                <button
                  key={style.name}
                  onClick={() => handleValueChange(style.css)}
                  className={`px-2.5 py-1.5 text-[11px] font-sans rounded border transition-all cursor-pointer ${
                    currentValue === style.css
                      ? "bg-purple-600 text-white border-purple-600 font-bold"
                      : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-app-text hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        // Generic Text input for any other non-modeled property
        return (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Valeur personnalisée :</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentValue}
                onChange={(e) => handleValueChange(e.target.value)}
                placeholder="Exemple: block, active, red, 1.2s..."
                className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-app-text font-mono"
              />
            </div>
            <p className="text-[10px] text-app-muted">Saisissez n'importe quelle valeur pour l'appliquer à l'aperçu.</p>
          </div>
        );
    }
  };

  // Build the active style block for the demo box container or elements
  const getDemoWrapStyle = (): React.CSSProperties => {
    const defaultWrapStyle: React.CSSProperties = {
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    };

    if (propertyName === "display") {
      if (currentValue === "flex") {
        return { ...defaultWrapStyle, display: "flex", gap: "12px", flexDirection: "row" };
      }
      if (currentValue === "grid") {
        return { ...defaultWrapStyle, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" };
      }
      if (currentValue === "none") {
        return { ...defaultWrapStyle, display: "none" };
      }
      if (currentValue === "inline-block") {
        return defaultWrapStyle; // will apply inline-block to children instead
      }
      return { ...defaultWrapStyle, display: currentValue as any };
    }

    if (propertyName === "flex-direction") {
      return { ...defaultWrapStyle, display: "flex", gap: "12px", flexDirection: currentValue as any };
    }

    if (propertyName === "justify-content") {
      return { ...defaultWrapStyle, display: "flex", gap: "12px", flexDirection: "row", justifyContent: currentValue };
    }

    if (propertyName === "align-items") {
      return { ...defaultWrapStyle, display: "flex", gap: "12px", height: "120px", alignItems: currentValue };
    }

    if (propertyName === "gap") {
      return { ...defaultWrapStyle, display: "flex", flexDirection: "row", gap: currentValue };
    }

    return defaultWrapStyle;
  };

  const getDemoItemStyle = (index: number): React.CSSProperties => {
    const baseItemStyle: React.CSSProperties = {
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    };

    // If display is inline-block and display is selected
    if (propertyName === "display" && currentValue === "inline-block") {
      return { ...baseItemStyle, display: "inline-block", margin: "4px" };
    }

    // Direct property assignments to each demo box
    if (propertyName === "background-color") {
      return { ...baseItemStyle, backgroundColor: currentValue };
    }

    if (propertyName === "color") {
      return { ...baseItemStyle, color: currentValue };
    }

    if (propertyName === "border-radius") {
      return { ...baseItemStyle, borderRadius: currentValue };
    }

    if (propertyName === "padding") {
      return { ...baseItemStyle, padding: currentValue };
    }

    if (propertyName === "margin") {
      return { ...baseItemStyle, margin: currentValue };
    }

    if (propertyName === "font-size") {
      return { ...baseItemStyle, fontSize: currentValue };
    }

    if (propertyName === "opacity") {
      return { ...baseItemStyle, opacity: parseFloat(currentValue) || 0 };
    }

    if (propertyName === "box-shadow") {
      return { ...baseItemStyle, boxShadow: currentValue };
    }

    if (propertyName === "transform") {
      return { ...baseItemStyle, transform: currentValue };
    }

    if (propertyName === "transition") {
      return { ...baseItemStyle, transition: currentValue };
    }

    // Fallback inline styles if not matched to active container
    if (
      propertyName !== "display" &&
      propertyName !== "flex-direction" &&
      propertyName !== "justify-content" &&
      propertyName !== "align-items" &&
      propertyName !== "gap"
    ) {
      return { ...baseItemStyle, [propertyName]: currentValue };
    }

    return baseItemStyle;
  };

  return (
    <div className="my-5 bg-slate-50 dark:bg-slate-900 border border-purple-100 dark:border-purple-950 rounded-xl overflow-hidden shadow-2xs">
      
      {/* Sandbox Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-950/30 dark:to-indigo-950/30 border-b border-purple-100 dark:border-purple-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-purple-600 animate-pulse" />
          <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase font-display tracking-tight">
            Bac à Sable CSS Interactif 🧪
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title="Réinitialiser l'aperçu"
            className="p-1 rounded hover:bg-purple-100 dark:hover:bg-slate-800 text-purple-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Side: Controller Inputs */}
        <div className="space-y-4">
          
          {/* Active Preset Controls */}
          <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-400 block">
              PROPRIÉTÉ : {tag.name}
            </span>
            {renderControls()}
          </div>

          {/* Quick Code Snippet Output / Code Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-app-muted uppercase font-sans">Code CSS généré :</span>
              <button
                onClick={handleCopyCss}
                className="text-[10px] flex items-center gap-1 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 px-2.5 py-0.5 rounded cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copié!" : "Copier le style"}</span>
              </button>
            </div>
            
            <textarea
              value={customCss}
              onChange={(e) => handleCustomCssChange(e.target.value)}
              rows={4}
              className="w-full text-xs font-mono p-2.5 bg-slate-900 text-purple-300 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed"
              placeholder=".demo-class { ... }"
            />
          </div>

        </div>

        {/* Right Side: Virtual Simulator Render Block */}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-app-muted uppercase block mb-1.5">Aperçu visuel instantané :</span>

          <div className="flex-1 min-h-[190px] border border-dashed border-purple-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 rounded-lg p-3.5 flex flex-col justify-between overflow-hidden relative">
            
            {/* Simulation Canvas Wrapper */}
            <div 
              style={getDemoWrapStyle()} 
              className="flex-1 w-full flex items-center justify-center rounded-md border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900/60 p-2.5 overflow-auto shadow-2xs"
            >
              {Array.from({ length: demoItemsCount }).map((_, idx) => (
                <div
                  key={idx}
                  style={getDemoItemStyle(idx)}
                  className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex flex-col justify-center items-center shadow-xs text-xs font-extrabold w-16 h-12 rounded-lg relative overflow-hidden"
                >
                  <span className="z-10 font-mono text-[10px]">#0{idx + 1}</span>
                  {/* Subtle decorative visual elements inside boxes */}
                  <span className="absolute bottom-0 inset-x-0 h-1 bg-white/20" />
                </div>
              ))}
              
              {demoItemsCount === 0 && (
                <div className="text-center text-[11px] text-app-muted py-8 italic w-full">
                  Aucun élément visible (display: none ou itemsCount nul)
                </div>
              )}
            </div>

            {/* Simulated environment footer bar */}
            <div className="mt-2.5 flex items-center justify-between text-[9px] text-app-muted font-mono border-t border-slate-100 dark:border-slate-800/80 pt-1.5 px-0.5">
              <span>Environnement virtuellisé</span>
              <div className="flex gap-2">
                <span>Items: {demoItemsCount}</span>
                <span className="text-purple-500">Live ✔</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
