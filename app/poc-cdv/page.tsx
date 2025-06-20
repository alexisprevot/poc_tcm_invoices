"use client";

import { Link } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Voyage {
  permalink: string;
  image_principale: string;
  description: string;
  titre: string;
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
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-white shadow-md mb-6">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold text-gray-700">
            POC CDV - Voyages
          </Link>
          <ul className="flex space-x-4">
            <li>
              <a
                href="/poc-cdv"
                className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
              >
                Voyages
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mx-auto p-6 pt-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 border-b pb-2">
            Inspirations de voyages
          </h1>
          <button
            type="button"
            className="ml-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 text-sm"
            onClick={() => setInfoModalOpen(true)}
          >
            ℹ️ Informations voyageurs
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Découvrez nos voyages inspirants et les informations utiles pour
          chaque destination.
        </p>
        {infoModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Informations voyageurs
                </h3>
                <button
                  onClick={() => setInfoModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  aria-label="Fermer"
                >
                  &times;
                </button>
              </div>
              <div className="p-4 text-sm space-y-8">
                {Array.isArray(countryInfo) && countryInfo.length > 0 ? (
                  countryInfo.map((info) => (
                    <div
                      key={info.code}
                      className="bg-gray-100 rounded-lg p-4 shadow-inner"
                    >
                      <div dangerouslySetInnerHTML={{ __html: info.text }} />
                    </div>
                  ))
                ) : (
                  <div>Aucune information voyageur disponible.</div>
                )}
              </div>
              <div className="p-3 border-t text-right">
                <button
                  onClick={() => setInfoModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
        {loading && (
          <div className="flex justify-center items-center p-10">
            <p className="text-lg text-gray-500">Chargement des voyages...</p>
          </div>
        )}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Erreur :</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {!loading && !error && voyages.length === 0 && (
          <div className="text-center p-10 bg-white rounded-lg shadow">
            <p className="text-gray-500">Aucun voyage à afficher.</p>
          </div>
        )}
        {!loading && !error && voyages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voyages.map((voyage, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200 flex flex-col"
              >
                <a
                  href={voyage.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={
                      "https://www.cercledesvoyages.com" +
                      voyage.image_principale
                    }
                    alt={voyage.titre}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                </a>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">
                  {voyage.titre}
                </h2>
                <div
                  className="text-gray-600 text-sm mb-4 flex-1"
                  dangerouslySetInnerHTML={{ __html: voyage.description }}
                />
                <a
                  href={"https://www.cercledesvoyages.com" + voyage.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-center"
                >
                  Voir ce voyage
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PocCdvPage;
