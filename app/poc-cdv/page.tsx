"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; // Importer le composant Link

interface Voyage {
  permalink: string;
  image_principale: string;
  description: string;
  titre: string;
}

const PocCdvPage: React.FC = () => {
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        // data est [{...}], et data[0].json est une chaîne JSON du tableau de voyages
        if (!Array.isArray(data) || typeof data[0]?.json !== "string") {
          throw new Error("Format inattendu");
        }
        // On parse la string JSON pour obtenir le tableau d'objets voyage
        const voyagesArray = JSON.parse(data[0].json);
        setVoyages(voyagesArray);
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
            <li>
              <a href="/invoices" className="text-gray-600 hover:text-blue-600">
                Factures
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mx-auto p-6 pt-0">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
          Inspirations de voyages
        </h1>
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
