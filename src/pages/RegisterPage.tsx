import React, { useState, useRef, useEffect } from "react";
import {
  Lock,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { isMobilePhone } from "validator";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RegistrationForm {
  title: string;
  firstName: string;
  lastName: string;
  otherNames: string;
  gender: string;
  email: string;
  phone: string;
  institution: string;
  otherInstitution: string;
  participantCategory: string;
  isCsStudent: string;
  department: string;
  studentId: string;
  programme: string;
  otherProgramme: string;
  cohort: string;
  attendanceMode: string;
  eventDay: string;
  sessionTime: string;
  isSubmittingAbstract: string;
  participationType: string;
  paperType: string;
  thematicAreas: string[];
  authorNames: string;
  presentationType: string;
  nationality: string;
  presentationTitle: string;
  abstractBackground: string;
  abstractMethods: string;
  abstractResults: string;
  abstractSignificance: string;
}

type FormErrors = Partial<Record<keyof RegistrationForm, string>>;

interface PaymentOptions {
  paymentStatus: string;
  paymentReference: string;
  method: string;
  amount: number;
}

interface EventData {
  fee?: number;
  paystackKey?: string;
  edition?: string;
  dates?: string;
  title?: string;
  registrationOpen?: boolean;
  morningCapacity?: number;
  afternoonCapacity?: number;
  sessionCounts?: Record<string, number>;
}

interface RegisterPageProps {
  navigate: (page: string) => void;
  setRegistrant?: (data: Record<string, unknown>) => void;
  event?: EventData;
  onRegister?: (
    form: RegistrationForm,
    options: PaymentOptions,
  ) => Promise<Record<string, unknown>>;
}

const PROGRAMMES = [
  "MSc Computer Science",
  "MPhil Computer Science",
  "MSc Data Science",
  "MPhil Data Science",
  "MSc IT for Business",
  "Mphil part two",
  "PhD Computer Science",
  "Other (Specify)",
];

const EVENT_DAYS = [
  { key: "27Aug", label: "27 Aug", full: "Wednesday, 27 August" },
  { key: "28Aug", label: "28 Aug", full: "Thursday, 28 August" },
  { key: "29Aug", label: "29 Aug", full: "Friday, 29 August" },
] as const;

const PRESENTATION_TYPES = ["Oral Presentation", "Poster Presentation"];

const PAPER_TYPES = [
  "Poster Presentation",
  "Regular Paper",
  "Short Paper",
  "Technical Paper",
];

const THEMATIC_AREAS = [
  "Machine Learning, Computer Vision & Pattern Recognition",
  "Data Science, Big Data Analytics & Data Management",
  "Human-Computer Interaction & Intelligent systems",
  "Networking & Communications Systems",
  "Cyber Security, Forensics & Artificial Intelligence",
  "Reinforcement Learning, Deep Learning and Network Systems",
];

const APPLICANT_TITLES = [
  "Mr.",
  "Mrs.",
  "Miss",
  "Ms.",
  "Dr.",
  "Prof.",
  "Rev.",
  "Eng.",
  "Other",
];

const COHORTS = [
  "Regular",
  "Cohort A (Evening)",
  "Cohort B (Weekend)",
  "Cohort C (Weekend)",
];

const CS_DEPARTMENTS = ["Computer Science"];

const INSTITUTIONS = ["University of Ghana, Legon", "Other (Specify)"];

const PARTICIPANT_CATEGORIES = [
  "Undergraduate",
  "Masters (MSc / MPhil)",
  "PhD student",
  "DCS Faculty",
  "Postdoctoral Fellow / Researcher",
  "Other University of Ghana Faculty/Staff",
  "International Faculty/Collaborator/Partner",
  "UG / DCS Alumni",
];

// ── Paystack public key — replace with pk_live_… for production ──────────────
// Public keys are safe to commit. Never put sk_test_/sk_live_ keys here.
const PAYSTACK_PUBLIC_KEY = "pk_test_7286d5fe706c0c323ea13d3817918f0e5a09a3c2";

const countWords = (text: string) =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

// Hard-caps a text value at `max` words — used so users physically cannot
// type past the limit rather than just being shown a validation error.
const clampWords = (text: string, max: number) => {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= max) return text;
  return words.slice(0, max).join(" ");
};

const ABSTRACT_SECTIONS: {
  key:
    | "abstractBackground"
    | "abstractMethods"
    | "abstractResults"
    | "abstractSignificance";
  label: string;
  placeholder: string;
  maxWords: number;
}[] = [
  {
    key: "abstractBackground",
    label: "Background",
    placeholder: "Describe the context and motivation for your research…",
    maxWords: 100,
  },
  {
    key: "abstractMethods",
    label: "Methods",
    placeholder: "Describe the methodology or approach used…",
    maxWords: 100,
  },
  {
    key: "abstractResults",
    label: "Results",
    placeholder: "Summarise your key findings…",
    maxWords: 100,
  },
  {
    key: "abstractSignificance",
    label: "Significance",
    placeholder: "Explain the significance or contribution of your work…",
    maxWords: 60,
  },
];

const SUBMISSION_GUIDELINES = [
  "Submissions must be original, unpublished work",
  "Written in English using the provided template in the registration link",
  "Abstract of 360 words counts is required to present (Oral/Poster) at the conference, you are required to submit an abstract not exceeding 360 words in English via the registration portal, and upload same in MS Word format, as directed",
  "Failure to adhere to the 360-word limit may affect the selection of your abstract.",
];

// Six selectable in-person day/session slots (3 workshop days × Morning/Afternoon)
const SESSION_OPTIONS = EVENT_DAYS.flatMap((d) =>
  (["Morning", "Afternoon"] as const).map((time) => ({
    dayKey: d.key,
    time,
    label: `${d.full} — ${time}`,
    timeRange: time === "Morning" ? "9:00 AM – 1:00 PM" : "2:00 PM – 5:00 PM",
  })),
);

