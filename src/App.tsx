import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import {
  Menu,
  Map,
  Settings,
  Users,
  MessageSquare,
  Home,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Globe,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { translations, type Language } from "./translations";

// Sample polygons representing different zones
const polygons: {
  positions: LatLngExpression[][];
  color: string;
  name: string;
  layer: string;
}[] = [
  {
    positions: [
      [
        [48.8666, 2.3322],
        [48.8666, 2.3422],
        [48.8566, 2.3422],
        [48.8566, 2.3322],
      ],
    ],
    color: "#4F46E5",
    name: "zoneResidentielleA",
    layer: "couche1",
  },
  {
    positions: [
      [
        [48.8566, 2.3622],
        [48.8566, 2.3722],
        [48.8466, 2.3722],
        [48.8466, 2.3622],
      ],
    ],
    color: "#10B981",
    name: "zoneEcologique",
    layer: "couche1",
  },
  {
    positions: [
      [
        [48.8466, 2.3422],
        [48.8466, 2.3522],
        [48.8366, 2.3522],
        [48.8366, 2.3422],
      ],
    ],
    color: "#F59E0B",
    name: "zoneMixte",
    layer: "couche2",
  },
];

function App() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("map"); // Gère l'affichage (map ou accueil)
  const [activeLayers, setActiveLayers] = useState({
    couche1: true,
    couche2: true,
  });
  const [language, setLanguage] = useState<Language>("fr");
  const position: [number, number] = [48.8566, 2.3522]; // Paris coordinates
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  const toggleLayer = (layer: string) => {
    setActiveLayers((prevState) => ({
      ...prevState,
      [layer]: !prevState[layer],
    }));
  };
  const changeLanguage = () => {
    setLanguage((prevLang) => {
      switch (prevLang) {
        case "fr":
          return "en";
        case "en":
          return "ar";
        case "ar":
          return "fr";
        default:
          return "fr";
      }
    });
  };
  const t = translations[language];
  return (
    <div
      className={`flex h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-400 text-black"
      } ${language === "ar" ? "rtl" : "ltr"}`}
    >
      {/* Navigation Sidebar */}
      <div
        className={`${isNavOpen ? "w-64" : "w-20"} ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }  transition-all duration-300 ease-in-out relative z-50`}
      >
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className={`absolute -right-3 top-9 ${
            isDarkMode ? "bg-black" : "bg-gray-200"
          }
           rounded-full p-1 z-10`}
        >
          {isNavOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        <div className="p-4">
          <div className="flex items-center mb-8">
            <Menu className="h-8 w-8" />
            {isNavOpen && (
              <span className="ml-2 text-xl font-bold">{t.controlPanel}</span>
            )}
          </div>

          <nav>
            <NavItem
              icon={<Home />}
              text={t.home}
              isOpen={isNavOpen}
              onClick={() => setCurrentPage("home")}
            />
            <NavItem
              icon={<Map />}
              text={t.map}
              isOpen={isNavOpen}
              onClick={() => setCurrentPage("map")}
            />
            <NavItem icon={<Users />} text={t.users} isOpen={isNavOpen} />
            <NavItem
              icon={<MessageSquare />}
              text={t.messages}
              isOpen={isNavOpen}
            />
            <NavItem icon={<Settings />} text={t.settings} isOpen={isNavOpen} />
          </nav>
          <button
            onClick={toggleDarkMode}
            className={`absolute -left-1/5 bottom-4 p-2 rounded-full ${
              isDarkMode ? "bg-black text-white" : "bg-gray-200 text-black"
            }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {/* Bouton de sélection de la langue */}
          {isNavOpen && (
            <div className="absolute bottom-4 right-4">
              <div className="relative inline-block">
                <Globe
                  size={24}
                  className={`absolute left-3 top-2.5  ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                />
                <select
                  className={`pl-10 pr-4 py-2 border rounded-lg shadow-md ${
                    isDarkMode
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Title Bar */}
        {currentPage === "map" ? (
          <div
            className={`${
              isDarkMode
                ? "bg-gradient-to-r from-gray-800 via-black to-gray-800"
                : "bg-gradient-to-r from-white via-gray-200 to-white"
            } 
 shadow-lg p-6 rounded-b-2xl border-b-4 border-blue-700 flex items-center justify-center gap-3`}
          >
            <Map
              size={32}
              className={`${isDarkMode ? "text-blue-300" : "text-blue-700"}`}
            />
            <h1
              className={`text-3xl font-extrabold ${
                isDarkMode ? "text-white" : "text-black"
              } drop-shadow-lg`}
            >
              {t.title}
            </h1>
          </div>
        ) : null}

        {/* Map Container */}
        <div className="flex-1">
          {currentPage === "map" ? (
            <>
              <MapContainer
                center={position}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Render the polygons */}
                {polygons.map((polygon, index) =>
                  activeLayers[polygon.layer] ? (
                    <Polygon
                      key={index}
                      positions={polygon.positions}
                      pathOptions={{
                        fillColor: polygon.color,
                        fillOpacity: 0.3,
                        weight: 2,
                        color: polygon.color,
                        opacity: 0.7,
                      }}
                    >
                      <Popup>
                        <div className="font-semibold">{polygon.name}</div>
                      </Popup>
                    </Polygon>
                  ) : null
                )}
              </MapContainer>
              {/* Légende */}
              <div
                className={`absolute bottom-6 right-6 ${
                  isDarkMode ? "bg-gray-900" : "bg-white"
                }
 shadow-lg rounded-lg p-4 border border-gray-300`}
              >
                <h3
                  className={`font-bold ${
                    isDarkMode ? "text-blue-300" : "text-blue-700"
                  } mb-3 text-lg`}
                >
                  {t.legend}
                </h3>
                <ul>
                  {polygons.map((polygon, index) => (
                    <li key={index} className="flex items-center mb-2">
                      <span
                        className="w-4 h-4 inline-block rounded-full mr-2"
                        style={{ backgroundColor: polygon.color }}
                      ></span>
                      <span
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {t[polygon.name]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Fenêtre de Contrôle des Couches */}
              <div
                className={`absolute bottom-8 transition-all duration-300 ease-in-out ${
                  isNavOpen ? "left-72" : "left-24"
                } w-56 ${isDarkMode ? "bg-gray-900" : "bg-white"}
 p-4 rounded-lg shadow-lg z-10`}
              >
                <h3
                  className={`font-bold ${
                    isDarkMode ? "text-blue-300" : "text-blue-700"
                  } text-lg mb-4`}
                >
                  {t.selectLayer}
                </h3>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeLayers.couche1}
                      onChange={() => toggleLayer("couche1")}
                      className="mr-2"
                    />
                    <label
                      className={`${isDarkMode ? "text-white" : "text-black"}`}
                    >
                      {t.layer1}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeLayers.couche2}
                      onChange={() => toggleLayer("couche2")}
                      className="mr-2"
                    />
                    <label
                      className={`${isDarkMode ? "text-white" : "text-black"}`}
                    >
                      {t.layer2}
                    </label>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <h2 className="text-4xl font-bold text-blue-900">{t.hello}</h2>
          )}
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  isOpen: boolean;
  onClick?: () => void;
}

function NavItem({ icon, text, isOpen, onClick }: NavItemProps) {
  return (
    <div onClick={onClick}>
      <div className="flex items-center p-3 mb-2 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors">
        <div className="h-5 w-5">{icon}</div>
        {isOpen && <span className="ml-3">{text}</span>}
      </div>
    </div>
  );
}

export default App;
