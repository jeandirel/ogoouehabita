import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { ContactAgencyPanel } from "@/components/property/contact-agency-panel";
import { AiQuestionForm } from "@/components/property/ai-question-form";
import { PropertyDetailActions } from "@/components/property/property-detail-actions";
import { PropertyGallery } from "@/components/property/property-gallery";
import { stitchImage } from "@/data/image-manifest";
import type { Property } from "@/lib/types";

export function PropertyDetailView({ property }: { property: Property }) {
  const transactionLabel = property.transactionType === "location" ? "Location" : "Vente";
  const galleryImages = property.gallery ?? [{ image: property.image, caption: property.title }];
  const passportEligible = property.passportScore !== undefined && property.reference !== undefined;
  const quickStats: { icon: string; label: string; value?: string }[] = property.detailSpecs
    ? property.detailSpecs.map((s) => ({ icon: s.icon, label: s.label, value: s.value }))
    : property.specs.map((s) => ({ icon: s.icon, label: s.label }));

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Header bar */}
      <div className="w-full bg-surface-container-low pt-space-md pb-space-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-space-md">
          <div>
            <div className="flex flex-wrap items-center gap-space-sm mb-2">
              <span className="bg-primary text-on-primary px-space-sm py-0.5 rounded-full text-label-sm font-bold uppercase tracking-wider">
                {transactionLabel}
              </span>
              {property.status === "en_attente_verification" && (
                <span className="bg-surface text-on-surface-variant px-space-sm py-0.5 rounded-full text-label-sm font-bold flex items-center gap-1">
                  <Icon name="hourglass_top" className="text-[14px]" />
                  En cours de vérification
                </span>
              )}
              {property.passportScore !== undefined && (
                <span className="bg-primary-fixed-dim/40 text-primary px-space-sm py-0.5 rounded-full text-label-sm font-bold flex items-center gap-1">
                  <Icon name="verified" filled className="text-[14px]" />
                  Passeport Ogooué — {property.passportScore}% vérifié
                </span>
              )}
              {property.reference && (
                <span className="text-on-surface-variant text-body-sm">Réf: {property.reference}</span>
              )}
            </div>
            <h1 className="font-headline-xl text-primary tracking-tight">{property.title}</h1>
            <p className="text-body-lg text-on-surface-variant mt-1 flex items-center gap-2">
              <Icon name="location_on" className="text-secondary" />
              {property.addressLine ?? property.location}
            </p>
          </div>
          <PropertyDetailActions property={property} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-lg w-full">
        <PropertyGallery images={galleryImages} hasRealPhoto={property.hasRealPhoto} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl mt-space-xl">
          <div className="lg:col-span-8 flex flex-col gap-space-xl">
            {/* Quick stats */}
            <div className="bg-surface-container-low p-space-lg rounded-xl shadow-sm flex flex-wrap justify-between items-center gap-space-md">
              {quickStats.map((spec, index) => (
                <div key={`${spec.label}-${index}`} className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <Icon name={spec.icon} className="text-[24px]" />
                  </div>
                  <div>
                    {spec.value ? (
                      <>
                        <div className="text-label-sm text-on-surface-variant">{spec.label}</div>
                        <div className="font-headline-sm text-primary">{spec.value}</div>
                      </>
                    ) : (
                      <div className="font-headline-sm text-primary">{spec.label}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {property.description && (
              <div>
                <h2 className="font-headline-md text-primary mb-space-sm">Description du bien</h2>
                <p className="text-body-lg text-on-surface-variant leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}

            {property.features && (
              <div>
                <h2 className="font-headline-md text-primary mb-space-md">Caractéristiques principales</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-space-sm">
                  {property.features.map((feature) => (
                    <div key={feature.label} className="bg-surface-container-low p-space-md rounded-xl">
                      <div className="text-label-sm text-on-surface-variant">{feature.label}</div>
                      <div className="font-label-md text-on-surface mt-1">{feature.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.amenities && (
              <div>
                <h2 className="font-headline-md text-primary mb-space-md">Équipements &amp; Commodités</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-body-md text-on-surface">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Icon name="check" className="text-secondary" /> {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.passportChecklist && (
              <div className="bg-surface-container-low p-space-lg rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-space-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                      {property.passportScore}%
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-primary">Passeport Ogooué Détaillé</h3>
                      <p className="text-body-sm text-on-surface-variant">
                        Certificat de conformité et d&apos;audit foncier
                      </p>
                    </div>
                  </div>
                  <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-label-sm font-bold">
                    Certifié National
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-4 border-t border-outline-variant/30">
                  {property.passportChecklist.map((item) => (
                    <div key={item.label}>
                      <div className="text-label-sm text-on-surface-variant">{item.label}</div>
                      <div className="font-label-md text-on-surface flex items-center gap-1 mt-1">
                        <Icon name="verified" className="text-[18px] text-secondary" /> {item.value}
                      </div>
                    </div>
                  ))}
                </div>
                {passportEligible && (
                  <Link
                    href={`/bien/${property.slug}/passeport`}
                    className="inline-flex items-center gap-2 text-label-md text-primary font-bold hover:underline mt-space-md"
                  >
                    Voir le Passeport complet <Icon name="arrow_forward" className="text-[18px]" />
                  </Link>
                )}
              </div>
            )}

            {property.neighborhoodBlurb && (
              <div>
                <h2 className="font-headline-md text-primary mb-space-md">Localisation &amp; Quartier</h2>
                <div
                  className="w-full h-80 rounded-xl overflow-hidden shadow-sm bg-cover bg-center"
                  style={{ backgroundImage: `url('${stitchImage.misc_carte_illustrative_libreville.path}')` }}
                  role="img"
                  aria-label={stitchImage.misc_carte_illustrative_libreville.alt}
                />
                <p className="text-body-sm text-on-surface-variant mt-3">{property.neighborhoodBlurb}</p>
              </div>
            )}

            <div className="bg-primary-container text-on-primary p-space-lg rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-space-sm">
                <Icon name="smart_toy" className="text-primary-fixed-dim text-[32px]" />
                <div>
                  <h3 className="font-headline-sm text-on-primary">Ogooué AI — Assistant Immobilier</h3>
                  <p className="text-body-sm text-on-primary-container">
                    Posez vos questions sur ce bien en temps réel
                  </p>
                </div>
              </div>
              <AiQuestionForm />
            </div>
          </div>

          <div className="lg:col-span-4">
            <ContactAgencyPanel property={property} />
          </div>
        </div>
      </div>
    </div>
  );
}