// ─── Nationalities (ISO 3166-1 / UN-recognised) ───────────────────────────────
const NATIONALITIES: string[] = [
  "Afghan",
  "Albanian",
  "Algerian",
  "American",
  "Andorran",
  "Angolan",
  "Antiguan and Barbudan",
  "Argentine",
  "Armenian",
  "Australian",
  "Austrian",
  "Azerbaijani",
  "Bahamian",
  "Bahraini",
  "Bangladeshi",
  "Barbadian",
  "Belarusian",
  "Belgian",
  "Belizean",
  "Beninese",
  "Bhutanese",
  "Bolivian",
  "Bosnian and Herzegovinian",
  "Botswanan",
  "Brazilian",
  "Bruneian",
  "Bulgarian",
  "Burkinabé",
  "Burundian",
  "Cabo Verdean",
  "Cambodian",
  "Cameroonian",
  "Canadian",
  "Central African",
  "Chadian",
  "Chilean",
  "Chinese",
  "Colombian",
  "Comorian",
  "Congolese (DRC)",
  "Congolese (Republic)",
  "Costa Rican",
  "Croatian",
  "Cuban",
  "Cypriot",
  "Czech",
  "Danish",
  "Djiboutian",
  "Dominican",
  "Dominican Republican",
  "Ecuadorian",
  "Egyptian",
  "Emirati",
  "Equatorial Guinean",
  "Eritrean",
  "Estonian",
  "Eswatini",
  "Ethiopian",
  "Fijian",
  "Filipino",
  "Finnish",
  "French",
  "Gabonese",
  "Gambian",
  "Georgian",
  "German",
  "Ghanaian",
  "Greek",
  "Grenadian",
  "Guatemalan",
  "Guinean",
  "Guinea-Bissauan",
  "Guyanese",
  "Haitian",
  "Honduran",
  "Hungarian",
  "Icelander",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Israeli",
  "Italian",
  "Ivorian",
  "Jamaican",
  "Japanese",
  "Jordanian",
  "Kazakhstani",
  "Kenyan",
  "Kiribatian",
  "Kuwaiti",
  "Kyrgyz",
  "Laotian",
  "Latvian",
  "Lebanese",
  "Lesothan",
  "Liberian",
  "Libyan",
  "Liechtensteiner",
  "Lithuanian",
  "Luxembourger",
  "Malagasy",
  "Malawian",
  "Malaysian",
  "Maldivian",
  "Malian",
  "Maltese",
  "Marshallese",
  "Mauritanian",
  "Mauritian",
  "Mexican",
  "Micronesian",
  "Moldovan",
  "Monacan",
  "Mongolian",
  "Montenegrin",
  "Moroccan",
  "Mozambican",
  "Namibian",
  "Nauruan",
  "Nepali",
  "New Zealander",
  "Nicaraguan",
  "Nigerian",
  "Nigerien",
  "North Korean",
  "North Macedonian",
  "Norwegian",
  "Omani",
  "Pakistani",
  "Palauan",
  "Palestinian",
  "Panamanian",
  "Papua New Guinean",
  "Paraguayan",
  "Peruvian",
  "Polish",
  "Portuguese",
  "Qatari",
  "Romanian",
  "Russian",
  "Rwandan",
  "Saint Kitts and Nevisian",
  "Saint Lucian",
  "Saint Vincentian and Grenadinian",
  "Samoan",
  "San Marinese",
  "São Toméan",
  "Saudi",
  "Senegalese",
  "Serbian",
  "Seychellois",
  "Sierra Leonean",
  "Singaporean",
  "Slovak",
  "Slovenian",
  "Solomon Islander",
  "Somali",
  "South African",
  "South Korean",
  "South Sudanese",
  "Spanish",
  "Sri Lankan",
  "Sudanese",
  "Surinamese",
  "Swedish",
  "Swiss",
  "Syrian",
  "Taiwanese",
  "Tajik",
  "Tanzanian",
  "Thai",
  "Timorese",
  "Togolese",
  "Tongan",
  "Trinidadian and Tobagonian",
  "Tunisian",
  "Turkish",
  "Turkmen",
  "Tuvaluan",
  "Ugandan",
  "Ukrainian",
  "Uruguayan",
  "Uzbek",
  "Vanuatuan",
  "Venezuelan",
  "Vietnamese",
  "Yemeni",
  "Zambian",
  "Zimbabwean",
].sort();

// ─── Searchable Nationality Dropdown ─────────────────────────────────────────
interface NationalitySelectProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

function NationalitySelect({ value, onChange, error }: NationalitySelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = NATIONALITIES.filter((n) =>
    n.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="form-group" ref={wrapRef} style={{ position: "relative" }}>
      <label>
        Nationality<span className="req">*</span>
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={open ? query : value}
          placeholder="Search or select nationality…"
          autoComplete="off"
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          style={{
            borderColor: error ? "#c0392b" : undefined,
            paddingRight: 36,
            cursor: open ? "text" : "pointer",
          }}
        />
        <ChevronDown
          size={16}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
            transition: "transform 0.2s ease",
            color: "#aaa",
            pointerEvents: "none",
          }}
        />
      </div>

      {open && (
        <ul
          style={{
            position: "absolute",
            zIndex: 300,
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #dde1ea",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            maxHeight: 220,
            overflowY: "auto",
            margin: 0,
            padding: "4px 0",
            listStyle: "none",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
          }}
        >
          {filtered.length === 0 ?
            <li style={{ padding: "10px 14px", color: "#aaa", fontSize: 13 }}>
              No results found
            </li>
          : filtered.map((n) => (
              <li
                key={n}
                onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                onClick={() => {
                  onChange(n);
                  setOpen(false);
                  setQuery("");
                }}
                style={{
                  padding: "9px 14px",
                  cursor: "pointer",
                  fontSize: 14,
                  background: n === value ? "#E5EAF3" : "transparent",
                  color: n === value ? "#1B3A6B" : "#333",
                  fontWeight: n === value ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (n !== value)
                    (e.currentTarget as HTMLLIElement).style.background =
                      "#f5f7fa";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLLIElement).style.background =
                    n === value ? "#E5EAF3" : "transparent";
                }}
              >
                {n}
              </li>
            ))
          }
        </ul>
      )}

      {error && <p className="text-[#c0392b] text-[12px] mt-1">{error}</p>}
    </div>
  );
}

// ─── Country phone codes ──────────────────────────────────────────────────────
interface CountryPhone {
  name: string;
  code: string;
  dial: string;
  flag: string;
  locale: string | null; // validator.js isMobilePhone locale, null = basic length check
}

