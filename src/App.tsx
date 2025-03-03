import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Loading from "./loading"; // Importez votre composant de chargement
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Popup,
} from "react-leaflet";
import {
  Menu,
  Map,
  Home,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Globe,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { translations, type Language } from "./translations";
import { polygons, polylines } from "./data.tsx";
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulez un temps de chargement minimum de 2 secondes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Nettoyez le timer pour éviter des effets secondaires
    return () => clearTimeout(timer);
  }, []);

  // Si la page est en cours de chargement, affichez le composant Loading

  const [isNavOpen, setIsNavOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("map"); // Gère l'affichage (map ou accueil)
  const [activeLayers, setActiveLayers] = useState({
    commune: false,
    province: false,
    region: false,
    routenationale: false,
    routeprovinciale: false,
    routeregionale: false,
  });
  const [language, setLanguage] = useState<Language>("fr");
  const position: [number, number] = [31.300779713704344, -4.78346132014275];
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
  const layers: {
    color: string;
    layer: string;
    type: string;
  }[] = [
    {
      color: "blue",
      layer: "commune",
      type: "polygone",
    },
    {
      color: "red",
      layer: "province",
      type: "polygone",
    },
    {
      color: "green",
      layer: "region",
      type: "polygone",
    },
    {
      color: "#ffff00",
      layer: "routenationale",
      type: "polyline",
    },
    {
      color: "#333333",
      layer: "routeregionale",
      type: "polyline",
    },
    {
      color: "#FF6600",
      layer: "routeprovinciale",
      type: "polyline",
    },
  ];
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
  const [isAdminExpanded, setIsAdminExpanded] = useState(false);
  const [isRoadExpanded, setIsRoadExpanded] = useState(false);
  if (isLoading) {
    return <Loading />;
  }

  // Sinon, affichez la page principale
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
                zoom={7}
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
                {polylines.map((polyline, index) =>
                  activeLayers[polyline.layer] ? (
                    <Polyline
                      key={index}
                      positions={polyline.positions}
                      pathOptions={{
                        fillColor: polyline.color,
                        fillOpacity: 0.3,
                        weight: 2,
                        color: polyline.color,
                        opacity: 0.7,
                      }}
                    >
                      <Popup>
                        <div className="font-semibold">{polyline.name}</div>
                      </Popup>
                    </Polyline>
                  ) : null
                )}
              </MapContainer>
              {/* Légende */}
              <div
                className={`absolute bottom-6 right-6 ${
                  isDarkMode
                    ? "bg-gray-900 scrollbar-dark"
                    : "bg-white scrollbar-light"
                }
 shadow-lg rounded-lg p-4 border border-gray-300 max-h-64 overflow-y-auto`}
              >
                <h3
                  className={`font-bold ${
                    isDarkMode ? "text-blue-300" : "text-blue-700"
                  } mb-3 text-lg`}
                >
                  {t.legend}
                </h3>
                <ul>
                  {layers.map((item, index) => (
                    <li key={index} className="flex items-center mb-2">
                      {/* Forme conditionnelle */}
                      {item.type === "polygone" && (
                        <span
                          className="w-4 h-4 inline-block mr-2"
                          style={{ backgroundColor: item.color }}
                        ></span>
                      )}
                      {item.type === "polyline" && (
                        <div
                          className="w-4 h-1 inline-block mr-2"
                          style={{
                            backgroundColor: item.color,
                            transform: "translateY(50%)",
                          }}
                        ></div>
                      )}
                      {item.type === "point" && (
                        <span
                          className="w-4 h-4 rounded-full inline-block mr-2"
                          style={{ backgroundColor: item.color }}
                        ></span>
                      )}

                      <span
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {t[item.layer]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Fenêtre de Contrôle des Couches */}
              <div
                className={`absolute bottom-8 transition-all duration-300 ease-in-out ${
                  isNavOpen ? "left-72" : "left-24"
                } w-56 ${
                  isDarkMode
                    ? "bg-gray-900 scrollbar-dark"
                    : "bg-white scrollbar-light"
                }
 p-4 rounded-lg shadow-lg z-10 max-h-72 overflow-y-auto`}
              >
                <h3
                  className={`font-bold ${
                    isDarkMode ? "text-blue-300" : "text-blue-700"
                  } text-lg mb-4`}
                >
                  {t.selectLayer}
                </h3>
                {/* Groupe Découpage Administratif */}
                <div className="border rounded-lg p-2 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          activeLayers.region &&
                          activeLayers.province &&
                          activeLayers.commune
                        }
                        onChange={() => {
                          const newState = !(
                            activeLayers.region &&
                            activeLayers.province &&
                            activeLayers.commune
                          );
                          setActiveLayers({
                            ...activeLayers,
                            region: newState,
                            province: newState,
                            commune: newState,
                          });
                        }}
                        className="mr-2"
                      />
                      <button
                        onClick={() => setIsAdminExpanded(!isAdminExpanded)}
                        className={`font-medium ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {t.DA}
                      </button>
                    </div>
                    <ChevronDownIcon
                      onClick={() => setIsAdminExpanded(!isAdminExpanded)}
                      className={`w-5 h-5 transform transition-transform ${
                        isAdminExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isAdminExpanded && (
                    <div className="ml-4 mt-2 space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={activeLayers.region}
                          onChange={() => toggleLayer("region")}
                          className="mr-2"
                        />
                        <label
                          className={`${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          {t.layer1}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={activeLayers.province}
                          onChange={() => toggleLayer("province")}
                          className="mr-2"
                        />
                        <label
                          className={`${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          {t.layer2}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={activeLayers.commune}
                          onChange={() => toggleLayer("commune")}
                          className="mr-2"
                        />
                        <label
                          className={`${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          {t.layer3}
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Groupe Réseau Routier */}
                <div className="border rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          activeLayers.routenationale &&
                          activeLayers.routeregionale &&
                          activeLayers.routeprovinciale
                        }
                        onChange={() => {
                          const newState = !(
                            activeLayers.routenationale &&
                            activeLayers.routeregionale &&
                            activeLayers.routeprovinciale
                          );
                          setActiveLayers({
                            ...activeLayers,
                            routenationale: newState,
                            routeregionale: newState,
                            routeprovinciale: newState,
                          });
                        }}
                        className="mr-2"
                      />
                      <button
                        onClick={() => setIsRoadExpanded(!isRoadExpanded)}
                        className={`font-medium ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {t.RR}
                      </button>
                    </div>
                    <ChevronDownIcon
                      onClick={() => setIsRoadExpanded(!isRoadExpanded)}
                      className={`w-5 h-5 transform transition-transform ${
                        isRoadExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isRoadExpanded && (
                    <div className="ml-4 mt-2 space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={activeLayers.routenationale}
                          onChange={() => toggleLayer("routenationale")}
                          className="mr-2"
                        />
                        <label
                          className={`${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          {t.layer4}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={activeLayers.routeregionale}
                          onChange={() => toggleLayer("routeregionale")}
                          className="mr-2"
                        />
                        <label
                          className={`${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          {t.layer6}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={activeLayers.routeprovinciale}
                          onChange={() => toggleLayer("routeprovinciale")}
                          className="mr-2"
                        />
                        <label
                          className={`${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          {t.layer5}
                        </label>
                      </div>
                    </div>
                  )}
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
};

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
