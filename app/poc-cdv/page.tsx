"use client";

import React, { useEffect, useState } from "react";

interface Voyage {
  permalink: string;
  image_principale: string;
  description: string;
  titre: string;
}

const TAGS = [
  "Aventure",
  "Nature",
  "Culture",
  "Gastronomie",
  "Luxe",
  "Famille",
  "Bien-être",
  "Plage",
  "Safari",
  "Découverte",
  "City Break",
  "Road Trip",
];

function getRandomTags(count = 5) {
  const shuffled = [...TAGS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const PocCdvPage: React.FC = () => {
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [countryInfo, setCountryInfo] = useState<
    { code: string; text: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  useEffect(() => {
    const fetchVoyages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://n8n.srv749429.hstgr.cloud/webhook/0481451b-7ba4-43aa-aa9b-3a4edad8a14a"
        );
        if (!response.ok)
          throw new Error("Erreur lors du chargement des voyages");
        const data = await response.json();

        //const databis = await response.info_travel();
        // data est [{...}], et data[0].json est une chaîne JSON du tableau de voyages
        if (!Array.isArray(data) || typeof data[0]?.json !== "string") {
          throw new Error("Format inattendu");
        }
        // On parse la string JSON pour obtenir le tableau d'objets voyage
        const voyagesArray = JSON.parse(data[0].json);
        const countryInfo = JSON.parse(data[0].info_travel);
        console.log(
          "countryInfo reçu",
          countryInfo,
          Array.isArray(countryInfo)
        );
        console.log(
          "Rendu MODALE - countryInfo:",
          countryInfo,
          "isArray?",
          Array.isArray(countryInfo),
          "length",
          countryInfo.length
        );
        setVoyages(voyagesArray);
        setCountryInfo(countryInfo);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur inconnue lors du chargement"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchVoyages();
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-gray-100 min-h-screen">
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur shadow-lg mb-8">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a className="text-2xl font-extrabold text-blue-700 tracking-tight flex items-center gap-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#2563EB" />
              <path d="M10 22l6-12 6 12H10z" fill="#fff" />
            </svg>
            POC CDV - Voyages
          </a>
          <ul className="flex space-x-6">
            <li>
              <a
                href="/poc-cdv"
                className="text-blue-700 font-semibold border-b-2 border-blue-700 pb-1 hover:text-blue-900 transition"
              >
                Voyages
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">
              Inspirations de voyages
            </h1>
            <p className="text-gray-600 text-lg">
              Découvrez nos voyages inspirants et les informations utiles pour
              chaque destination.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-60 transition"
            onClick={() => setInfoModalOpen(true)}
          >
            <span className="text-xl">ℹ️</span>
            Informations voyageurs
          </button>
        </div>

        {/* Modal */}
        {infoModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-blue-100 relative animate-slide-up">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-2xl font-bold text-blue-700">
                  Informations voyageurs
                </h3>
                <button
                  onClick={() => setInfoModalOpen(false)}
                  className="text-gray-400 hover:text-blue-600 text-3xl font-bold transition"
                  aria-label="Fermer"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 text-base space-y-8">
                {Array.isArray(countryInfo) && countryInfo.length > 0 ? (
                  countryInfo.map((info) => (
                    <div
                      key={info.code}
                      className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 shadow-inner"
                    >
                      <div dangerouslySetInnerHTML={{ __html: info.text }} />
                    </div>
                  ))
                ) : (
                  <div>Aucune information voyageur disponible.</div>
                )}
              </div>
              <div className="p-4 border-t text-right">
                <button
                  onClick={() => setInfoModalOpen(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center p-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
            <p className="ml-6 text-xl text-blue-600 font-semibold">
              Chargement des voyages...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-lg shadow mb-8 flex items-center gap-3">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path stroke="currentColor" strokeWidth="2" d="M12 8v4m0 4h.01" />
            </svg>
            <div>
              <strong className="font-bold">Erreur :</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          </div>
        )}

        {/* No voyages */}
        {!loading && !error && voyages.length === 0 && (
          <div className="text-center p-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <p className="text-gray-500 text-lg">Aucun voyage à afficher.</p>
          </div>
        )}

        {/* Voyages grid */}
        {!loading && !error && voyages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {voyages.map((voyage, idx) => {
              const mainTag = getRandomTags(1)[0]; // Tag principal dans l'image
              // Tags secondaires : on retire le tag principal de la liste pour éviter les doublons
              const secondaryTags = getRandomTags(6)
                .filter((tag) => tag !== mainTag)
                .slice(0, 5 + Math.floor(Math.random() * 2)); // 5 ou 6 tags

              return (
                <div
                  key={idx}
                  className="group bg-white border border-gray-200 rounded-2xl shadow-xl p-0 flex flex-col overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <a
                    href={voyage.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative"
                  >
                    <img
                      src={
                        "https://www.cercledesvoyages.com" +
                        voyage.image_principale
                      }
                      alt={voyage.titre}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <path
                          d="M20.59 13.41l-7.59 7.59a2 2 0 0 1-2.83 0l-7.59-7.59a2 2 0 0 1 0-2.83l7.59-7.59a2 2 0 0 1 2.83 0l7.59 7.59a2 2 0 0 1 0 2.83z"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                      </svg>
                      {mainTag}
                    </span>
                  </a>
                  <div className="flex-1 flex flex-col p-6">
                    <h2 className="text-2xl font-bold text-blue-700 mb-2 group-hover:text-blue-900 transition">
                      {voyage.titre}
                    </h2>
                    {/* Tags secondaires */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {secondaryTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold shadow hover:bg-blue-600 hover:text-white transition cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div
                      className="text-gray-600 text-base mb-4 flex-1"
                      dangerouslySetInnerHTML={{ __html: voyage.description }}
                    />
                    <a
                      href={
                        "https://www.cercledesvoyages.com" + voyage.permalink
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-full font-semibold shadow hover:from-blue-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-60 text-center transition"
                    >
                      Voir ce voyage
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Animations */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default PocCdvPage;