const COUNTRY_PHONES: CountryPhone[] = [
  // Ghana first (default)
  { name: "Ghana", code: "GH", dial: "+233", flag: "🇬🇭", locale: "en-GH" },
  // Africa
  { name: "Algeria", code: "DZ", dial: "+213", flag: "🇩🇿", locale: "ar-DZ" },
  { name: "Angola", code: "AO", dial: "+244", flag: "🇦🇴", locale: "pt-AO" },
  { name: "Benin", code: "BJ", dial: "+229", flag: "🇧🇯", locale: "fr-BJ" },
  { name: "Botswana", code: "BW", dial: "+267", flag: "🇧🇼", locale: "en-BW" },
  {
    name: "Burkina Faso",
    code: "BF",
    dial: "+226",
    flag: "🇧🇫",
    locale: "fr-BF",
  },
  { name: "Burundi", code: "BI", dial: "+257", flag: "🇧🇮", locale: null },
  { name: "Cabo Verde", code: "CV", dial: "+238", flag: "🇨🇻", locale: null },
  { name: "Cameroon", code: "CM", dial: "+237", flag: "🇨🇲", locale: "fr-CM" },
  {
    name: "Central African Republic",
    code: "CF",
    dial: "+236",
    flag: "🇨🇫",
    locale: "fr-CF",
  },
  { name: "Chad", code: "TD", dial: "+235", flag: "🇹🇩", locale: null },
  { name: "Comoros", code: "KM", dial: "+269", flag: "🇰🇲", locale: null },
  {
    name: "Congo (DRC)",
    code: "CD",
    dial: "+243",
    flag: "🇨🇩",
    locale: "fr-CD",
  },
  {
    name: "Congo (Republic)",
    code: "CG",
    dial: "+242",
    flag: "🇨🇬",
    locale: null,
  },
  { name: "Djibouti", code: "DJ", dial: "+253", flag: "🇩🇯", locale: "fr-DJ" },
  { name: "Egypt", code: "EG", dial: "+20", flag: "🇪🇬", locale: "ar-EG" },
  {
    name: "Equatorial Guinea",
    code: "GQ",
    dial: "+240",
    flag: "🇬🇶",
    locale: null,
  },
  { name: "Eritrea", code: "ER", dial: "+291", flag: "🇪🇷", locale: null },
  { name: "Eswatini", code: "SZ", dial: "+268", flag: "🇸🇿", locale: null },
  { name: "Ethiopia", code: "ET", dial: "+251", flag: "🇪🇹", locale: null },
  { name: "Gabon", code: "GA", dial: "+241", flag: "🇬🇦", locale: null },
  { name: "Gambia", code: "GM", dial: "+220", flag: "🇬🇲", locale: null },
  { name: "Guinea", code: "GN", dial: "+224", flag: "🇬🇳", locale: null },
  { name: "Guinea-Bissau", code: "GW", dial: "+245", flag: "🇬🇼", locale: null },
  { name: "Ivory Coast", code: "CI", dial: "+225", flag: "🇨🇮", locale: null },
  { name: "Kenya", code: "KE", dial: "+254", flag: "🇰🇪", locale: "en-KE" },
  { name: "Lesotho", code: "LS", dial: "+266", flag: "🇱🇸", locale: "en-LS" },
  { name: "Liberia", code: "LR", dial: "+231", flag: "🇱🇷", locale: null },
  { name: "Libya", code: "LY", dial: "+218", flag: "🇱🇾", locale: "ar-LY" },
  { name: "Madagascar", code: "MG", dial: "+261", flag: "🇲🇬", locale: "mg-MG" },
  { name: "Malawi", code: "MW", dial: "+265", flag: "🇲🇼", locale: "en-MW" },
  { name: "Mali", code: "ML", dial: "+223", flag: "🇲🇱", locale: null },
  { name: "Mauritania", code: "MR", dial: "+222", flag: "🇲🇷", locale: null },
  { name: "Mauritius", code: "MU", dial: "+230", flag: "🇲🇺", locale: "en-MU" },
  { name: "Morocco", code: "MA", dial: "+212", flag: "🇲🇦", locale: "ar-MA" },
  { name: "Mozambique", code: "MZ", dial: "+258", flag: "🇲🇿", locale: "mz-MZ" },
  { name: "Namibia", code: "NA", dial: "+264", flag: "🇳🇦", locale: null },
  { name: "Niger", code: "NE", dial: "+227", flag: "🇳🇪", locale: null },
  { name: "Nigeria", code: "NG", dial: "+234", flag: "🇳🇬", locale: "en-NG" },
  { name: "Rwanda", code: "RW", dial: "+250", flag: "🇷🇼", locale: "en-RW" },
  {
    name: "São Tomé and Príncipe",
    code: "ST",
    dial: "+239",
    flag: "🇸🇹",
    locale: null,
  },
  { name: "Senegal", code: "SN", dial: "+221", flag: "🇸🇳", locale: null },
  {
    name: "Sierra Leone",
    code: "SL",
    dial: "+232",
    flag: "🇸🇱",
    locale: "en-SL",
  },
  { name: "Somalia", code: "SO", dial: "+252", flag: "🇸🇴", locale: "so-SO" },
  {
    name: "South Africa",
    code: "ZA",
    dial: "+27",
    flag: "🇿🇦",
    locale: "en-ZA",
  },
  {
    name: "South Sudan",
    code: "SS",
    dial: "+211",
    flag: "🇸🇸",
    locale: "en-SS",
  },
  { name: "Sudan", code: "SD", dial: "+249", flag: "🇸🇩", locale: "ar-SD" },
  { name: "Tanzania", code: "TZ", dial: "+255", flag: "🇹🇿", locale: "en-TZ" },
  { name: "Togo", code: "TG", dial: "+228", flag: "🇹🇬", locale: null },
  { name: "Tunisia", code: "TN", dial: "+216", flag: "🇹🇳", locale: "ar-TN" },
  { name: "Uganda", code: "UG", dial: "+256", flag: "🇺🇬", locale: "en-UG" },
  { name: "Zambia", code: "ZM", dial: "+260", flag: "🇿🇲", locale: "en-ZM" },
  { name: "Zimbabwe", code: "ZW", dial: "+263", flag: "🇿🇼", locale: "en-ZW" },
  // International
  { name: "Australia", code: "AU", dial: "+61", flag: "🇦🇺", locale: "en-AU" },
  { name: "Brazil", code: "BR", dial: "+55", flag: "🇧🇷", locale: "pt-BR" },
  { name: "Canada", code: "CA", dial: "+1", flag: "🇨🇦", locale: "en-CA" },
  { name: "China", code: "CN", dial: "+86", flag: "🇨🇳", locale: "zh-CN" },
  { name: "France", code: "FR", dial: "+33", flag: "🇫🇷", locale: "fr-FR" },
  { name: "Germany", code: "DE", dial: "+49", flag: "🇩🇪", locale: "de-DE" },
  { name: "India", code: "IN", dial: "+91", flag: "🇮🇳", locale: "en-IN" },
  { name: "Italy", code: "IT", dial: "+39", flag: "🇮🇹", locale: "it-IT" },
  { name: "Japan", code: "JP", dial: "+81", flag: "🇯🇵", locale: "ja-JP" },
  { name: "Netherlands", code: "NL", dial: "+31", flag: "🇳🇱", locale: "nl-NL" },
  { name: "New Zealand", code: "NZ", dial: "+64", flag: "🇳🇿", locale: "en-NZ" },
  { name: "Norway", code: "NO", dial: "+47", flag: "🇳🇴", locale: "nb-NO" },
  { name: "Pakistan", code: "PK", dial: "+92", flag: "🇵🇰", locale: "en-PK" },
  { name: "Portugal", code: "PT", dial: "+351", flag: "🇵🇹", locale: "pt-PT" },
  { name: "Russia", code: "RU", dial: "+7", flag: "🇷🇺", locale: "ru-RU" },
  {
    name: "Saudi Arabia",
    code: "SA",
    dial: "+966",
    flag: "🇸🇦",
    locale: "ar-SA",
  },
  { name: "South Korea", code: "KR", dial: "+82", flag: "🇰🇷", locale: "ko-KR" },
  { name: "Spain", code: "ES", dial: "+34", flag: "🇪🇸", locale: "es-ES" },
  { name: "Sweden", code: "SE", dial: "+46", flag: "🇸🇪", locale: "sv-SE" },
  { name: "Switzerland", code: "CH", dial: "+41", flag: "🇨🇭", locale: "de-CH" },
  { name: "Turkey", code: "TR", dial: "+90", flag: "🇹🇷", locale: "tr-TR" },
  { name: "UAE", code: "AE", dial: "+971", flag: "🇦🇪", locale: "ar-AE" },
  {
    name: "United Kingdom",
    code: "GB",
    dial: "+44",
    flag: "🇬🇧",
    locale: "en-GB",
  },
  {
    name: "United States",
    code: "US",
    dial: "+1",
    flag: "🇺🇸",
    locale: "en-US",
  },
];

