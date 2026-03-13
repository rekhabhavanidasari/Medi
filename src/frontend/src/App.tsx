/* eslint-disable */
// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from "react";

declare const L: any;

const MEDICINES = [
  "Paracetamol",
  "Ibuprofen",
  "Amoxicillin",
  "Azithromycin",
  "Metformin",
  "Atorvastatin",
  "Omeprazole",
  "Clopidogrel",
  "Losartan",
  "Amlodipine",
  "Cetirizine",
  "Pantoprazole",
  "Ciprofloxacin",
  "Doxycycline",
  "Fluconazole",
  "Hydroxychloroquine",
  "Ivermectin",
  "Montelukast",
  "Salbutamol",
  "Insulin",
  "Lisinopril",
  "Aspirin",
  "Ranitidine",
  "Metronidazole",
  "Clonazepam",
  "Diclofenac",
  "Gabapentin",
  "Pregabalin",
  "Sertraline",
  "Alprazolam",
  "Vitamin D3",
  "Calcium Carbonate",
  "Iron Sulfate",
  "Folic Acid",
  "Vitamin B12",
  "Cough Syrup",
  "ORS Sachet",
  "Antacid",
  "Antihistamine",
  "Eye Drops",
];

const PHARMACY_NAMES = [
  "Apollo Pharmacy",
  "MedPlus",
  "Netmeds Express",
  "98point6 Health",
  "Wellness Forever",
  "Frank Ross Pharma",
  "Sai Medicals",
  "Rama Medical",
  "Sri Balaji Pharmacy",
  "Green Cross Medical",
  "LifeCare Pharmacy",
  "Star Health Pharmacy",
  "Care & Cure Medicals",
  "Vijaya Medical",
  "Raj Medicals",
];

const HOSPITAL_NAMES = [
  "KIMS Hospital",
  "Apollo Hospitals",
  "Yashoda Hospital",
  "Care Hospital",
  "Medicover Hospital",
  "Continental Hospital",
  "AIG Hospitals",
  "Sunshine Hospital",
  "Rainbow Hospital",
  "MaxCure Hospital",
];

const HOSPITAL_TYPES = [
  "Multi-Specialty",
  "General Hospital",
  "Trauma Center",
  "Children's Hospital",
  "Super-Specialty",
];

const AREAS = [
  "Banjara Hills",
  "Jubilee Hills",
  "Hitech City",
  "Madhapur",
  "Gachibowli",
  "Kukatpally",
  "Dilsukhnagar",
  "LB Nagar",
  "Secunderabad",
  "Begumpet",
  "Ameerpet",
  "SR Nagar",
  "Miyapur",
  "Kondapur",
  "Manikonda",
];

function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function generatePharmacies(baseLat: number, baseLng: number) {
  const count = Math.floor(Math.random() * 6) + 5;
  const used = new Set<string>();
  const result = [];
  for (let i = 0; i < count; i++) {
    let name: string;
    do {
      name = PHARMACY_NAMES[Math.floor(Math.random() * PHARMACY_NAMES.length)];
    } while (used.has(name));
    used.add(name);
    const area = AREAS[Math.floor(Math.random() * AREAS.length)];
    const available = Math.random() > 0.3;
    const lat = baseLat + (Math.random() - 0.5) * 0.12;
    const lng = baseLng + (Math.random() - 0.5) * 0.12;
    const dist = Math.round(haversine(baseLat, baseLng, lat, lng) * 10) / 10;
    result.push({
      id: i,
      name,
      area,
      address: `${Math.floor(Math.random() * 200) + 1}, ${area} Main Road, Hyderabad`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      lat,
      lng,
      dist,
      available,
      stock: available ? Math.floor(Math.random() * 80) + 5 : 0,
      hours: "8:00 AM – 10:00 PM",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    });
  }
  return result.sort((a, b) => a.dist - b.dist);
}

function generateHospitals(baseLat: number, baseLng: number) {
  return HOSPITAL_NAMES.map((name, i) => {
    const area = AREAS[Math.floor(Math.random() * AREAS.length)];
    const lat = baseLat + (Math.random() - 0.5) * 0.16;
    const lng = baseLng + (Math.random() - 0.5) * 0.16;
    const dist = Math.round(haversine(baseLat, baseLng, lat, lng) * 10) / 10;
    const isOpen = Math.random() > 0.3;
    return {
      id: i,
      name,
      area,
      address: `${Math.floor(Math.random() * 200) + 1}, ${area}, Hyderabad`,
      phone: `+91 40-${Math.floor(Math.random() * 90000000) + 10000000}`,
      lat,
      lng,
      dist,
      isOpen,
      type: HOSPITAL_TYPES[Math.floor(Math.random() * HOSPITAL_TYPES.length)],
    };
  }).sort((a, b) => a.dist - b.dist);
}

