"use client"; // Ajouter cette ligne pour indiquer un composant client

import React, { useState, useEffect } from "react"; // Importer useState et useEffect

// Définir le type pour une facture individuelle (données parsées)
interface Invoice {
  resume: string;
  supplier: string;
  number: string;
  date: string;
  amount_with_taxes: string;
  amount_without_taxes: string;
  taxes: string;
  deadline: string;
  devise: string;
}

// Nouveau type pour stocker la facture parsée, le JSON original ET l'URL du fichier
interface ProcessedInvoice {
  parsed: Invoice;
  originalJson: string;
  file?: string; // Ajouter le champ file ici
}

// Mettre à jour InvoiceData pour utiliser ProcessedInvoice
interface InvoiceData {
  output: ProcessedInvoice[];
}

// Type pour un élément individuel dans la réponse du webhook
interface WebhookItem {
  row_number: number;
  number: string;
  name: string;
  date: string;
  json: string; // La chaîne JSON contenant les données de la facture
  file?: string; // Ajouter le champ optionnel pour l'URL du PDF (au cas où il serait aussi à ce niveau)
}

// Type pour la réponse complète du webhook (maintenant un tableau de WebhookItem)
type WebhookResponse = WebhookItem[];

// Composant de la page des factures
const InvoicesPage: React.FC = () => {
  // Utiliser useState pour stocker les données des factures (maintenant ProcessedInvoice)
  const [invoicesData, setInvoicesData] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // État pour le chargement
  const [error, setError] = useState<string | null>(null); // État pour les erreurs

  // États pour la modale
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");

  // Utiliser useEffect pour récupérer les données au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "https://n8n.srv749429.hstgr.cloud/webhook/782018a4-1ccd-4799-b171-6a6989674ecf"
        );
        if (!response.ok) {
          throw new Error(
            `Erreur HTTP: ${response.status} ${response.statusText}`
          );
        }

        const responseData: WebhookResponse = await response.json();
        console.log("Réponse brute du webhook (tableau):", responseData);

        if (!Array.isArray(responseData)) {
          console.error(
            "La réponse du webhook n'est pas un tableau:",
            responseData
          );
          throw new Error(
            "Les données reçues du webhook ne sont pas un tableau valide."
          );
        }

        const rawData: ProcessedInvoice[] = [];
        for (const item of responseData) {
          if (item && typeof item.json === "string") {
            try {
              const invoiceObject: Invoice = JSON.parse(item.json);
              if (invoiceObject && typeof invoiceObject === "object") {
                // Stocker l'objet parsé, la chaîne JSON originale ET l'URL du fichier
                // Nettoyer l'URL du fichier des backticks et espaces superflus
                let fileUrl = item.file?.trim();
                if (fileUrl?.startsWith("`") && fileUrl.endsWith("`")) {
                  fileUrl = fileUrl.substring(1, fileUrl.length - 1).trim();
                }

                rawData.push({
                  parsed: invoiceObject,
                  originalJson: item.json,
                  file: fileUrl, // Utiliser l'URL nettoyée
                });
              } else {
                console.warn(
                  "Objet JSON parsé invalide ou incomplet ignoré:",
                  item.json
                );
              }
            } catch (parseError) {
              console.error(
                "Erreur lors du parsing de la chaîne JSON:",
                item.json,
                parseError
              );
            }
          } else {
            console.warn(
              "Élément du webhook invalide ou sans clé 'json' ignoré:",
              item
            );
          }
        }

        const formattedData: InvoiceData[] = [{ output: rawData }];
        console.log("Données formatées pour l'affichage:", formattedData);
        setInvoicesData(formattedData);
      } catch (err: unknown) {
        console.error(
          "Erreur lors de la récupération ou du traitement des factures:",
          err
        );
        setError(
          `Impossible de charger les factures. Vérifiez la réponse du webhook et le parsing des données JSON. Détail: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour ouvrir la modale
  const handleShowJson = (jsonString: string) => {
    // Essayer de formater le JSON pour une meilleure lisibilité
    try {
      const parsedJson = JSON.parse(jsonString);
      setModalContent(JSON.stringify(parsedJson, null, 2)); // Indentation de 2 espaces
    } catch {
      setModalContent(jsonString); // Afficher la chaîne brute si le parsing échoue (ne devrait pas arriver)
    }
    setIsModalOpen(true);
  };

  // Fonction pour fermer la modale
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  // Afficher les factures une fois chargées (pas de changement dans les conditions loading/error)
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Barre de Navigation Factice */}
      <nav className="bg-white shadow-md mb-6">
        {" "}
        {/* Couleur de fond, ombre, marge inférieure */}
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <a href="#" className="text-xl font-semibold text-gray-700">
            The Coding Machine POC
          </a>
          {/* Conteneur pour les liens de navigation et le nouveau bouton */}
          <div className="flex items-center space-x-4">
            <ul className="flex space-x-4">
              <li>
                <a
                  href="#"
                  className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                >
                  Factures
                </a>
              </li>{" "}
              {/* Lien actif factice */}
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Clients
                </a>
              </li>
            </ul>
            {/* Nouveau bouton ajouté ici - couleur changée en bleu */}
            <a
              href="https://n8n.srv749429.hstgr.cloud/form/699eadc1-53e9-4708-8b14-7852832195eb"
              target="_blank" // Optionnel: ouvre dans un nouvel onglet
              rel="noopener noreferrer" // Sécurité pour target="_blank"
              className="ml-4 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50" // Changement des classes bg-green-* en bg-blue-* et focus:ring-green-* en focus:ring-blue-*
            >
              Formulaire d&apos;upload
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6 pt-0">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
          Liste des Factures
        </h1>
        <div className="space-y-6">
          {loading && (
            <div className="flex justify-center items-center p-10">
              {/* Vous pourriez ajouter un spinner ici */}
              <p className="text-lg text-gray-500">
                Chargement des factures...
              </p>
            </div>
          )}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Erreur:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          {!loading &&
            !error &&
            (invoicesData.length === 0 ||
              invoicesData[0].output.length === 0) && (
              <div className="text-center p-10 bg-white rounded-lg shadow">
                <p className="text-gray-500">
                  Aucune facture à afficher pour le moment.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            invoicesData.length > 0 &&
            invoicesData[0].output.length > 0 &&
            invoicesData.map((invoiceGroup, groupIndex) =>
              invoiceGroup.output && Array.isArray(invoiceGroup.output) ? (
                invoiceGroup.output.map((invoiceItem, index) => {
                  // Renommé en invoiceItem pour clarté
                  const invoice = invoiceItem.parsed; // Accéder aux données parsées
                  return (
                    <div
                      // Combine invoice number and index for a more robust key
                      key={`${invoice.number || "invoice"}-${index}`}
                      className="bg-white border border-gray-200 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="text-xl font-semibold text-blue-700">
                          {invoice.supplier}
                        </h2>
                        <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{invoice.number}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-2">
                        <strong>Résumé:</strong> {invoice.resume}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                        {" "}
                        {/* Ajout mb-4 */}
                        <p>
                          <strong>Date:</strong> {invoice.date}
                        </p>
                        <p>
                          <strong>Échéance:</strong> {invoice.deadline}
                        </p>
                        <p>
                          <strong>Montant HT:</strong>{" "}
                          {invoice.amount_without_taxes}{" "}
                          <span className="font-semibold">
                            {invoice.devise}
                          </span>
                        </p>
                        {invoice.taxes && invoice.taxes.trim() !== "" ? (
                          <p>
                            <strong>Taxes:</strong> {invoice.taxes}{" "}
                            <span className="font-semibold">
                              {invoice.devise}
                            </span>
                          </p>
                        ) : (
                          <p>
                            <strong>Taxes:</strong>{" "}
                            <span className="text-gray-400 italic">
                              Aucune donnée
                            </span>
                          </p>
                        )}
                        <p className="text-base font-medium text-gray-800 md:col-span-2 mt-1">
                          <strong>Montant TTC:</strong>{" "}
                          {invoice.amount_with_taxes}{" "}
                          <span className="font-semibold">
                            {invoice.devise}
                          </span>
                        </p>
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex justify-end space-x-2 mt-4">
                        {" "}
                        {/* Conteneur pour les boutons, ajout mt-4 */}
                        {/* Bouton pour voir le JSON */}
                        <button
                          onClick={() =>
                            handleShowJson(invoiceItem.originalJson)
                          } // Passer le JSON original
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                        >
                          Voir JSON
                        </button>
                        {/* Bouton pour voir le PDF (conditionnel) */}
                        {/* Utiliser invoiceItem.file ici */}
                        {invoiceItem.file && (
                          <a
                            href={invoiceItem.file} // Accéder à file depuis invoiceItem
                            target="_blank" // Ouvre dans un nouvel onglet
                            rel="noopener noreferrer" // Sécurité pour target="_blank"
                            className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 inline-block" // Style de bouton pour le lien
                          >
                            Voir PDF
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p key={`invalid-group-${groupIndex}`}>
                  Données de factures invalides dans ce groupe.
                </p>
              )
            )}
        </div>
      </div>

      {/* Modale pour afficher le JSON */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {" "}
            {/* Limiter hauteur et activer scroll */}
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">JSON Original</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                aria-label="Fermer"
              >
                &times; {/* Symbole croix */}
              </button>
            </div>
            <div className="p-4">
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {" "}
                {/* Préformatage et scroll horizontal */}
                <code>{modalContent}</code>
              </pre>
            </div>
            <div className="p-3 border-t text-right">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;