// ─── Phone Input with country dial-code selector ──────────────────────────────
interface PhoneInputProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  const defaultCountry = COUNTRY_PHONES[0]; // Ghana

  const [country, setCountry] = useState<CountryPhone>(() => {
    if (value) {
      const match = COUNTRY_PHONES.find((c) => value.startsWith(c.dial));
      if (match) return match;
    }
    return defaultCountry;
  });

  const [localNum, setLocalNum] = useState(() => {
    if (value && value.startsWith(country.dial))
      return value.slice(country.dial.length);
    return value || "";
  });

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const selectCountry = (c: CountryPhone) => {
    setCountry(c);
    setOpen(false);
    setQuery("");
    onChange(`${c.dial}${localNum}`);
  };

  const handleNumber = (v: string) => {
    const clean = v.replace(/[^\d\s\-]/g, "");
    setLocalNum(clean);
    onChange(`${country.dial}${clean}`);
  };

  const filtered = COUNTRY_PHONES.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.dial.includes(query),
  );

  return (
    <div className="form-group" ref={wrapRef} style={{ position: "relative" }}>
      <label>
        Phone Number<span className="req">*</span>
      </label>
      <div style={{ display: "flex" }}>
        {/* Dial-code selector */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 10px",
            border: `1px solid ${error ? "#c0392b" : "#dde1ea"}`,
            borderRight: "none",
            borderRadius: "10px 0 0 10px",
            background: "#f8f9fb",
            cursor: "pointer",
            fontSize: 13,
            whiteSpace: "nowrap",
            minWidth: 96,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{country.flag}</span>
          <span style={{ fontWeight: 500 }}>{country.dial}</span>
          <ChevronDown
            size={13}
            style={{
              color: "#aaa",
              transform: `rotate(${open ? 180 : 0}deg)`,
              transition: "transform 0.2s",
            }}
          />
        </button>

        {/* Number input */}
        <input
          type="tel"
          value={localNum}
          onChange={(e) => handleNumber(e.target.value)}
          placeholder="Phone number"
          style={{
            flex: 1,
            borderRadius: "0 10px 10px 0",
            borderColor: error ? "#c0392b" : undefined,
          }}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 400,
            top: "100%",
            left: 0,
            width: 290,
            background: "#fff",
            border: "1px solid #dde1ea",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            overflow: "hidden",
            marginTop: 2,
          }}
        >
          <div style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code…"
              style={{
                width: "100%",
                border: "1px solid #dde1ea",
                borderRadius: 7,
                padding: "6px 10px",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
          <ul
            style={{
              maxHeight: 220,
              overflowY: "auto",
              margin: 0,
              padding: "4px 0",
              listStyle: "none",
            }}
          >
            {filtered.length === 0 ?
              <li style={{ padding: "10px 14px", color: "#aaa", fontSize: 13 }}>
                No results
              </li>
            : filtered.map((c) => (
                <li
                  key={c.code}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectCountry(c)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 14px",
                    cursor: "pointer",
                    fontSize: 13,
                    background:
                      c.code === country.code ? "#E5EAF3" : "transparent",
                    color: c.code === country.code ? "#1B3A6B" : "#333",
                    fontWeight: c.code === country.code ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (c.code !== country.code)
                      (e.currentTarget as HTMLLIElement).style.background =
                        "#f5f7fa";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLLIElement).style.background =
                      c.code === country.code ? "#E5EAF3" : "transparent";
                  }}
                >
                  <span style={{ fontSize: 18 }}>{c.flag}</span>
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span style={{ color: "#888", fontSize: 12 }}>{c.dial}</span>
                </li>
              ))
            }
          </ul>
        </div>
      )}

      {error && <p className="text-[#c0392b] text-[12px] mt-1">{error}</p>}
    </div>
  );
}

const steps = ["Personal Details", "Academic Info", "Participation", "Payment"];

// ── Confirmation persistence ──────────────────────────────────────────────────
// Survives a page refresh on the success screen by caching the completed
// registration in sessionStorage (cleared once the user leaves via "Back to Home").
const CONFIRMATION_STORAGE_KEY = "ugpgw-registration-confirmation";

interface StoredConfirmation {
  form: RegistrationForm;
  paymentConfirmed: boolean;
  confirmationRef: string;
}

function loadStoredConfirmation(): StoredConfirmation | null {
  try {
    const raw = sessionStorage.getItem(CONFIRMATION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredConfirmation) : null;
  } catch {
    return null;
  }
}