export default function App() {
  const [userLat, setUserLat] = useState(17.385);
  const [userLng, setUserLng] = useState(78.4867);
  const [locText, setLocText] = useState("Hyderabad, Telangana, India");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allResults, setAllResults] = useState<any[]>([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [panelTitle, setPanelTitle] = useState("Nearby Pharmacies");
  const [resultCount, setResultCount] = useState("0 results");
  const [statPharm, setStatPharm] = useState("248");
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [regSuccessScreen, setRegSuccessScreen] = useState(false);
  const [regIdBadge, setRegIdBadge] = useState("");
  const [showEmergency, setShowEmergency] = useState(false);
  const [hospitals, setHospitals] = useState<any[]>([]);
  // Auth
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginEmailErr, setLoginEmailErr] = useState(false);
  const [loginPwErr, setLoginPwErr] = useState(false);
  // Register account
  const [regFullname, setRegFullname] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regPw, setRegPw] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [regTerms, setRegTerms] = useState(false);
  const [selectedRole, setSelectedRole] = useState("owner");
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [regFullnameErr, setRegFullnameErr] = useState(false);
  const [regEmailErr, setRegEmailErr] = useState(false);
  const [regMobileErr, setRegMobileErr] = useState(false);
  const [regPwErr, setRegPwErr] = useState(false);
  const [regTermsErr, setRegTermsErr] = useState(false);
  const [pwScore, setPwScore] = useState(0);
  // Pharmacy reg form
  const [regName, setRegName] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regHours, setRegHours] = useState("");
  const [regLicense, setRegLicense] = useState("");
  const [regOwner, setRegOwner] = useState("");
  const [regLat, setRegLat] = useState("");
  const [regLng, setRegLng] = useState("");
  const [regDist, setRegDist] = useState("");
  const [regArea, setRegArea] = useState("");
  const [regNotes, setRegNotes] = useState("");
  const [availTags, setAvailTags] = useState<string[]>([]);
  const [lowTags, setLowTags] = useState<string[]>([]);
  const [outTags, setOutTags] = useState<string[]>([]);
  const [availInput, setAvailInput] = useState("");
  const [lowInput, setLowInput] = useState("");
  const [outInput, setOutInput] = useState("");
  const [regNameErr, setRegNameErr] = useState(false);
  const [regAddressErr, setRegAddressErr] = useState(false);
  const [regLatErr, setRegLatErr] = useState(false);
  const [regLngErr, setRegLngErr] = useState(false);
  const [regDistErr, setRegDistErr] = useState(false);
  const [regAvailErr, setRegAvailErr] = useState(false);
  const [regSubmittingPharm, setRegSubmittingPharm] = useState(false);
  // Route
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [emergencyRoute, setEmergencyRoute] = useState<any>(null);
  // Camera
  const [showCamModal, setShowCamModal] = useState(false);
  const [camStatus, setCamStatus] = useState("");
  // Mic
  const [micActive, setMicActive] = useState(false);
  const [showMicWave, setShowMicWave] = useState(false);

  // Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const pharmacyMarkersRef = useRef<any[]>([]);
  const routeLayerRef = useRef<any>(null);
  const emergencyMapContainerRef = useRef<HTMLDivElement>(null);
  const emergencyMapRef = useRef<any>(null);
  const emergencyRouteRef = useRef<any>(null);
  const miniMapContainerRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<any>(null);
  const miniMarkerRef = useRef<any>(null);
  const camStreamRef = useRef<MediaStream | null>(null);
  const camVideoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const navAddWrapRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<any>(null);
  const pharmacyDataRef = useRef<Record<number, any>>({});

  // Toast
  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setShowToast(false), 2800);
  }, []);

  // Init main map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
      }).setView([17.385, 78.4867], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(mapRef.current);
      placeUserMarker(17.385, 78.4867);
    }
    return () => {};
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        navAddWrapRef.current &&
        !navAddWrapRef.current.contains(e.target as Node)
      ) {
        setShowAddDropdown(false);
      }
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Emergency map
  useEffect(() => {
    if (showEmergency) {
      const hosp = generateHospitals(userLat, userLng);
      setHospitals(hosp);
      setTimeout(() => {
        if (emergencyMapContainerRef.current && !emergencyMapRef.current) {
          try {
            emergencyMapRef.current = L.map(
              emergencyMapContainerRef.current,
            ).setView([userLat, userLng], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "© OpenStreetMap",
              maxZoom: 19,
            }).addTo(emergencyMapRef.current);
            // User marker
            const uIcon = L.divIcon({
              className: "",
              html: `<div style="width:16px;height:16px;background:#1a6fc4;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(26,111,196,0.5)"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            });
            L.marker([userLat, userLng], { icon: uIcon })
              .bindPopup("<b>📍 Your Location</b>")
              .addTo(emergencyMapRef.current);
            // Hospital markers
            const bounds = [[userLat, userLng]];
            hosp.forEach((h) => {
              const color = h.isOpen ? "#1db87e" : "#e83b3b";
              const icon = L.divIcon({
                className: "",
                html: `<div style="background:${color};color:white;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:800;font-family:Nunito,sans-serif;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2);border:2px solid white">${h.isOpen ? "🏥" : "✕"} ${h.name.split(" ")[0]}</div>`,
                iconAnchor: [0, 0],
              });
              L.marker([h.lat, h.lng], { icon })
                .bindPopup(
                  `<b>${h.name}</b><br>${h.area}<br><span style="color:${color};font-weight:700">${h.isOpen ? "● Open Now" : "✕ Closed"}</span>`,
                )
                .addTo(emergencyMapRef.current);
              bounds.push([h.lat, h.lng]);
            });
            emergencyMapRef.current.fitBounds(bounds, { padding: [30, 30] });
          } catch (e) {
            console.warn(e);
          }
        }
      }, 150);
    } else {
      if (emergencyMapRef.current) {
        emergencyMapRef.current.remove();
        emergencyMapRef.current = null;
      }
      setEmergencyRoute(null);
    }
  }, [showEmergency]);

  // Mini map for pharmacy reg
  useEffect(() => {
    if (showRegModal && regStep === 2) {
      setTimeout(() => {
        if (miniMapContainerRef.current && !miniMapRef.current) {
          try {
            const lat = Number.parseFloat(regLat) || userLat;
            const lng = Number.parseFloat(regLng) || userLng;
            miniMapRef.current = L.map(miniMapContainerRef.current).setView(
              [lat, lng],
              14,
            );
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "© OpenStreetMap",
              maxZoom: 19,
            }).addTo(miniMapRef.current);
            placeMiniMarker(lat, lng);
            miniMapRef.current.on("click", (e: any) => {
              placeMiniMarker(e.latlng.lat, e.latlng.lng);
              setRegLat(e.latlng.lat.toFixed(6));
              setRegLng(e.latlng.lng.toFixed(6));
            });
          } catch (e) {
            console.warn(e);
          }
        }
      }, 200);
    } else if (!showRegModal || regStep !== 2) {
      if (miniMapRef.current) {
        miniMapRef.current.remove();
        miniMapRef.current = null;
        miniMarkerRef.current = null;
      }
    }
  }, [showRegModal, regStep]);

  function placeMiniMarker(lat: number, lng: number) {
    if (!miniMapRef.current) return;
    if (miniMarkerRef.current)
      miniMapRef.current.removeLayer(miniMarkerRef.current);
    const icon = L.divIcon({
      className: "",
      html: `<div style="width:16px;height:16px;background:#1a6fc4;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(26,111,196,0.5)"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    miniMarkerRef.current = L.marker([lat, lng], { icon }).addTo(
      miniMapRef.current,
    );
  }

  function placeUserMarker(lat: number, lng: number) {
    if (!mapRef.current) return;
    if (userMarkerRef.current)
      mapRef.current.removeLayer(userMarkerRef.current);
    const icon = L.divIcon({
      className: "",
      html: `<div style="width:18px;height:18px;background:#1a6fc4;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(26,111,196,0.5)"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    userMarkerRef.current = L.marker([lat, lng], { icon })
      .bindPopup("<b>📍 Your Location</b>")
      .addTo(mapRef.current);
  }

  function showPharmaciesOnMap(pharmacies: any[]) {
    if (!mapRef.current) return;
    pharmacyMarkersRef.current.forEach((m) => mapRef.current.removeLayer(m));
    pharmacyMarkersRef.current = [];
    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    setRouteInfo(null);
    const bounds: any[] = [[userLat, userLng]];
    pharmacies.forEach((p) => {
      const color = p.available ? "#1db87e" : "#e83b3b";
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:${color};color:white;padding:4px 8px;border-radius:8px;font-size:11px;font-weight:800;font-family:Nunito,sans-serif;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2);border:2px solid white">${p.available ? "✓" : "✗"} ${p.name.split(" ")[0]}</div>`,
        iconAnchor: [0, 0],
      });
      const marker = L.marker([p.lat, p.lng], { icon })
        .bindPopup(
          `<b>${p.name}</b><br>${p.area}<br><span style="color:${color};font-weight:700">${p.available ? "✓ Available" : "✗ Out of Stock"}</span><br>📞 ${p.phone}`,
        )
        .addTo(mapRef.current);
      marker.on("click", () => showRouteOnMap(p));
      pharmacyMarkersRef.current.push(marker);
      bounds.push([p.lat, p.lng]);
    });
    mapRef.current.fitBounds(bounds, { padding: [40, 40] });
  }

  function showRouteOnMap(pharmacy: any) {
    if (!mapRef.current) return;
    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    routeLayerRef.current = L.polyline(
      [
        [userLat, userLng],
        [pharmacy.lat, pharmacy.lng],
      ],
      {
        color: "#1a6fc4",
        weight: 4,
        dashArray: "8,6",
        opacity: 0.85,
      },
    ).addTo(mapRef.current);
    const midLat = (userLat + pharmacy.lat) / 2;
    const midLng = (userLng + pharmacy.lng) / 2;
    L.marker([midLat, midLng], {
      icon: L.divIcon({
        className: "",
        html: `<div style="background:#1a6fc4;color:white;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:700;font-family:Nunito,sans-serif">→ ${pharmacy.dist} km</div>`,
        iconAnchor: [28, 10],
      }),
    }).addTo(mapRef.current);
    mapRef.current.fitBounds(
      [
        [userLat, userLng],
        [pharmacy.lat, pharmacy.lng],
      ],
      { padding: [60, 60] },
    );
    const mins = Math.round(pharmacy.dist / 0.33);
    setRouteInfo({
      dist: pharmacy.dist + " km",
      time:
        mins < 60
          ? mins + " min"
          : Math.floor(mins / 60) + "h " + (mins % 60) + "m",
      dest: pharmacy.name,
      addr: pharmacy.address,
    });
  }

  function showHospitalRoute(h: any) {
    if (!emergencyMapRef.current) return;
    if (emergencyRouteRef.current) {
      emergencyMapRef.current.removeLayer(emergencyRouteRef.current);
      emergencyRouteRef.current = null;
    }
    emergencyRouteRef.current = L.polyline(
      [
        [userLat, userLng],
        [h.lat, h.lng],
      ],
      {
        color: "#e83b3b",
        weight: 4,
        dashArray: "8,6",
        opacity: 0.85,
      },
    ).addTo(emergencyMapRef.current);
    const midLat = (userLat + h.lat) / 2;
    const midLng = (userLng + h.lng) / 2;
    L.marker([midLat, midLng], {
      icon: L.divIcon({
        className: "",
        html: `<div style="background:#e83b3b;color:white;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:700;font-family:Nunito,sans-serif">→ ${h.dist} km</div>`,
        iconAnchor: [28, 10],
      }),
    }).addTo(emergencyMapRef.current);
    emergencyMapRef.current.fitBounds(
      [
        [userLat, userLng],
        [h.lat, h.lng],
      ],
      { padding: [50, 50] },
    );
    const mins = Math.round(h.dist / 0.33);
    setEmergencyRoute({
      dist: h.dist + " km",
      time:
        mins < 60
          ? mins + " min"
          : Math.floor(mins / 60) + "h " + (mins % 60) + "m",
      dest: h.name,
    });
  }

  function searchMedicine() {
    const q = searchQuery.trim();
    if (!q) {
      toast("Please enter a medicine name");
      return;
    }
    setSuggestions([]);
    setLoading(true);
    setTimeout(() => {
      const results = generatePharmacies(userLat, userLng);
      pharmacyDataRef.current = results.reduce((acc: any, p: any) => {
        acc[p.id] = p;
        return acc;
      }, {});
      setAllResults(results);
      setStatPharm(String(results.length));
      setResultCount(
        `${results.length} result${results.length !== 1 ? "s" : ""}`,
      );
      setPanelTitle(`"${q}" – Pharmacies`);
      setLoading(false);
      showPharmaciesOnMap(results);
    }, 600);
  }

  function getFilteredResults() {
    if (currentFilter === "available")
      return allResults.filter((p) => p.available);
    if (currentFilter === "out") return allResults.filter((p) => !p.available);
    if (currentFilter === "nearby")
      return [...allResults].sort((a, b) => a.dist - b.dist);
    return allResults;
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      toast("Geolocation not supported");
      return;
    }
    toast("📍 Detecting your location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLat(lat);
        setUserLng(lng);
        setLocText(`${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E (Updated)`);
        placeUserMarker(lat, lng);
        if (mapRef.current) mapRef.current.setView([lat, lng], 13);
        toast("✓ Location updated!");
      },
      () => toast("Could not get location – using Hyderabad"),
    );
  }

  function toggleMic() {
    if (micActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setMicActive(false);
      setShowMicWave(false);
      return;
    }
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast("🎙 Voice search not supported");
      return;
    }
    const r = new SR();
    r.lang = "en-IN";
    r.continuous = false;
    r.interimResults = true;
    r.onresult = (e: any) => {
      const t = Array.from(e.results as any[])
        .map((x: any) => x[0].transcript)
        .join("");
      setSearchQuery(t);
      if (e.results[0].isFinal) {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        }
        setMicActive(false);
        setShowMicWave(false);
        setTimeout(() => searchMedicine(), 100);
      }
    };
    r.onerror = () => {
      setMicActive(false);
      setShowMicWave(false);
      toast("Mic error");
    };
    r.onend = () => {
      setMicActive(false);
      setShowMicWave(false);
    };
    recognitionRef.current = r;
    r.start();
    setMicActive(true);
    setShowMicWave(true);
    toast("🎙 Listening… say medicine name");
  }

  function openCamera() {
    setShowCamModal(true);
    setCamStatus("Starting camera…");
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        camStreamRef.current = stream;
        if (camVideoRef.current) camVideoRef.current.srcObject = stream;
        setCamStatus("Point at medicine label and press Capture");
      })
      .catch(() =>
        setCamStatus("⚠ Camera permission denied. Please allow camera access."),
      );
  }

  function closeCamera() {
    if (camStreamRef.current) {
      camStreamRef.current.getTracks().forEach((t) => t.stop());
      camStreamRef.current = null;
    }
    setShowCamModal(false);
  }

  function captureFrame() {
    closeCamera();
    const detected = MEDICINES[Math.floor(Math.random() * MEDICINES.length)];
    setSearchQuery(detected);
    toast(`📷 Detected: ${detected}`);
    setTimeout(() => searchMedicine(), 400);
  }

  function getPwScore(pw: string) {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  }

  function submitLogin() {
    let ok = true;
    if (!loginEmail || !/\S+@\S+\.\S+/.test(loginEmail)) {
      setLoginEmailErr(true);
      ok = false;
    } else setLoginEmailErr(false);
    if (!loginPw) {
      setLoginPwErr(true);
      ok = false;
    } else setLoginPwErr(false);
    if (!ok) return;
    setLoginSubmitting(true);
    setTimeout(() => {
      setLoginSubmitting(false);
      setLoginSuccess(true);
      toast(`✅ Logged in as ${loginEmail}`);
      setTimeout(() => {
        setShowAuthModal(false);
        setLoginSuccess(false);
      }, 2200);
    }, 1200);
  }

  function submitRegister() {
    let ok = true;
    if (!regFullname || regFullname.length < 2) {
      setRegFullnameErr(true);
      ok = false;
    } else setRegFullnameErr(false);
    if (!regEmail || !/\S+@\S+\.\S+/.test(regEmail)) {
      setRegEmailErr(true);
      ok = false;
    } else setRegEmailErr(false);
    if (!regMobile || !/^[+\d\s-]{10,}$/.test(regMobile)) {
      setRegMobileErr(true);
      ok = false;
    } else setRegMobileErr(false);
    if (!regPw || regPw.length < 8) {
      setRegPwErr(true);
      ok = false;
    } else setRegPwErr(false);
    if (!regTerms) {
      setRegTermsErr(true);
      ok = false;
    } else setRegTermsErr(false);
    if (!ok) return;
    setRegSubmitting(true);
    setTimeout(() => {
      setRegSubmitting(false);
      setRegisterSuccess(true);
      toast("🎉 Account created! Check your email.");
      setTimeout(() => {
        setShowAuthModal(false);
        setRegisterSuccess(false);
        openRegisterModal();
      }, 2000);
    }, 1400);
  }

  function openRegisterModal() {
    setRegStep(1);
    setRegSuccessScreen(false);
    setRegName("");
    setRegAddress("");
    setRegPhone("");
    setRegHours("");
    setRegLicense("");
    setRegOwner("");
    setRegLat("");
    setRegLng("");
    setRegDist("");
    setRegArea("");
    setRegNotes("");
    setAvailTags([]);
    setLowTags([]);
    setOutTags([]);
    setRegNameErr(false);
    setRegAddressErr(false);
    setRegLatErr(false);
    setRegLngErr(false);
    setRegDistErr(false);
    setRegAvailErr(false);
    setShowRegModal(true);
    document.body.style.overflow = "hidden";
  }

  function closeRegisterModal() {
    if (miniMapRef.current) {
      miniMapRef.current.remove();
      miniMapRef.current = null;
      miniMarkerRef.current = null;
    }
    setShowRegModal(false);
    document.body.style.overflow = "";
  }

  function validateRegStep(step: number): boolean {
    let ok = true;
    if (step === 1) {
      if (!regName.trim()) {
        setRegNameErr(true);
        ok = false;
      } else setRegNameErr(false);
      if (!regAddress.trim()) {
        setRegAddressErr(true);
        ok = false;
      } else setRegAddressErr(false);
    }
    if (step === 2) {
      const lat = Number.parseFloat(regLat),
        lng = Number.parseFloat(regLng),
        dist = Number.parseFloat(regDist);
      if (isNaN(lat) || lat < 8 || lat > 38) {
        setRegLatErr(true);
        ok = false;
      } else setRegLatErr(false);
      if (isNaN(lng) || lng < 68 || lng > 98) {
        setRegLngErr(true);
        ok = false;
      } else setRegLngErr(false);
      if (isNaN(dist) || dist < 0) {
        setRegDistErr(true);
        ok = false;
      } else setRegDistErr(false);
    }
    if (step === 3) {
      if (availTags.length === 0) {
        setRegAvailErr(true);
        ok = false;
      } else setRegAvailErr(false);
    }
    return ok;
  }

  function regNext() {
    if (!validateRegStep(regStep)) return;
    setRegStep((s) => s + 1);
  }

  function regPrev() {
    if (regStep <= 1) return;
    setRegStep((s) => s - 1);
  }

  function submitRegistration() {
    if (!validateRegStep(3)) return;
    setRegSubmittingPharm(true);
    setTimeout(() => {
      const id = "MSP-" + Math.floor(100000 + Math.random() * 900000);
      setRegIdBadge(`ID: ${id}`);
      setRegSuccessScreen(true);
      setRegSubmittingPharm(false);
      toast(`🎉 ${regName} registered successfully!`);
    }, 1200);
  }

  function useCurrentLocationForReg() {
    if (!navigator.geolocation) {
      toast("Geolocation not supported");
      return;
    }
    toast("📍 Getting location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude,
          lng = pos.coords.longitude;
        setRegLat(lat.toFixed(6));
        setRegLng(lng.toFixed(6));
        const d =
          Math.sqrt(Math.pow(lat - 17.385, 2) + Math.pow(lng - 78.4867, 2)) *
          111;
        setRegDist(d.toFixed(1));
        toast("✓ Location filled!");
      },
      () => toast("Could not access GPS"),
    );
  }

  function addTag(type: "avail" | "low" | "out", value: string) {
    const v = value.trim().replace(/,+$/, "").trim();
    if (!v || v.length < 2) return;
    if (type === "avail") setAvailTags((t) => (t.includes(v) ? t : [...t, v]));
    if (type === "low") setLowTags((t) => (t.includes(v) ? t : [...t, v]));
    if (type === "out") setOutTags((t) => (t.includes(v) ? t : [...t, v]));
  }

  function removeTag(type: "avail" | "low" | "out", idx: number) {
    if (type === "avail") setAvailTags((t) => t.filter((_, i) => i !== idx));
    if (type === "low") setLowTags((t) => t.filter((_, i) => i !== idx));
    if (type === "out") setOutTags((t) => t.filter((_, i) => i !== idx));
  }

  const filtered = getFilteredResults();

  return (
    <div>
      <div className="bg-pattern" />
      <div className="content-wrap">
        {/* NAVBAR */}
        <nav>
          <a className="logo-wrap" href="#">
            <div className="logo-icon">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8 L12 6 L20 8 L28 6 L28 24 L20 26 L12 24 L4 26 Z"
                  fill="rgba(255,255,255,0.15)"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 4 C13 4 10.5 6.5 10.5 9.5 C10.5 13.5 16 20 16 20 C16 20 21.5 13.5 21.5 9.5 C21.5 6.5 19 4 16 4Z"
                  fill="white"
                />
                <ellipse
                  cx="16"
                  cy="9.5"
                  rx="3"
                  ry="5"
                  fill="rgba(26,111,196,0.3)"
                />
                <path
                  d="M13 9.5 L14.2 9.5 L14.8 7.5 L15.5 11.5 L16.2 8.5 L16.8 9.5 L19 9.5"
                  stroke="#1db87e"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="14"
                  y="22.5"
                  width="4"
                  height="1.5"
                  rx="0.5"
                  fill="#ff4444"
                />
                <rect
                  x="15.25"
                  y="21.25"
                  width="1.5"
                  height="4"
                  rx="0.5"
                  fill="#ff4444"
                />
              </svg>
            </div>
            <div className="logo-text">
              <span>Medi</span>
              <span>Spot</span>
            </div>
          </a>
          <div className="nav-tagline">🇮🇳 Connecting India to Medicines</div>
          <div className="nav-right">
            {/* EMERGENCY BUTTON */}
            <button
              className="emergency-btn"
              data-ocid="emergency.button"
              onClick={() => {
                setShowEmergency(true);
                document.body.style.overflow = "hidden";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 2.08 5.18 2 2 0 0 1 4 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z" />
              </svg>
              🚨 Emergency
            </button>
            {/* ADD PHARMACY DROPDOWN */}
            <div className="nav-add-wrap" ref={navAddWrapRef}>
              <button
                className={`nav-add-btn${showAddDropdown ? " open" : ""}`}
                data-ocid="nav.add_pharmacy_button"
                onClick={() => setShowAddDropdown((v) => !v)}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Pharmacy
                <span className="chevron">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
              {showAddDropdown && (
                <div className="add-dropdown">
                  <div className="dropdown-header">
                    <p>Pharmacy Portal</p>
                    <h4>Join MediSpot Network</h4>
                  </div>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowAddDropdown(false);
                      setAuthTab("login");
                      setLoginSuccess(false);
                      setLoginEmail("");
                      setLoginPw("");
                      setShowAuthModal(true);
                      document.body.style.overflow = "hidden";
                    }}
                  >
                    <div className="di-icon blue">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1a6fc4"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                      >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                    </div>
                    <div>
                      <div className="di-title">Login</div>
                      <div className="di-sub">
                        Access your pharmacy dashboard
                      </div>
                    </div>
                    <span className="di-arrow">›</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowAddDropdown(false);
                      setAuthTab("register");
                      setRegisterSuccess(false);
                      setShowAuthModal(true);
                      document.body.style.overflow = "hidden";
                    }}
                  >
                    <div className="di-icon green">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1db87e"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <div>
                      <div className="di-title">Register Pharmacy</div>
                      <div className="di-sub">List your pharmacy for free</div>
                    </div>
                    <span className="di-arrow">›</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-badge">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" fill="#1a6fc4" />
              <path
                d="M3.5 6h5M6 3.5v5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Real-Time Pharmacy Inventory
          </div>
          <h1>
            Find <em>Any Medicine</em>
            <br />
            At Pharmacies Near You
          </h1>
          <p>
            Search thousands of medicines across local pharmacies. Know
            availability, get directions, and never miss a dose.
          </p>
          <div className="search-wrap">
            <div className="search-box">
              <div className="search-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="22" y2="22" />
                </svg>
              </div>
              <input
                className="search-input"
                data-ocid="search.input"
                type="text"
                placeholder="Search medicine, brand, generic…"
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => {
                  const q = e.target.value;
                  setSearchQuery(q);
                  if (!q) {
                    setSuggestions([]);
                    return;
                  }
                  setSuggestions(
                    MEDICINES.filter((m) =>
                      m.toLowerCase().includes(q.toLowerCase()),
                    ).slice(0, 6),
                  );
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchMedicine();
                }}
              />
              {showMicWave && (
                <div className="mic-wave">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              )}
              <div className="search-actions">
                <button
                  className={`icon-btn${micActive ? " mic-active" : ""}`}
                  title="Voice Search"
                  onClick={toggleMic}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <rect x="9" y="2" width="6" height="11" rx="3" />
                    <path d="M5 11a7 7 0 0 0 14 0" />
                    <line x1="12" y1="18" x2="12" y2="22" />
                    <line x1="8" y1="22" x2="16" y2="22" />
                  </svg>
                </button>
                <button
                  className="icon-btn"
                  title="Scan with Camera"
                  onClick={openCamera}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
                <button
                  className="search-btn"
                  data-ocid="search.primary_button"
                  onClick={searchMedicine}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.5" y1="16.5" x2="22" y2="22" />
                  </svg>
                  Search
                </button>
              </div>
            </div>
            {suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((m) => (
                  <div
                    key={m}
                    className="sugg-item"
                    onClick={() => {
                      setSearchQuery(m);
                      setSuggestions([]);
                      setTimeout(() => searchMedicine(), 50);
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <line x1="16.5" y1="16.5" x2="22" y2="22" />
                    </svg>
                    {m}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="location-bar">
            <div className="loc-dot" />
            <div className="loc-text">
              Your location: <strong>{locText}</strong>
            </div>
            <button className="loc-btn" onClick={detectLocation}>
              📍 Update Location
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a6fc4"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <div className="stat-num">{statPharm}</div>
              <div className="stat-lbl">Pharmacies in Network</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1db87e"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <div>
              <div className="stat-num">5,800+</div>
              <div className="stat-lbl">Medicines Tracked</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e83b3b"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <div className="stat-num">Live</div>
              <div className="stat-lbl">Real-Time Inventory</div>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="main-layout">
          {/* RESULTS */}
          <div>
            <div className="panel-header">
              <div className="panel-title">{panelTitle}</div>
              <div className="result-count">{resultCount}</div>
            </div>
            <div className="filter-row">
              {(["all", "available", "out", "nearby"] as const).map((f) => (
                <button
                  key={f}
                  className={`filter-btn${currentFilter === f ? " active" : ""}`}
                  data-ocid={`filter.${f}_tab`}
                  onClick={() => setCurrentFilter(f)}
                >
                  {f === "all"
                    ? "All"
                    : f === "available"
                      ? "✓ Available"
                      : f === "out"
                        ? "✗ Out of Stock"
                        : "📍 Nearest"}
                </button>
              ))}
            </div>
            <div id="resultsContainer">
              {loading ? (
                [0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="pharmacy-card"
                    style={{ pointerEvents: "none" }}
                  >
                    <div
                      className="skeleton"
                      style={{ width: "60%", height: "18px" }}
                    />
                    <div
                      className="skeleton"
                      style={{ width: "40%", height: "12px" }}
                    />
                    <div
                      className="skeleton"
                      style={{ width: "80%", height: "12px" }}
                    />
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    stroke="#8a94b0"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="28" cy="28" r="18" />
                    <line x1="41" y1="41" x2="56" y2="56" />
                    <line x1="22" y1="28" x2="34" y2="28" />
                    <line x1="28" y1="22" x2="28" y2="34" />
                  </svg>
                  <h3>
                    {allResults.length === 0
                      ? "Search for a Medicine"
                      : "No results for this filter"}
                  </h3>
                  <p>
                    {allResults.length === 0
                      ? "Enter any medicine name to find nearby pharmacies."
                      : "Try changing the filter above."}
                  </p>
                </div>
              ) : (
                filtered.map((p, i) => (
                  <div
                    key={p.id}
                    className={`pharmacy-card${p.available ? "" : " out"}`}
                    data-ocid={`pharmacy.item.${i + 1}`}
                    onClick={() => showRouteOnMap(p)}
                  >
                    <div className="card-top">
                      <div>
                        <div className="pharm-name">{p.name}</div>
                        <div className="pharm-type">
                          📍 {p.area} &nbsp;·&nbsp; ⭐ {p.rating}
                        </div>
                      </div>
                      <div>
                        <div
                          className={`status-badge ${p.available ? "available" : "out"}`}
                        >
                          {p.available ? "✓ Available" : "✗ Out of Stock"}
                        </div>
                        {p.available && (
                          <div className="stock-qty">
                            Stock: <strong>{p.stock} units</strong>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="card-info">
                      <div className="info-item">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {p.hours}
                      </div>
                      <div className="info-item">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                        </svg>
                        {p.dist} km away
                      </div>
                      <div className="info-item">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07" />
                          <path d="M2 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L12 12l5 2v4" />
                        </svg>
                        {p.phone}
                      </div>
                    </div>
                    <div className="card-footer">
                      <button
                        className="btn-route"
                        onClick={(e) => {
                          e.stopPropagation();
                          showRouteOnMap(p);
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                          <line x1="9" y1="3" x2="9" y2="18" />
                          <line x1="15" y1="6" x2="15" y2="21" />
                        </svg>
                        Get Route
                      </button>
                      <button
                        className="btn-call"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast("📞 Calling " + p.phone);
                        }}
                      >
                        📞
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* MAP */}
          <div className="map-panel">
            <div className="map-card">
              <div className="map-header">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a6fc4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" y1="3" x2="9" y2="18" />
                  <line x1="15" y1="6" x2="15" y2="21" />
                </svg>
                <h3>Pharmacy Map</h3>
              </div>
              <div
                id="map"
                ref={mapContainerRef}
                style={{ height: "480px", width: "100%" }}
              />
              {routeInfo && (
                <div className="route-info">
                  <div className="route-stat">
                    <div className="val">{routeInfo.dist}</div>
                    <div className="lbl">Distance</div>
                  </div>
                  <div className="route-stat">
                    <div className="val">{routeInfo.time}</div>
                    <div className="lbl">Est. Travel</div>
                  </div>
                  <div className="route-dest">
                    <strong>{routeInfo.dest}</strong>
                    <span>{routeInfo.addr}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CAMERA MODAL */}
      {showCamModal && (
        <div className="cam-modal">
          <div className="cam-box">
            <h3>📷 Scan Medicine Label</h3>
            <p
              style={{
                color: "#8a94b0",
                fontSize: "0.85rem",
                marginBottom: "12px",
              }}
            >
              Point your camera at the medicine name or packaging
            </p>
            <video
              ref={camVideoRef}
              className="cam-video"
              autoPlay
              muted
              playsInline
            />
            <div
              style={{
                fontSize: "0.82rem",
                color: "#8a94b0",
                marginTop: "8px",
                minHeight: "20px",
              }}
            >
              {camStatus}
            </div>
            <div className="cam-actions">
              <button className="btn-capture" onClick={captureFrame}>
                📸 Capture &amp; Search
              </button>
              <button className="btn-close-cam" onClick={closeCamera}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showToast && <div className="toast">{toastMsg}</div>}

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div
          className="auth-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAuthModal(false);
              document.body.style.overflow = "";
            }
          }}
        >
          <div className="auth-modal" data-ocid="auth.modal">
            <div className="auth-close-row">
              <button
                className="auth-close"
                data-ocid="auth.close_button"
                onClick={() => {
                  setShowAuthModal(false);
                  document.body.style.overflow = "";
                }}
              >
                ✕
              </button>
            </div>
            <div className="auth-tabs">
              <button
                className={`auth-tab${authTab === "login" ? " active" : ""}`}
                data-ocid="auth.login_tab"
                onClick={() => setAuthTab("login")}
              >
                🔑 Login
              </button>
              <button
                className={`auth-tab${authTab === "register" ? " active" : ""}`}
                data-ocid="auth.register_tab"
                onClick={() => setAuthTab("register")}
              >
                🏥 Register Pharmacy
              </button>
            </div>
            <div className="auth-body">
              {authTab === "login" ? (
                loginSuccess ? (
                  <div className="auth-success">
                    <div className="auth-success-icon">✅</div>
                    <h3>Logged In Successfully!</h3>
                    <p>Welcome back! Redirecting to your pharmacy dashboard…</p>
                  </div>
                ) : (
                  <div>
                    <div className="auth-icon-wrap">
                      <div className="auth-icon login-icon">🔑</div>
                      <div className="auth-title">Welcome Back</div>
                      <div className="auth-sub">
                        Sign in to manage your pharmacy inventory
                      </div>
                    </div>
                    <div className="auth-field">
                      <div className="auth-label">Email Address</div>
                      <input
                        className={`auth-input${loginEmailErr ? " error" : ""}`}
                        data-ocid="login.email_input"
                        type="email"
                        placeholder="e.g. pharmacist@apollo.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                      {loginEmailErr && (
                        <div className="auth-err">
                          Please enter a valid email
                        </div>
                      )}
                    </div>
                    <div className="auth-field">
                      <div className="auth-label">Password</div>
                      <div className="password-wrap">
                        <input
                          className={`auth-input${loginPwErr ? " error" : ""}`}
                          data-ocid="login.password_input"
                          type={showLoginPw ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginPw}
                          onChange={(e) => setLoginPw(e.target.value)}
                        />
                        <button
                          className="pw-toggle"
                          type="button"
                          onClick={() => setShowLoginPw((v) => !v)}
                        >
                          👁
                        </button>
                      </div>
                      {loginPwErr && (
                        <div className="auth-err">
                          Please enter your password
                        </div>
                      )}
                    </div>
                    <div
                      className="auth-forgot"
                      onClick={() => toast("📧 Password reset email sent!")}
                    >
                      Forgot Password?
                    </div>
                    <button
                      className="auth-submit login-btn"
                      data-ocid="login.submit_button"
                      disabled={loginSubmitting}
                      onClick={submitLogin}
                    >
                      {loginSubmitting ? "Signing in…" : "Sign In to Dashboard"}
                    </button>
                    <div className="auth-divider">or continue with</div>
                    <div className="auth-social">
                      <button
                        className="social-btn"
                        onClick={() => toast("🔵 Google login coming soon")}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Google
                      </button>
                      <button
                        className="social-btn"
                        onClick={() => toast("📱 Phone OTP coming soon")}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        >
                          <rect x="5" y="2" width="14" height="20" rx="2" />
                          <line x1="12" y1="18" x2="12.01" y2="18" />
                        </svg>
                        Phone OTP
                      </button>
                    </div>
                    <div className="auth-switch">
                      Don't have an account?{" "}
                      <a onClick={() => setAuthTab("register")}>
                        Register your pharmacy →
                      </a>
                    </div>
                  </div>
                )
              ) : registerSuccess ? (
                <div className="auth-success">
                  <div className="auth-success-icon">🎉</div>
                  <h3>Account Created!</h3>
                  <p>
                    Welcome to MediSpot! Check your email to verify your
                    account.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="auth-icon-wrap">
                    <div className="auth-icon reg-icon">🏥</div>
                    <div className="auth-title">Register Your Pharmacy</div>
                    <div className="auth-sub">
                      Join 248+ pharmacies on MediSpot network
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "var(--dark)",
                      marginBottom: "10px",
                    }}
                  >
                    I am a…
                  </div>
                  <div className="role-selector">
                    <div
                      className={`role-card${selectedRole === "owner" ? " selected" : ""}`}
                      onClick={() => setSelectedRole("owner")}
                    >
                      <span className="role-emoji">👨‍⚕️</span>
                      <div className="role-name">Pharmacy Owner</div>
                      <div className="role-desc">I own / manage</div>
                    </div>
                    <div
                      className={`role-card${selectedRole === "staff" ? " selected" : ""}`}
                      onClick={() => setSelectedRole("staff")}
                    >
                      <span className="role-emoji">💊</span>
                      <div className="role-name">Pharmacist Staff</div>
                      <div className="role-desc">I work here</div>
                    </div>
                  </div>
                  <div className="auth-field">
                    <div className="auth-label">Full Name</div>
                    <input
                      className={`auth-input${regFullnameErr ? " error" : ""}`}
                      type="text"
                      placeholder="e.g. Dr. Ravi Kumar"
                      value={regFullname}
                      onChange={(e) => setRegFullname(e.target.value)}
                    />
                    {regFullnameErr && (
                      <div className="auth-err">
                        Please enter your full name
                      </div>
                    )}
                  </div>
                  <div className="auth-field">
                    <div className="auth-label">Email Address</div>
                    <input
                      className={`auth-input${regEmailErr ? " error" : ""}`}
                      type="email"
                      placeholder="e.g. ravi@apollopharmacy.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                    {regEmailErr && (
                      <div className="auth-err">Please enter a valid email</div>
                    )}
                  </div>
                  <div className="auth-field">
                    <div className="auth-label">Mobile Number</div>
                    <input
                      className={`auth-input${regMobileErr ? " error" : ""}`}
                      type="tel"
                      placeholder="+91 XXXXXXXXXX"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                    />
                    {regMobileErr && (
                      <div className="auth-err">
                        Please enter a valid mobile number
                      </div>
                    )}
                  </div>
                  <div className="auth-field">
                    <div className="auth-label">Create Password</div>
                    <div className="password-wrap">
                      <input
                        className={`auth-input${regPwErr ? " error" : ""}`}
                        type={showRegPw ? "text" : "password"}
                        placeholder="Min 8 characters"
                        value={regPw}
                        onChange={(e) => {
                          setRegPw(e.target.value);
                          setPwScore(getPwScore(e.target.value));
                        }}
                      />
                      <button
                        className="pw-toggle"
                        type="button"
                        onClick={() => setShowRegPw((v) => !v)}
                      >
                        👁
                      </button>
                    </div>
                    {regPwErr && (
                      <div className="auth-err">
                        Password must be at least 8 characters
                      </div>
                    )}
                    <div className="pw-strength-bars">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="pw-strength-bar"
                          style={{
                            background:
                              i < pwScore
                                ? ["#e83b3b", "#e65100", "#f59e0b", "#1db87e"][
                                    pwScore - 1
                                  ]
                                : undefined,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <label className="auth-terms">
                    <input
                      type="checkbox"
                      checked={regTerms}
                      onChange={(e) => setRegTerms(e.target.checked)}
                    />
                    I agree to MediSpot's{" "}
                    <a onClick={() => toast("Terms page coming soon")}>
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a onClick={() => toast("Privacy page coming soon")}>
                      Privacy Policy
                    </a>
                  </label>
                  {regTermsErr && (
                    <div className="auth-err">
                      Please accept the terms to continue
                    </div>
                  )}
                  <button
                    className="auth-submit reg-btn"
                    disabled={regSubmitting}
                    onClick={submitRegister}
                    style={{ marginTop: "16px" }}
                  >
                    {regSubmitting
                      ? "Creating account…"
                      : "Create Pharmacy Account →"}
                  </button>
                  <div className="auth-switch" style={{ marginTop: "14px" }}>
                    Already registered?{" "}
                    <a onClick={() => setAuthTab("login")}>← Sign in here</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PHARMACY REGISTER MODAL */}
      {showRegModal && (
        <div
          className="reg-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeRegisterModal();
          }}
        >
          <div className="reg-modal" data-ocid="register_pharmacy.modal">
            <div className="reg-header">
              <div className="reg-header-left">
                <div className="reg-header-icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div>
                  <h2>Register Pharmacy</h2>
                  <p>Join MediSpot's network across India</p>
                </div>
              </div>
              <button
                className="reg-close"
                data-ocid="register_pharmacy.close_button"
                onClick={closeRegisterModal}
              >
                ✕
              </button>
            </div>
            <div className="reg-body">
              {!regSuccessScreen ? (
                <>
                  {/* Steps */}
                  <div className="reg-steps">
                    {[1, 2, 3].map((s, idx) => (
                      <>
                        <div className="step-wrap" key={s}>
                          <div
                            className={`step-circle${regStep === s ? " active" : regStep > s ? " done" : ""}`}
                          >
                            {regStep > s ? "✓" : s}
                          </div>
                          <div
                            className="step-label"
                            style={{
                              color:
                                regStep === s
                                  ? "var(--blue)"
                                  : regStep > s
                                    ? "var(--green)"
                                    : "var(--muted)",
                            }}
                          >
                            {["Basic Info", "Location", "Inventory"][idx]}
                          </div>
                        </div>
                        {s < 3 && (
                          <div
                            className={`step-line${regStep > s ? " done" : ""}`}
                            key={`l${s}`}
                          />
                        )}
                      </>
                    ))}
                  </div>
                  {/* Step 1 */}
                  {regStep === 1 && (
                    <div className="form-section">
                      <div className="form-group">
                        <div className="form-label">
                          Pharmacy Name <span className="req">*</span>
                        </div>
                        <input
                          className={`form-input${regNameErr ? " error" : ""}`}
                          type="text"
                          placeholder="e.g. Apollo Pharmacy"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          maxLength={100}
                        />
                        {regNameErr && (
                          <div className="err-msg">
                            Please enter the pharmacy name
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <div className="form-label">
                          Address <span className="req">*</span>
                        </div>
                        <input
                          className={`form-input${regAddressErr ? " error" : ""}`}
                          type="text"
                          placeholder="Street, Area, City – Pincode"
                          value={regAddress}
                          onChange={(e) => setRegAddress(e.target.value)}
                          maxLength={200}
                        />
                        {regAddressErr && (
                          <div className="err-msg">
                            Please enter the pharmacy address
                          </div>
                        )}
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <div className="form-label">
                            Phone <span className="opt">(optional)</span>
                          </div>
                          <input
                            className="form-input"
                            type="tel"
                            placeholder="040-XXXXXXXX"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <div className="form-label">
                            Working Hours{" "}
                            <span className="opt">(optional)</span>
                          </div>
                          <input
                            className="form-input"
                            type="text"
                            placeholder="e.g. 8:00 AM – 10:00 PM"
                            value={regHours}
                            onChange={(e) => setRegHours(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <div className="form-label">
                            License Number{" "}
                            <span className="opt">(optional)</span>
                          </div>
                          <input
                            className="form-input"
                            type="text"
                            placeholder="e.g. DL-TG-2024-00123"
                            value={regLicense}
                            onChange={(e) => setRegLicense(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <div className="form-label">
                            Owner / Contact{" "}
                            <span className="opt">(optional)</span>
                          </div>
                          <input
                            className="form-input"
                            type="text"
                            placeholder="e.g. Dr. Ravi Kumar"
                            value={regOwner}
                            onChange={(e) => setRegOwner(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Step 2 */}
                  {regStep === 2 && (
                    <div className="form-section">
                      <div className="form-row">
                        <div className="form-group">
                          <div className="form-label">
                            Latitude <span className="req">*</span>
                          </div>
                          <input
                            className={`form-input${regLatErr ? " error" : ""}`}
                            type="number"
                            step="0.0001"
                            placeholder="e.g. 17.3872"
                            value={regLat}
                            onChange={(e) => setRegLat(e.target.value)}
                          />
                          {regLatErr && (
                            <div className="err-msg">
                              Please enter a valid latitude
                            </div>
                          )}
                        </div>
                        <div className="form-group">
                          <div className="form-label">
                            Longitude <span className="req">*</span>
                          </div>
                          <input
                            className={`form-input${regLngErr ? " error" : ""}`}
                            type="number"
                            step="0.0001"
                            placeholder="e.g. 78.4901"
                            value={regLng}
                            onChange={(e) => setRegLng(e.target.value)}
                          />
                          {regLngErr && (
                            <div className="err-msg">
                              Please enter a valid longitude
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <div className="form-label">
                            Distance from City Centre (km){" "}
                            <span className="req">*</span>
                          </div>
                          <input
                            className={`form-input${regDistErr ? " error" : ""}`}
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="e.g. 1.5"
                            value={regDist}
                            onChange={(e) => setRegDist(e.target.value)}
                          />
                          {regDistErr && (
                            <div className="err-msg">
                              Please enter a valid distance
                            </div>
                          )}
                        </div>
                        <div className="form-group">
                          <div className="form-label">Area / Locality</div>
                          <input
                            className="form-input"
                            type="text"
                            placeholder="e.g. Banjara Hills, Hyderabad"
                            value={regArea}
                            onChange={(e) => setRegArea(e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        className="loc-pick-btn"
                        onClick={useCurrentLocationForReg}
                      >
                        📍 Auto-fill from My Current Location
                      </button>
                      <div ref={miniMapContainerRef} className="mini-map" />
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--muted)",
                          marginTop: "8px",
                        }}
                      >
                        💡 Click the map to pin exact location
                      </p>
                    </div>
                  )}
                  {/* Step 3 */}
                  {regStep === 3 && (
                    <div className="form-section">
                      <div className="form-group">
                        <div
                          className="form-label"
                          style={{ color: "var(--green)" }}
                        >
                          Available Medicines <span className="req">*</span>
                        </div>
                        <div className="tag-input-wrap">
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "6px",
                            }}
                          >
                            {availTags.map((t, i) => (
                              <span key={i} className="tag available-tag">
                                {t}
                                <span
                                  className="tag-remove"
                                  onClick={() => removeTag("avail", i)}
                                >
                                  ×
                                </span>
                              </span>
                            ))}
                          </div>
                          <input
                            className="tag-type-input"
                            placeholder="Type medicine name, press Enter or comma…"
                            value={availInput}
                            onChange={(e) => setAvailInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === ",") {
                                e.preventDefault();
                                addTag("avail", availInput);
                                setAvailInput("");
                              } else if (
                                e.key === "Backspace" &&
                                !availInput &&
                                availTags.length
                              ) {
                                setAvailTags((t) => t.slice(0, -1));
                              }
                            }}
                            onBlur={() => {
                              if (availInput.trim()) {
                                addTag("avail", availInput);
                                setAvailInput("");
                              }
                            }}
                          />
                        </div>
                        {regAvailErr && (
                          <div className="err-msg">
                            Add at least one available medicine
                          </div>
                        )}
                        <div className="tag-hint">Press Enter or , to add</div>
                      </div>
                      <div className="form-group">
                        <div
                          className="form-label"
                          style={{ color: "#e65100" }}
                        >
                          Low Stock Medicines{" "}
                          <span className="opt">(optional)</span>
                        </div>
                        <div className="tag-input-wrap">
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "6px",
                            }}
                          >
                            {lowTags.map((t, i) => (
                              <span key={i} className="tag low-tag">
                                {t}
                                <span
                                  className="tag-remove"
                                  onClick={() => removeTag("low", i)}
                                >
                                  ×
                                </span>
                              </span>
                            ))}
                          </div>
                          <input
                            className="tag-type-input"
                            placeholder="e.g. Losartan, Warfarin…"
                            value={lowInput}
                            onChange={(e) => setLowInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === ",") {
                                e.preventDefault();
                                addTag("low", lowInput);
                                setLowInput("");
                              } else if (
                                e.key === "Backspace" &&
                                !lowInput &&
                                lowTags.length
                              ) {
                                setLowTags((t) => t.slice(0, -1));
                              }
                            }}
                            onBlur={() => {
                              if (lowInput.trim()) {
                                addTag("low", lowInput);
                                setLowInput("");
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div
                          className="form-label"
                          style={{ color: "var(--red)" }}
                        >
                          Out of Stock Medicines{" "}
                          <span className="opt">(optional)</span>
                        </div>
                        <div className="tag-input-wrap">
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "6px",
                            }}
                          >
                            {outTags.map((t, i) => (
                              <span key={i} className="tag out-tag">
                                {t}
                                <span
                                  className="tag-remove"
                                  onClick={() => removeTag("out", i)}
                                >
                                  ×
                                </span>
                              </span>
                            ))}
                          </div>
                          <input
                            className="tag-type-input"
                            placeholder="e.g. Salmeterol…"
                            value={outInput}
                            onChange={(e) => setOutInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === ",") {
                                e.preventDefault();
                                addTag("out", outInput);
                                setOutInput("");
                              } else if (
                                e.key === "Backspace" &&
                                !outInput &&
                                outTags.length
                              ) {
                                setOutTags((t) => t.slice(0, -1));
                              }
                            }}
                            onBlur={() => {
                              if (outInput.trim()) {
                                addTag("out", outInput);
                                setOutInput("");
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="form-label">
                          Additional Notes{" "}
                          <span className="opt">(optional)</span>
                        </div>
                        <textarea
                          className="form-textarea"
                          placeholder="e.g. Specialises in generic medicines…"
                          value={regNotes}
                          onChange={(e) => setRegNotes(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="reg-success-screen">
                  <div className="success-icon">🎉</div>
                  <h3>Pharmacy Registered!</h3>
                  <p>
                    Your pharmacy has been successfully added to MediSpot's
                    network. It will appear after verification (usually within 2
                    hours).
                  </p>
                  <div className="reg-id-badge">{regIdBadge}</div>
                  <br />
                  <br />
                  <button
                    className="btn-next"
                    onClick={closeRegisterModal}
                    style={{ margin: "0 auto" }}
                  >
                    ✓ Done
                  </button>
                </div>
              )}
            </div>
            {!regSuccessScreen && (
              <div className="reg-footer">
                <span className="step-indicator">Step {regStep} of 3</span>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <button
                    className="btn-prev"
                    disabled={regStep === 1}
                    onClick={regPrev}
                  >
                    ← Back
                  </button>
                  {regStep < 3 && (
                    <button className="btn-next" onClick={regNext}>
                      Next →{" "}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  )}
                  {regStep === 3 && (
                    <button
                      className="btn-submit-reg"
                      disabled={regSubmittingPharm}
                      onClick={submitRegistration}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {regSubmittingPharm
                        ? "Registering…"
                        : "Register Pharmacy"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EMERGENCY MODAL */}
      {showEmergency && (
        <div
          className="emergency-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEmergency(false);
              document.body.style.overflow = "";
            }
          }}
        >
          <div className="emergency-modal" data-ocid="emergency.modal">
            <div className="emergency-modal-header">
              <div className="emergency-modal-header-left">
                <div className="emergency-modal-header-icon">🚨</div>
                <div>
                  <h2>Nearest Hospitals</h2>
                  <p>
                    Emergency services near your location – sorted by distance
                  </p>
                </div>
              </div>
              <button
                className="emergency-close"
                data-ocid="emergency.close_button"
                onClick={() => {
                  setShowEmergency(false);
                  document.body.style.overflow = "";
                }}
              >
                ✕
              </button>
            </div>
            <div className="emergency-body">
              {/* Hospital list */}
              <div className="hospital-list">
                {hospitals.map((h, i) => (
                  <div
                    key={h.id}
                    className={`hospital-card ${h.isOpen ? "open-hosp" : "closed-hosp"}`}
                    data-ocid={`hospital.item.${i + 1}`}
                    onClick={() => showHospitalRoute(h)}
                  >
                    <div className="hosp-top">
                      <div>
                        <div className="hosp-name">{h.name}</div>
                        <div className="hosp-type">{h.type}</div>
                      </div>
                      <div
                        className={
                          h.isOpen ? "hosp-open-badge" : "hosp-closed-badge"
                        }
                      >
                        {h.isOpen ? "● Open Now" : "✕ Closed"}
                      </div>
                    </div>
                    <div className="hosp-info">
                      <span>📍 {h.area}</span>
                      <span>📏 {h.dist} km away</span>
                      <span>📞 {h.phone}</span>
                    </div>
                    <button
                      className="btn-hosp-route"
                      data-ocid={`hospital.route_button.${i + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        showHospitalRoute(h);
                      }}
                    >
                      🗺 Get Route
                    </button>
                  </div>
                ))}
              </div>
              {/* Emergency map */}
              <div className="emergency-map-wrap">
                <div id="emergency-map-div" ref={emergencyMapContainerRef} />
                {emergencyRoute && (
                  <div className="emergency-route-strip">
                    <div>
                      <div className="val">{emergencyRoute.dist}</div>
                      <div className="lbl">Distance</div>
                    </div>
                    <div>
                      <div className="val">{emergencyRoute.time}</div>
                      <div className="lbl">Est. Travel</div>
                    </div>
                    <div className="emergency-route-dest">
                      <strong>{emergencyRoute.dest}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
