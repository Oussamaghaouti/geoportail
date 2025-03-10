import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import amiriFont from "./amiri.tsx";
import {
  Users,
  HeartPulse,
  BookOpen,
  Languages,
  DollarSign,
  Building,
  PieChart,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Maximize2, Minimize2 } from "lucide-react";
import Loading from "./loading"; // Importez votre composant de chargement
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Popup,
  Marker,
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
  const [selectedPolygon, setSelectedPolygon] = useState<
    (typeof polygons)[number] | null
  >(null);
  const handlePolygonClick = (polygon: (typeof polygons)[number]) => {
    setSelectedPolygon(polygon);
  };

  useEffect(() => {
    // Simulez un temps de chargement minimum de 2 secondes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Nettoyez le timer pour éviter des effets secondaires
    return () => clearTimeout(timer);
  }, []);

  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    demographie: false,
    sante: false,
    education: false,
    langues: false,
    emploi: false,
    menages: false,
    economie: false,
    secac: false,
    cl_emp: false,
    creation: false,
  });
  const [currentPage, setCurrentPage] = useState("map"); // Gère l'affichage (map ou accueil)
  const [activeLayers, setActiveLayers] = useState({
    commune: false,
    province: false,
    region: false,
    routenationale: false,
    routeprovinciale: false,
    routeregionale: false,
  });
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const toggleFullscreen = () => {
    const element = document.getElementById("data-window");

    if (!isFullscreen) {
      if (element?.requestFullscreen) {
        element.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };
  const dataCategories = {
    demographie: [
      "pop2024",
      "pop2024 M",
      "pop2024 F",
      "%pop-15",
      "%pop-15 M",
      "%pop-15 F",
      "%pop15-59",
      "%p15-59 M",
      "%p15-59 F",
      "%pop+60",
      "%pop+60 M",
      "%pop+60 F",
      "%p celi+15",
      "%p ce+15 M",
      "%p ce+15 F",
      "%p mari+15",
      "%p mr+15 M",
      "%p mr+15 F",
      "%p div+15",
      "%p dv+15 M",
      "%p dv+15 F",
      "%p vf+15",
      "%p vf+15 M",
      "%p vf+15 F",
      "age 1r mar",
      "age 1r m M",
      "age 1r m F",
      "Parite 45-",
      "ISF",
    ],
    sante: ["%pre handi", "%pre han M", "%pre han F"],
    education: [
      "%ana10",
      "%ana10_M",
      "%ana10_F",
      "%ar",
      "%ar_M",
      "%ar_F",
      "%arfr",
      "%arfr_M",
      "%arfr_F",
      "%arfang",
      "%arfang_M",
      "%arfang_F",
      "%sco611",
      "%sco611_M",
      "%sco611_F",
      "%niv0",
      "%niv0_M",
      "%niv0_F",
      "%pre",
      "%pre_M",
      "%pre_F",
      "%pri",
      "%pri_M",
      "%pri_F",
      "%secC",
      "%secC_M",
      "%secC_F",
      "%secQ",
      "%secQ_M",
      "%secQ_F",
      "%sup",
      "%sup_M",
      "%sup_F",
    ],
    langues: [
      "%LM_ar",
      "%LM_ar_M",
      "%LM_ar_F",
      "%LM_am",
      "%LM_am_M",
      "%LM_am_F",
    ],
    emploi: [
      "%act15",
      "%act15_M",
      "%act15_F",
      "%chom",
      "%chom_M",
      "%chom_F",
      "%emp",
      "%emp_M",
      "%emp_F",
      "%ind",
      "%ind_M",
      "%ind_F",
      "%sal",
      "%sal_M",
      "%sal_F",
      "%aid",
      "%aid_M",
      "%aid_F",
      "%apr",
      "%apr_M",
      "%apr_F",
      "%ass",
      "%ass_M",
      "%ass_F",
    ],
    menages: [
      "Men_Nb",
      "Men_Tai",
      "Vil_%",
      "App_%",
      "MaiM_%",
      "MaiS_%",
      "LogR_%",
      "Occup_%",
      "Prop_%",
      "Loc_%",
      "Cuis_%",
      "WC_%",
      "Bain_%",
      "Eau_%",
      "Elec_%",
      "EauP_%",
      "EauF_%",
      "Log_10-%",
      "Log10_19",
      "Log20_49",
      "Log_50+",
    ],
    economie: ["EE_Tot", "EE_Pub", "EE_Ass", "EE_Sou", "EE_Luc", "EE_Empl"],
    secac: ["EE_Ind", "EE_Con", "EE_Com", "EE_Ser"],
    cl_emp: ["EE_E1", "EE_E2", "EE_E4", "EE_E10", "EE_E50"],
    creation: [
      "EE_1956",
      "EE_5680",
      "EE_8190",
      "EE_9100",
      "EE_0110",
      "EE_1119",
      "EE_20+",
    ],
  };
  const [language, setLanguage] = useState<Language>("fr");
  const position: [number, number] = [31.300779713704344, -4.78346132014275];
  const [isDarkMode, setIsDarkMode] = useState(true);
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
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  const generatePdfReport = (selectedPolygon: any, t: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.addFileToVFS("Amiri-Regular.ttf", amiriFont);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.setFont("Amiri");
    doc.setFontSize(24);
    doc.text(`${t.rapport}`, pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(20);
    doc.text(`${t.Commune} ${t[selectedPolygon.name]}`, pageWidth / 2, 40, {
      align: "center",
    });

    doc.setFontSize(16);
    doc.text(`${t.Demography}`, pageWidth / 2, 60, { align: "center" });
    let yOffset = 70;
    doc.setFontSize(12);
    dataCategories.demographie.forEach((key) => {
      doc.text(
        `${t[key as keyof typeof t]}: ${selectedPolygon[key]}`,
        pageWidth / 2,
        yOffset,
        { align: "center" }
      );
      yOffset += 10;
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });

    // Données de santé
    doc.setFontSize(16);
    doc.text(`${t.Health}`, pageWidth / 2, yOffset + 10, { align: "center" });
    yOffset += 20;
    doc.setFontSize(12);
    dataCategories.sante.forEach((key) => {
      doc.text(
        `${t[key as keyof typeof t]}: ${selectedPolygon[key]}`,
        pageWidth / 2,
        yOffset,
        { align: "center" }
      );
      yOffset += 10;
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });
    // Données de éducation
    doc.setFontSize(16);
    doc.text(`${t.education}`, pageWidth / 2, yOffset + 10, {
      align: "center",
    });
    yOffset += 20;
    doc.setFontSize(12);
    dataCategories.education.forEach((key) => {
      doc.text(
        `${t[key as keyof typeof t]}: ${selectedPolygon[key]}`,
        pageWidth / 2,
        yOffset,
        { align: "center" }
      );
      yOffset += 10;
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });
    // Données de langues
    doc.setFontSize(16);
    doc.text(`${t.langues}`, pageWidth / 2, yOffset + 10, { align: "center" });
    yOffset += 20;
    doc.setFontSize(12);
    dataCategories.langues.forEach((key) => {
      doc.text(
        `${t[key as keyof typeof t]}: ${selectedPolygon[key]}`,
        pageWidth / 2,
        yOffset,
        { align: "center" }
      );
      yOffset += 10;
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });
    // Données de menages
    doc.setFontSize(16);
    doc.text(`${t.menages}`, pageWidth / 2, yOffset + 10, { align: "center" });
    yOffset += 20;
    doc.setFontSize(12);
    dataCategories.menages.forEach((key) => {
      doc.text(
        `${t[key as keyof typeof t]}: ${selectedPolygon[key]}`,
        pageWidth / 2,
        yOffset,
        { align: "center" }
      );
      yOffset += 10;
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });
    // Données de economie
    doc.setFontSize(16);
    doc.text(`${t.economie}`, pageWidth / 2, yOffset + 10, { align: "center" });
    yOffset += 20;
    doc.setFontSize(12);
    dataCategories.economie.forEach((key) => {
      doc.text(
        `${t[key as keyof typeof t]}: ${selectedPolygon[key]}`,
        pageWidth / 2,
        yOffset,
        { align: "center" }
      );
      yOffset += 10;
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });
    // Données de serac
    doc.setFontSize(16);
    doc.text(`${t.secac}`, pageWidth / 2, yOffset + 10, { align: "center" });
    yOffset += 20;
    doc.setFontSize(12);
    dataCategories.secac.forEach((key) => {
      doc.text(
        `${t[key as keyof typeof t]}: ${selectedPolygon[key]}`,
        pageWidth / 2,
        yOffset,
        { align: "center" }
      );
      yOffset += 10;
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });
    // Données de cl_emp
    doc.setFontSize(16);
    doc.text(`${t.cl_emp}`, pageWidth / 2, yOffset + 10, { align: "center" });
    yOffset += 20;
    doc.setFontSize(12);
    dataCategories.cl_emp.forEach((key) => {
      doc.text(
        `${t[key as keyof typeof t]}: ${selectedPolygon[key]}`,
        pageWidth / 2,
        yOffset,
        { align: "center" }
      );
      yOffset += 10;
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });

    // Données de création
    doc.setFontSize(16);
    doc.text(`${t.creation}`, pageWidth / 2, yOffset + 10, { align: "center" });
    yOffset += 20;
    doc.setFontSize(12);
    dataCategories.creation.forEach((key) => {
      doc.text(
        `${t[key as keyof typeof t]}: ${selectedPolygon[key]}`,
        pageWidth / 2,
        yOffset,
        { align: "center" }
      );
      yOffset += 10;
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });

    // Sauvegarder le PDF
    doc.save(`rapport_recensement_${selectedPolygon.name}.pdf`);
  };
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
              className={`text-2xl font-extrabold ${
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
                      eventHandlers={{
                        click: () => handlePolygonClick(polygon),
                      }}
                      pathOptions={{
                        fillColor: polygon.color,
                        fillOpacity: 0.3,
                        weight: 2,
                        color: polygon.color,
                        opacity: 0.7,
                      }}
                    >
                      <Popup>
                        <div className="font-semibold">{t[polygon.name]}</div>
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
              <div
                className={`absolute top-24 transition-all duration-300 ease-in-out ${
                  isNavOpen ? "left-80" : "left-32"
                } ${
                  isExpanded
                    ? "top-24 w-96 h-[80vh] z-20"
                    : "top-24 w-72 max-h-56"
                } ${
                  isDarkMode
                    ? "bg-gray-900 scrollbar-dark"
                    : "bg-white scrollbar-light"
                } p-4 rounded-lg shadow-lg z-10 overflow-y-auto`}
              >
                {/* Bouton pour agrandir/réduire */}
                <button
                  onClick={toggleExpand}
                  className={`absolute top-2 right-2 p-1 rounded-full ${
                    isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-label={
                    isExpanded ? "Agrandir la fenêtre" : "Réduire la fenêtre"
                  }
                >
                  {isExpanded ? (
                    <Minimize2 className="w-5 h-5" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </button>
                <h3
                  className={`text-lg font-bold mb-4 ${
                    isDarkMode ? "text-blue-300" : "text-blue-700"
                  }`}
                >
                  {t.recens}
                </h3>
                {/* Bouton de téléchargement */}
                {selectedPolygon && (
                  <button
                    onClick={() => generatePdfReport(selectedPolygon, t)}
                    className={`absolute top-10 right-0 p-1 rounded-full ${
                      isDarkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Download className="w-5 h-5 mr-2" />{" "}
                    {/* Icône de téléchargement */}
                  </button>
                )}

                {!selectedPolygon ? (
                  <p
                    className={`italic ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t.promp}
                  </p>
                ) : (
                  <>
                    <h4 className="font-semibold text-lg mb-2">
                      {t[selectedPolygon.name]}
                    </h4>
                    {/* Section Démographie */}
                    <div className="border rounded-lg p-2 mb-3">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection("demographie")}
                      >
                        <div className="flex items-center">
                          <Users className="w-5 h-5 mr-2" />{" "}
                          {/* Icône pour Démographie */}
                          <h5 className="font-medium">{t.Demography}</h5>
                        </div>
                        <ChevronDownIcon
                          className={`w-5 h-5 transform transition-transform ${
                            expandedSections.demographie ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {expandedSections.demographie && (
                        <ul className="mt-2 space-y-2">
                          {dataCategories.demographie.map((key) => (
                            <li
                              key={key}
                              className={`flex justify-between ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              <span className="font-medium">
                                {t[key as keyof typeof t]}:
                              </span>
                              <span className="ml-4">
                                {typeof selectedPolygon[key] === "number"
                                  ? selectedPolygon[key].toLocaleString()
                                  : selectedPolygon[key]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Section Santé */}
                    <div className="border rounded-lg p-2 mb-3">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection("sante")}
                      >
                        <div className="flex items-center">
                          <HeartPulse className="w-5 h-5 mr-2" />{" "}
                          {/* Icône pour Santé */}
                          <h5 className="font-medium">{t.Health}</h5>
                        </div>
                        <ChevronDownIcon
                          className={`w-5 h-5 transform transition-transform ${
                            expandedSections.sante ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {expandedSections.sante && (
                        <ul className="mt-2 space-y-2">
                          {dataCategories.sante.map((key) => (
                            <li
                              key={key}
                              className={`flex justify-between ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              <span className="font-medium">
                                {t[key as keyof typeof t]}:
                              </span>
                              <span className="ml-4">
                                {typeof selectedPolygon[key] === "number"
                                  ? selectedPolygon[key].toLocaleString()
                                  : selectedPolygon[key]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Section Éducation */}
                    <div className="border rounded-lg p-2 mb-3">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection("education")}
                      >
                        <div className="flex items-center">
                          <BookOpen className="w-5 h-5 mr-2" />{" "}
                          {/* Icône pour education */}
                          <h5 className="font-medium">{t.education}</h5>
                        </div>
                        <ChevronDownIcon
                          className={`w-5 h-5 transform transition-transform ${
                            expandedSections.education ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {expandedSections.education && (
                        <ul className="mt-2 space-y-2">
                          {dataCategories.education.map((key) => (
                            <li
                              key={key}
                              className={`flex justify-between ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              <span className="font-medium">
                                {t[key as keyof typeof t]}:
                              </span>
                              <span className="ml-4">
                                {typeof selectedPolygon[key] === "number"
                                  ? selectedPolygon[key].toLocaleString()
                                  : selectedPolygon[key]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Section langues */}
                    <div className="border rounded-lg p-2 mb-3">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection("langues")}
                      >
                        <div className="flex items-center">
                          <Languages className="w-5 h-5 mr-2" />{" "}
                          {/* Icône pour langues */}
                          <h5 className="font-medium">{t.langues}</h5>
                        </div>
                        <ChevronDownIcon
                          className={`w-5 h-5 transform transition-transform ${
                            expandedSections.langues ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {expandedSections.langues && (
                        <ul className="mt-2 space-y-2">
                          {dataCategories.langues.map((key) => (
                            <li
                              key={key}
                              className={`flex justify-between ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              <span className="font-medium">
                                {t[key as keyof typeof t]}:
                              </span>
                              <span className="ml-4">
                                {typeof selectedPolygon[key] === "number"
                                  ? selectedPolygon[key].toLocaleString()
                                  : selectedPolygon[key]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Section emploi */}
                    <div className="border rounded-lg p-2 mb-3">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection("emploi")}
                      >
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 mr-2" />{" "}
                          {/* Icône pour emploi */}
                          <h5 className="font-medium">{t.emploi}</h5>
                        </div>
                        <ChevronDownIcon
                          className={`w-5 h-5 transform transition-transform ${
                            expandedSections.emploi ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {expandedSections.emploi && (
                        <ul className="mt-2 space-y-2">
                          {dataCategories.emploi.map((key) => (
                            <li
                              key={key}
                              className={`flex justify-between ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              <span className="font-medium">
                                {t[key as keyof typeof t]}:
                              </span>
                              <span className="ml-4">
                                {typeof selectedPolygon[key] === "number"
                                  ? selectedPolygon[key].toLocaleString()
                                  : selectedPolygon[key]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Section menages */}
                    <div className="border rounded-lg p-2 mb-3">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection("menages")}
                      >
                        <div className="flex items-center">
                          <Home className="w-5 h-5 mr-2" />{" "}
                          {/* Icône pour meanges */}
                          <h5 className="font-medium">{t.menages}</h5>
                        </div>
                        <ChevronDownIcon
                          className={`w-5 h-5 transform transition-transform ${
                            expandedSections.menages ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {expandedSections.menages && (
                        <ul className="mt-2 space-y-2">
                          {dataCategories.menages.map((key) => (
                            <li
                              key={key}
                              className={`flex justify-between ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              <span className="font-medium">
                                {t[key as keyof typeof t]}:
                              </span>
                              <span className="ml-4">
                                {typeof selectedPolygon[key] === "number"
                                  ? selectedPolygon[key].toLocaleString()
                                  : selectedPolygon[key]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Section economie */}
                    <div className="border rounded-lg p-2 mb-3">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection("economie")}
                      >
                        <div className="flex items-center">
                          <Building className="w-5 h-5 mr-2" />{" "}
                          {/* Icône pour economie */}
                          <h5 className="font-medium">{t.economie}</h5>
                        </div>
                        <ChevronDownIcon
                          className={`w-5 h-5 transform transition-transform ${
                            expandedSections.economie ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {expandedSections.economie && (
                        <ul className="mt-2 space-y-2">
                          {dataCategories.economie.map((key) => (
                            <li
                              key={key}
                              className={`flex justify-between ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              <span className="font-medium">
                                {t[key as keyof typeof t]}:
                              </span>
                              <span className="ml-4">
                                {typeof selectedPolygon[key] === "number"
                                  ? selectedPolygon[key].toLocaleString()
                                  : selectedPolygon[key]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Section secac */}
                    <div className="border rounded-lg p-2 mb-3">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection("secac")}
                      >
                        <div className="flex items-center">
                          <PieChart className="w-5 h-5 mr-2" />{" "}
                          {/* Icône pour secac */}
                          <h5 className="font-medium">{t.secac}</h5>
                        </div>
                        <ChevronDownIcon
                          className={`w-5 h-5 transform transition-transform ${
                            expandedSections.secac ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {expandedSections.secac && (
                        <ul className="mt-2 space-y-2">
                          {dataCategories.secac.map((key) => (
                            <li
                              key={key}
                              className={`flex justify-between ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              <span className="font-medium">
                                {t[key as keyof typeof t]}:
                              </span>
                              <span className="ml-4">
                                {typeof selectedPolygon[key] === "number"
                                  ? selectedPolygon[key].toLocaleString()
                                  : selectedPolygon[key]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Section cl_emp */}
                    <div className="border rounded-lg p-2 mb-3">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection("cl_emp")}
                      >
                        <div className="flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2" />{" "}
                          {/* Icône pour cl_emp */}
                          <h5 className="font-medium">{t.cl_emp}</h5>
                        </div>
                        <ChevronDownIcon
                          className={`w-5 h-5 transform transition-transform ${
                            expandedSections.cl_emp ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {expandedSections.cl_emp && (
                        <ul className="mt-2 space-y-2">
                          {dataCategories.cl_emp.map((key) => (
                            <li
                              key={key}
                              className={`flex justify-between ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              <span className="font-medium">
                                {t[key as keyof typeof t]}:
                              </span>
                              <span className="ml-4">
                                {typeof selectedPolygon[key] === "number"
                                  ? selectedPolygon[key].toLocaleString()
                                  : selectedPolygon[key]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Section creation */}
                    <div className="border rounded-lg p-2 mb-3">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection("creation")}
                      >
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 mr-2" />{" "}
                          {/* Icône pour creation */}
                          <h5 className="font-medium">{t.creation}</h5>
                        </div>
                        <ChevronDownIcon
                          className={`w-5 h-5 transform transition-transform ${
                            expandedSections.creation ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {expandedSections.creation && (
                        <ul className="mt-2 space-y-2">
                          {dataCategories.creation.map((key) => (
                            <li
                              key={key}
                              className={`flex justify-between ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              <span className="font-medium">
                                {t[key as keyof typeof t]}:
                              </span>
                              <span className="ml-4">
                                {typeof selectedPolygon[key] === "number"
                                  ? selectedPolygon[key].toLocaleString()
                                  : selectedPolygon[key]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>
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
 p-4 rounded-lg shadow-lg z-10 max-h-56 overflow-y-auto`}
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