function saveStoredConfirmation(data: StoredConfirmation) {
  try {
    sessionStorage.setItem(CONFIRMATION_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* sessionStorage unavailable (e.g. private mode) — confirmation just won't survive a refresh */
  }
}

function clearStoredConfirmation() {
  try {
    sessionStorage.removeItem(CONFIRMATION_STORAGE_KEY);
  } catch {}
}

export default function RegisterPage({
  navigate,
  setRegistrant,
  event = {},
  onRegister,
}: RegisterPageProps) {
  const fee = event.fee || 100;
  const morningCapacity = event.morningCapacity ?? 60;
  const afternoonCapacity = event.afternoonCapacity ?? 60;
  const sessionCounts = event.sessionCounts ?? {};
  const getAvailable = (day: string, time: "Morning" | "Afternoon") => {
    const taken = sessionCounts[`${day}_${time}`] ?? 0;
    return Math.max(
      0,
      (time === "Morning" ? morningCapacity : afternoonCapacity) - taken,
    );
  };

  const [storedConfirmation] = useState(loadStoredConfirmation);

  const [step, setStep] = useState<number>(0);
  const [form, setForm] = useState<RegistrationForm>(
    storedConfirmation?.form || {
      title: "",
      firstName: "",
      lastName: "",
      otherNames: "",
      gender: "",
      nationality: "",
      email: "",
      phone: "",
      institution: INSTITUTIONS[0],
      otherInstitution: "",
      participantCategory: "",
      isCsStudent: "",
      department: "",
      studentId: "",
      programme: "",
      otherProgramme: "",
      cohort: "",
      attendanceMode: "Physical",
      eventDay: "",
      sessionTime: "",
      isSubmittingAbstract: "",
      participationType: "",
      paperType: "",
      thematicAreas: [],
      authorNames: "",
      presentationType: "",
      presentationTitle: "",
      abstractBackground: "",
      abstractMethods: "",
      abstractResults: "",
      abstractSignificance: "",
    },
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(storedConfirmation !== null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(
    storedConfirmation?.paymentConfirmed ?? false,
  );
  const [confirmationRef, setConfirmationRef] = useState(
    storedConfirmation?.confirmationRef ?? "",
  );
  const [registrationError, setRegistrationError] = useState("");

  const initializePayment = usePaystackPayment({
    publicKey: (event.paystackKey || PAYSTACK_PUBLIC_KEY).trim(),
    email: form.email,
    amount: fee * 100,
    currency: "GHS",
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: `${form.firstName} ${form.lastName}`.trim(),
        },
        {
          display_name: "Category of Participant",
          variable_name: "participant_category",
          value: form.participantCategory,
        },
        {
          display_name: "Programme",
          variable_name: "programme",
          value: form.programme,
        },
      ],
    },
  });

  const set = (k: keyof RegistrationForm, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleThematicArea = (area: string) =>
    setForm((f) => ({
      ...f,
      thematicAreas:
        f.thematicAreas.includes(area) ?
          f.thematicAreas.filter((a) => a !== area)
        : [...f.thematicAreas, area],
    }));

  // No → clear department/studentId/programme/cohort so stale data isn't submitted for a non-DCS applicant
  useEffect(() => {
    if (form.isCsStudent === "Yes") {
      setForm((f) => ({
        ...f,
        department: f.department || CS_DEPARTMENTS[0],
      }));
    } else if (form.isCsStudent === "No") {
      setForm((f) => ({
        ...f,
        department: "",
        studentId: "",
        programme: "",
        otherProgramme: "",
        cohort: "",
      }));
    }
  }, [form.isCsStudent]);

  // Participation type is fully derived from the abstract-submission answer:
  // Yes → Presenter, No → Observer (and clear every abstract-only field so stale data isn't submitted)
  useEffect(() => {
    if (form.isSubmittingAbstract === "Yes") {
      setForm((f) => ({ ...f, participationType: "Presenter" }));
    } else if (form.isSubmittingAbstract === "No") {
      setForm((f) => ({
        ...f,
        participationType: "Observer",
        paperType: "",
        thematicAreas: [],
        authorNames: "",
        presentationType: "",
        presentationTitle: "",
        abstractBackground: "",
        abstractMethods: "",
        abstractResults: "",
        abstractSignificance: "",
      }));
    }
  }, [form.isSubmittingAbstract]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (step === 0) {
      if (!form.title) e.title = "Please select a title.";
      if (!form.firstName.trim()) e.firstName = "First name is required.";
      if (!form.lastName.trim()) e.lastName = "Last name is required.";
      if (!form.gender) e.gender = "Please select a gender.";
      if (!form.nationality) e.nationality = "Nationality is required.";
      if (!form.institution) e.institution = "Please select an institution.";
      if (
        form.institution === "Other (Specify)" &&
        !form.otherInstitution.trim()
      )
        e.otherInstitution = "Please specify your institution.";
      if (!form.participantCategory)
        e.participantCategory = "Please select a category of participant.";
      if (!form.email.includes("@")) e.email = "Valid email required.";
      (() => {
        const phoneCountry = COUNTRY_PHONES.find((c) =>
          form.phone.startsWith(c.dial),
        );
        const clean = form.phone.replace(/[\s\-]/g, "");
        // Try the number as-is, then also without a trunk prefix 0 (e.g. 054… → 54…)
        const localPart = clean.slice(phoneCountry?.dial.length ?? 0);
        const cleanAlt =
          phoneCountry ?
            phoneCountry.dial + localPart.replace(/^0+/, "")
          : clean;
        const valid =
          phoneCountry?.locale ?
            isMobilePhone(
              clean,
              phoneCountry.locale as Parameters<typeof isMobilePhone>[1],
            ) ||
            isMobilePhone(
              cleanAlt,
              phoneCountry.locale as Parameters<typeof isMobilePhone>[1],
            )
          : clean.replace(/\D/g, "").length >= 7;
        if (!valid)
          e.phone =
            phoneCountry ?
              `Please enter a valid ${phoneCountry.name} phone number.`
            : "Please enter a valid phone number.";
      })();
    }
    if (step === 1) {
      if (!form.isCsStudent)
        e.isCsStudent =
          "Please indicate whether you are a current postgraduate student in the Department of Computer Science.";
      if (form.isCsStudent === "Yes") {
        if (!form.studentId.trim()) e.studentId = "Student ID is required.";
        if (!form.programme) e.programme = "Programme is required.";
        if (form.programme === "Other (Specify)" && !form.otherProgramme.trim())
          e.otherProgramme = "Please specify your programme.";
        if (!form.cohort) e.cohort = "Please select a cohort.";
      }
      if (!form.isSubmittingAbstract)
        e.isSubmittingAbstract =
          "Please indicate whether you are submitting an abstract.";
    }
    if (step === 2) {
      if (!form.eventDay || !form.sessionTime)
        e.eventDay =
          "Please select the day and session you can attend in person.";
      else {
        const avail = getAvailable(
          form.eventDay,
          form.sessionTime as "Morning" | "Afternoon",
        );
        if (avail <= 0) {
          const dayLabel =
            EVENT_DAYS.find((d) => d.key === form.eventDay)?.full ??
            form.eventDay;
          e.eventDay = `The ${form.sessionTime} session on ${dayLabel} is full. Please choose another slot.`;
        }
      }
      if (form.isSubmittingAbstract === "Yes") {
        if (!form.paperType) e.paperType = "Type of paper is required.";
        if (form.thematicAreas.length === 0)
          e.thematicAreas = "Please select at least one thematic area.";
        if (!form.authorNames.trim())
          e.authorNames = "Please enter the name(s) of the author(s).";
        if (!form.presentationType)
          e.presentationType = "Presentation type is required.";
        if (!form.presentationTitle.trim())
          e.presentationTitle = "Presentation title is required.";
        ABSTRACT_SECTIONS.forEach(({ key, label, maxWords }) => {
          const value = form[key];
          if (!value.trim()) e[key] = `${label} is required.`;
          else if (countWords(value) > maxWords)
            e[key] =
              `${label} must not exceed ${maxWords} words (currently ${countWords(value)}).`;
        });
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate()) setStep((s) => Math.min(s + 1, 3));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const saveRegistrationRecord = async (
    paymentStatus: string,
    reference = "",
    method = "paystack",
  ) => {
    const fullName =
      `${form.firstName} ${form.otherNames} ${form.lastName}`.trim();
    const sessionPreference =
      form.eventDay && form.sessionTime ?
        `${form.eventDay}_${form.sessionTime}`
      : "";
    const enrichedForm = {
      ...form,
      fullName,
      name: fullName,
      sessionPreference,
    };

    const saved = (await onRegister?.(enrichedForm, {
      paymentStatus,
      paymentReference: reference,
      method,
      amount: fee,
    })) ?? { ...enrichedForm, payment: paymentStatus, payRef: reference };

    setRegistrant?.({
      ...enrichedForm,
      ...saved,
      payment: paymentStatus,
      payRef: reference,
    });
    return saved;
  };

  const finishRegistration = async (
    paymentStatus: string,
    reference = "",
    method = "paystack",
  ) => {
    await saveRegistrationRecord(paymentStatus, reference, method);
    const confirmed = paymentStatus === "Confirmed";
    setPaymentConfirmed(confirmed);
    setConfirmationRef(reference);
    setDone(true);
    saveStoredConfirmation({
      form,
      paymentConfirmed: confirmed,
      confirmationRef: reference,
    });
  };

  const initPaystack = () => {
    setRegistrationError("");
    setPaying(true);
    initializePayment({
      config: {
        reference: `UGPGW2026-${Date.now()}`,
        email: form.email,
        amount: fee * 100,
      },
      onSuccess: async (response) => {
        try {
          await finishRegistration("Confirmed", response.reference, "paystack");
        } catch {
          setPaying(false);
          setRegistrationError(
            `Your payment was received (ref: ${response.reference}) but we could not save your registration. Please contact support and quote this reference.`,
          );
        }
      },
      onClose: () => {
        setPaying(false);
        setRegistrationError(
          "Payment was not completed. Please try again to confirm your registration.",
        );
      },
    });
  };

  const field = (
    label: string,
    key: keyof RegistrationForm,
    type = "text",
    required = true,
  ) => (
    <div className="form-group">
      <label>
        {label}
        {required && <span className="req">*</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      {errors[key] && (
        <p className="text-[#c0392b] text-[12px] mt-1">{errors[key]}</p>
      )}
    </div>
  );

  if (event.registrationOpen === false)
    return (
      <main>
        <section className="bg-gradient-to-br from-ug-navy to-ug-blue text-white py-[72px] pb-14">
          <div className="container">
            <h1
              className="text-white font-serif mb-3"
              style={{ fontSize: "clamp(2rem,4.5vw,3rem)" }}
            >
              Registration
            </h1>
            <p className="text-white/70 text-base">
              2nd Annual DCS Postgraduate Workshop ·{" "}
              {event.dates || "27–29 August 2026"}
            </p>
          </div>
        </section>
        <div className="container section">
          <div className="max-w-[520px] mx-auto text-center">
            <div className="mb-5 flex justify-center">
              <Lock size={64} color="#1B3A6B" />
            </div>
            <h2 className="mb-3">Registration is Currently Closed</h2>
            <p className="text-[#555] leading-[1.75] mb-7">
              Registration for the{" "}
              {event.title ||
                "2026 DCS Postgradute Research Conference & Workshop"}{" "}
              is not yet open. Check back soon or follow announcements for
              updates.
            </p>
            <div className="flex gap-3 justify-center">
              <button className="btn-primary" onClick={() => navigate("home")}>
                Back to Home
              </button>
              <button
                className="btn-outline"
                onClick={() => navigate("support")}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </main>
    );

  if (done)
    return (
      <main>
        <div className="page-hero">
          <div className="container">
            <h1>Registration Complete!</h1>
          </div>
        </div>
        <div className="container section">
          <div className="max-w-[560px] mx-auto text-center">
            <div className="mb-5 flex justify-center">
              <Sparkles size={64} color="#C9A84C" />
            </div>
            <h2 className="mb-3">
              You're registered, {form.firstName || form.lastName}!
            </h2>
            <p className="text-[#555] mb-6 leading-[1.7]">
              {paymentConfirmed ?
                <>
                  Your payment has been confirmed and your registration for the{" "}
                  <strong>
                    {event.title || "2nd UG Postgraduate Workshop"} (
                    {event.dates || "27–29 Aug 2026"})
                  </strong>{" "}
                  is complete. A confirmation email with your meeting link has
                  been sent to <strong>{form.email}</strong>.
                </>
              : <>
                  Your registration for the{" "}
                  <strong>
                    {event.title || "2nd UG Postgraduate Workshop"} (
                    {event.dates || "27–29 Aug 2026"})
                  </strong>{" "}
                  has been saved. Payment instructions will be sent to{" "}
                  <strong>{form.email}</strong> once the payment gateway is
                  ready.
                </>
              }
            </p>
            <div className="alert alert-success text-left">
              {paymentConfirmed && confirmationRef ?
                <>
                  <strong>Payment reference:</strong> {confirmationRef}
                  <br />
                  <span className="text-[13px]">
                    Keep this reference for your records. Check your email for
                    the workshop meeting link and further instructions.
                  </span>
                </>
              : <>
                  <strong>Registration reference:</strong> {confirmationRef}
                  <br />
                  <span className="text-[13px]">
                    Keep this for your records. You will be contacted with
                    payment details.
                  </span>
                </>
              }
            </div>
            <div className="flex gap-3 justify-center mt-6">
              <button
                className="btn-outline"
                onClick={() => {
                  clearStoredConfirmation();
                  navigate("home");
                }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>
    );

  return (
    <main>
      {/* SPLIT-LAYOUT HERO */}
      <section className="bg-gradient-to-r from-ug-navy to-ug-blue text-white py-[72px] pb-14 relative overflow-hidden">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1620829813573-7c9e1877706f?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div
          className="container reg-grid relative z-10 grid gap-[48px] items-center"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          {/* Left: text */}
          <div>
            <span
              className="badge inline-block mb-3"
              style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}
            >
              {event.edition || "2nd Annual Edition"} · GHS {fee}
            </span>
            <h1
              className="text-white mb-3"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
            >
              Register for the Workshop
            </h1>
            <p className="text-white/75 text-[15px] leading-[1.7] mb-0">
              2nd Annual Postgraduate Students Workshop · 27–29 August 2026 ·
              University of Ghana
            </p>
          </div>

          {/* Right: photo with floating badge */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <img
                src="https://images.unsplash.com/photo-1686213011624-8578b598ef0f?auto=format&fit=crop&w=600&q=85"
                alt="Workshop registration"
                className="w-full object-cover block"
                style={{ height: 260 }}
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-ug-gold rounded-xl px-[18px] py-3 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
              <div className="text-[13px] font-bold text-white flex items-center gap-1">
                <Check size={14} /> Snacks included
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">
                + Water &amp; materials
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container section" style={{ minHeight: "60vh" }}>
        <div className="max-w-[680px] mx-auto">
          {/* STEPPER */}
          <div className="flex gap-0 mb-10 bg-ug-surface rounded-xl p-1 border border-[#eee]">
            {steps.map((s, i) => (
              <div
                key={i}
                className="flex-1 text-center px-2 py-[10px] rounded-[9px] text-[13px] transition-all duration-200"
                style={{
                  background: i === step ? "#1B3A6B" : "transparent",
                  color:
                    i === step ? "#fff"
                    : i < step ? "#1B3A6B"
                    : "#999",
                  fontWeight: i === step ? 600 : 400,
                }}
              >
                <span className="mr-1.5 inline-flex items-center">
                  {i < step ?
                    <Check size={14} />
                  : `${i + 1}.`}
                </span>
                {s}
              </div>
            ))}
          </div>

          <div className="card">
            {/* STEP 0: Personal */}
            {step === 0 && (
              <div>
                <h3 className="mb-6">Personal Details</h3>
                <div className="form-group">
                  <label>
                    Title<span className="req">*</span>
                  </label>
                  <select
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                  >
                    <option value="">-- Select title --</option>
                    {APPLICANT_TITLES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.title && (
                    <p className="text-[#c0392b] text-[12px] mt-1">
                      {errors.title}
                    </p>
                  )}
                </div>
                <div className="form-row">
                  {field("First Name", "firstName")}
                  {field("Last Name", "lastName")}
                </div>
                {field("Other Names", "otherNames", "required", false)}
                <div className="form-group">
                  <label>
                    Gender<span className="req">*</span>
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => set("gender", e.target.value)}
                  >
                    <option value="">-- Select gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="text-[#c0392b] text-[12px] mt-1">
                      {errors.gender}
                    </p>
                  )}
                </div>
                <NationalitySelect
                  value={form.nationality}
                  onChange={(v) => set("nationality", v)}
                  error={errors.nationality}
                />
                {field("Email Address", "email", "email")}
                <PhoneInput
                  value={form.phone}
                  onChange={(v) => set("phone", v)}
                  error={errors.phone}
                />
                <div className="form-group">
                  <label>
                    Indicate your affiliation/institution
                    <span className="req">*</span>
                  </label>
                  <select
                    value={form.institution}
                    onChange={(e) => set("institution", e.target.value)}
                  >
                    {INSTITUTIONS.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  {errors.institution && (
                    <p className="text-[#c0392b] text-[12px] mt-1">
                      {errors.institution}
                    </p>
                  )}
                </div>
                {form.institution === "Other (Specify)" && (
                  <div className="form-group">
                    <label>
                      Other Institution (Specify)
                      <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.otherInstitution}
                      onChange={(e) => set("otherInstitution", e.target.value)}
                      placeholder="Enter your institution"
                    />
                    {errors.otherInstitution && (
                      <p className="text-[#c0392b] text-[12px] mt-1">
                        {errors.otherInstitution}
                      </p>
                    )}
                  </div>
                )}
                <div className="form-group">
                  <label>
                    Category of Participant<span className="req">*</span>
                  </label>
                  <select
                    value={form.participantCategory}
                    onChange={(e) => set("participantCategory", e.target.value)}
                  >
                    <option value="">-- Select a category --</option>
                    {PARTICIPANT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.participantCategory && (
                    <p className="text-[#c0392b] text-[12px] mt-1">
                      {errors.participantCategory}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 1: Academic */}
            {step === 1 && (
              <div>
                <h3 className="mb-6">Academic Information</h3>
                <div className="form-group">
                  <label>
                    Are you a current Postgraduate student at the department of
                    Computer Science?<span className="req">*</span>
                  </label>
                  <select
                    value={form.isCsStudent}
                    onChange={(e) => set("isCsStudent", e.target.value)}
                  >
                    <option value="">-- Select an option --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {errors.isCsStudent && (
                    <p className="text-[#c0392b] text-[12px] mt-1">
                      {errors.isCsStudent}
                    </p>
                  )}
                </div>
                {form.isCsStudent === "Yes" && (
                  <>
                    <div className="form-group">
                      <label>
                        Student ID<span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.studentId}
                        onChange={(e) => set("studentId", e.target.value)}
                        placeholder="Enter your student ID"
                      />
                      {errors.studentId && (
                        <p className="text-[#c0392b] text-[12px] mt-1">
                          {errors.studentId}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>
                        Programme<span className="req">*</span>
                      </label>
                      <select
                        value={form.programme}
                        onChange={(e) => set("programme", e.target.value)}
                      >
                        <option value="">-- Select your programme --</option>
                        {PROGRAMMES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      {errors.programme && (
                        <p className="text-[#c0392b] text-[12px] mt-1">
                          {errors.programme}
                        </p>
                      )}
                    </div>
                    {form.programme === "Other (Specify)" && (
                      <div className="form-group">
                        <label>
                          Specify Programme<span className="req">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.otherProgramme}
                          onChange={(e) =>
                            set("otherProgramme", e.target.value)
                          }
                          placeholder="Enter your specific programme"
                        />
                        {errors.otherProgramme && (
                          <p className="text-[#c0392b] text-[12px] mt-1">
                            {errors.otherProgramme}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="form-group">
                      <label>
                        Cohort<span className="req">*</span>
                      </label>
                      <select
                        value={form.cohort}
                        onChange={(e) => set("cohort", e.target.value)}
                      >
                        <option value="">-- Select your cohort --</option>
                        {COHORTS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      {errors.cohort && (
                        <p className="text-[#c0392b] text-[12px] mt-1">
                          {errors.cohort}
                        </p>
                      )}
                    </div>
                  </>
                )}
                <div className="form-group">
                  <label>
                    Are you submitting an abstract?
                    <span className="req">*</span>
                  </label>
                  <select
                    value={form.isSubmittingAbstract}
                    onChange={(e) =>
                      set("isSubmittingAbstract", e.target.value)
                    }
                  >
                    <option value="">-- Select an option --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {errors.isSubmittingAbstract && (
                    <p className="text-[#c0392b] text-[12px] mt-1">
                      {errors.isSubmittingAbstract}
                    </p>
                  )}
                </div>
                {form.participationType && (
                  <div className="form-group">
                    <label>Participation Type</label>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "8px 14px",
                        borderRadius: 8,
                        border: "1px solid #dde1ea",
                        background: "#f8f9fb",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#1B3A6B",
                      }}
                    >
                      {form.participationType}
                    </div>
                    <p className="text-[12px] mt-1" style={{ color: "#888" }}>
                      Set automatically based on whether you're submitting an
                      abstract.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Participation */}
            {step === 2 && (
              <div>
                <h3 className="mb-6">Participation Details</h3>

                <div className="form-group">
                    <label>
                      Select the day and session you can attend in person
                      <span className="req">*</span>
                    </label>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        marginTop: 6,
                      }}
                    >
                      {SESSION_OPTIONS.map(
                        ({ dayKey, time, label, timeRange }) => {
                          const available = getAvailable(dayKey, time);
                          const cap =
                            time === "Morning" ? morningCapacity : (
                              afternoonCapacity
                            );
                          const full = available <= 0;
                          const selected =
                            form.eventDay === dayKey &&
                            form.sessionTime === time;
                          return (
                            <button
                              key={`${dayKey}_${time}`}
                              type="button"
                              disabled={full}
                              onClick={() =>
                                !full &&
                                setForm((f) => ({
                                  ...f,
                                  eventDay: dayKey,
                                  sessionTime: time,
                                }))
                              }
                              style={{
                                padding: "14px 12px",
                                borderRadius: 10,
                                border: `2px solid ${
                                  selected ? "#1B3A6B"
                                  : full ? "#e2e8f0"
                                  : "#d1d5db"
                                }`,
                                background:
                                  selected ? "#1B3A6B"
                                  : full ? "#f8fafc"
                                  : "#fff",
                                color:
                                  selected ? "#fff"
                                  : full ? "#aaa"
                                  : "#222",
                                cursor: full ? "not-allowed" : "pointer",
                                textAlign: "left",
                                transition: "all 0.15s",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 700,
                                  fontSize: 14,
                                  marginBottom: 3,
                                }}
                              >
                                {label}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  opacity: selected ? 0.85 : 0.65,
                                  marginBottom: 6,
                                }}
                              >
                                {timeRange}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color:
                                    full ? "#c0392b"
                                    : selected ? "#C9A84C"
                                    : available <= 10 ? "#e67e22"
                                    : "#27ae60",
                                }}
                              >
                                {full ?
                                  "Session full"
                                : `${available} / ${cap} seats remaining`}
                              </div>
                            </button>
                          );
                        },
                      )}
                    </div>

                    {errors.eventDay && (
                      <p className="text-[#c0392b] text-[12px] mt-2">
                        {errors.eventDay}
                      </p>
                    )}
                </div>

                {form.isSubmittingAbstract === "Yes" && (
                  <>
                    <div className="form-group">
                      <label>
                        Type of Paper<span className="req">*</span>
                      </label>
                      <select
                        value={form.paperType}
                        onChange={(e) => set("paperType", e.target.value)}
                      >
                        <option value="">-- Select type of paper --</option>
                        {PAPER_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      {errors.paperType && (
                        <p className="text-[#c0392b] text-[12px] mt-1">
                          {errors.paperType}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>
                        Select thematic areas of your paper
                        <span className="req">*</span>
                      </label>
                      <div style={{ display: "grid", gap: 10 }}>
                        {THEMATIC_AREAS.map((area) => (
                          <label
                            key={area}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 8,
                              fontSize: 14,
                              fontWeight: 400,
                              margin: 0,
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={form.thematicAreas.includes(area)}
                              onChange={() => toggleThematicArea(area)}
                              style={{
                                width: 16,
                                height: 16,
                                padding: 0,
                                flexShrink: 0,
                                marginTop: 3,
                              }}
                            />
                            <span>{area}</span>
                          </label>
                        ))}
                      </div>
                      {errors.thematicAreas && (
                        <p className="text-[#c0392b] text-[12px] mt-1">
                          {errors.thematicAreas}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>
                        Name of Author(s)<span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.authorNames}
                        onChange={(e) => set("authorNames", e.target.value)}
                        placeholder="Enter the name(s) of all author(s)"
                      />
                      {errors.authorNames && (
                        <p className="text-[#c0392b] text-[12px] mt-1">
                          {errors.authorNames}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>
                        Presentation Type<span className="req">*</span>
                      </label>
                      <select
                        value={form.presentationType}
                        onChange={(e) =>
                          set("presentationType", e.target.value)
                        }
                      >
                        <option value="">-- Select presentation type --</option>
                        {PRESENTATION_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      {errors.presentationType && (
                        <p className="text-[#c0392b] text-[12px] mt-1">
                          {errors.presentationType}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>
                        Title of Presentation<span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.presentationTitle}
                        onChange={(e) =>
                          set("presentationTitle", e.target.value)
                        }
                        placeholder="Enter the title of your presentation or paper"
                      />
                      {errors.presentationTitle && (
                        <p className="text-[#c0392b] text-[12px] mt-1">
                          {errors.presentationTitle}
                        </p>
                      )}
                    </div>
                    <div
                      className="alert alert-info mb-5"
                      style={{ fontSize: 13, lineHeight: 1.7 }}
                    >
                      <strong>Abstract &amp; Paper Submission Guidelines:</strong>
                      <ol style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                        {SUBMISSION_GUIDELINES.map((g, i) => (
                          <li key={i} style={{ marginBottom: 4 }}>
                            {g}
                          </li>
                        ))}
                      </ol>
                    </div>
                    {ABSTRACT_SECTIONS.map(({ key, label, placeholder, maxWords }) => {
                      const value = form[key];
                      const words = countWords(value);
                      const overLimit = words > maxWords;
                      return (
                        <div className="form-group" key={key}>
                          <label>
                            {label}
                            <span className="req">*</span>
                          </label>
                          <textarea
                            value={value}
                            onChange={(e) =>
                              set(key, clampWords(e.target.value, maxWords))
                            }
                            placeholder={placeholder}
                            rows={3}
                            style={{ resize: "vertical", minHeight: 70 }}
                          />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginTop: 4,
                            }}
                          >
                            <span>
                              {errors[key] && (
                                <span className="text-[#c0392b] text-[12px]">
                                  {errors[key]}
                                </span>
                              )}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: overLimit ? 600 : 400,
                                color: overLimit ? "#c0392b" : "#999",
                              }}
                            >
                              {words} / {maxWords} words
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <div>
                <h3 className="mb-5">Registration Summary &amp; Payment</h3>
                <div className="bg-ug-surface rounded-[10px] p-5 mb-6">
                  {(() => {
                    const isPresenting = form.isSubmittingAbstract === "Yes";
                    return [
                      ["Title", form.title],
                      ["First Name", form.firstName],
                      ["Last Name", form.lastName],
                      ["Other Names", form.otherNames],
                      ["Gender", form.gender],
                      ["Nationality", form.nationality],
                      ["Email", form.email],
                      ["Phone", form.phone],
                      [
                        "Institution",
                        form.institution === "Other (Specify)" ?
                          form.otherInstitution
                        : form.institution,
                      ],
                      ["Category of Participant", form.participantCategory],
                      form.isCsStudent === "Yes" && [
                        "Student ID",
                        form.studentId,
                      ],
                      form.isCsStudent === "Yes" && [
                        "Programme",
                        form.programme,
                      ],
                      form.isCsStudent === "Yes" && ["Cohort", form.cohort],
                      ["Submitting Abstract", form.isSubmittingAbstract],
                      form.eventDay && [
                        "Day",
                        EVENT_DAYS.find((d) => d.key === form.eventDay)
                          ?.full ?? form.eventDay,
                      ],
                      form.sessionTime && [
                        "Session",
                        form.sessionTime + " Session",
                      ],
                      ["Participation", form.participationType],
                      isPresenting && ["Type of Paper", form.paperType],
                      isPresenting &&
                        form.thematicAreas.length > 0 && [
                          "Thematic Areas",
                          form.thematicAreas.join(", "),
                        ],
                      isPresenting && [
                        "Name of Author(s)",
                        form.authorNames,
                      ],
                      isPresenting && [
                        "Presentation Type",
                        form.presentationType,
                      ],
                      isPresenting &&
                        form.presentationTitle && [
                          "Presentation Title",
                          form.presentationTitle,
                        ],
                      ...(isPresenting ?
                        ABSTRACT_SECTIONS.filter(({ key }) => form[key]).map(
                          ({ key, label }) => [label, form[key]],
                        )
                      : []),
                    ]
                      .filter(Boolean)
                      .map(([k, v]) => (
                        <div
                          key={k}
                          className="flex justify-between py-2 border-b border-[#eee] text-[14px]"
                        >
                          <span className="text-[#666]">{k}</span>
                          <span className="font-medium">{v}</span>
                        </div>
                      ));
                  })()}
                  <div className="flex justify-between pt-3 text-[16px] font-bold text-ug-blue">
                    <span>Registration Fee</span>
                    <span>GHS {fee}.00</span>
                  </div>
                  <p className="text-[12px] text-[#888] mt-1.5">
                    Registration fee for workshop planning and organization.
                  </p>
                </div>
                <div className="alert alert-info mb-5">
                  <strong>Payment via Paystack:</strong> You will be redirected
                  to a secure Paystack checkout to complete payment by Mobile
                  Money or debit/credit card.
                </div>
                {registrationError && (
                  <div
                    className="mb-5 rounded-[10px] border px-4 py-3 text-[13px] leading-[1.6]"
                    style={{
                      background: "#fff5f5",
                      borderColor: "#fed7d7",
                      color: "#c0392b",
                    }}
                  >
                    {registrationError}
                  </div>
                )}
                <button
                  className="btn-gold"
                  onClick={initPaystack}
                  disabled={paying}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    fontSize: 16,
                    padding: "14px",
                  }}
                >
                  {paying ?
                    "Processing payment…"
                  : <span className="inline-flex items-center gap-1.5">
                      Pay GHS {fee} via Paystack <ArrowRight size={14} />
                    </span>
                  }
                </button>
              </div>
            )}

            <div className="flex justify-between mt-7">
              {step > 0 ?
                <button className="btn-outline" onClick={back}>
                  <span className="inline-flex items-center gap-1.5">
                    <ArrowLeft size={14} /> Back
                  </span>
                </button>
              : <div />}
              {step < 3 ?
                <button className="btn-primary" onClick={next}>
                  <span className="inline-flex items-center gap-1.5">
                    Continue <ArrowRight size={14} />
                  </span>
                </button>
              : <div />}
            </div>
          </div>

          <p className="text-center mt-4 text-[13px] text-[#888]">
            Registration is open to all postgraduate students at the University
            of Ghana.
          </p>
        </div>
      </div>
    </main>
  );
}
