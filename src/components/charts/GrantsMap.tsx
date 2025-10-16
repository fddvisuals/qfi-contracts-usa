import { useMemo, useState } from 'react';
import MapboxMap, { Marker, Popup } from 'react-map-gl';
import { GrantRecord } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/format';

const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN ??
  'pk.eyJ1IjoiZmRkdmlzdWFscyIsImEiOiJjbGZyODY1dncwMWNlM3pvdTNxNjF4dG1rIn0.wX4YYvWhm5W-5t8y5pp95w';

interface GrantsMapProps {
  records: GrantRecord[];
}

interface LocationAggregate {
  id: string;
  latitude: number;
  longitude: number;
  totalAmount: number;
  grantCount: number;
  schools: string[];
  sources: string[];
}

const GrantsMap = ({ records }: GrantsMapProps) => {
  const locations = useMemo<LocationAggregate[]>(() => {
    const grouped = new Map<
      string,
      {
        latitude: number;
        longitude: number;
        totalAmount: number;
        grantCount: number;
        schools: Set<string>;
        sources: Set<string>;
      }
    >();

    records.forEach((record) => {
      if (record.latitude == null || record.longitude == null) return;

      const key = `${record.latitude.toFixed(5)}|${record.longitude.toFixed(5)}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          latitude: record.latitude,
          longitude: record.longitude,
          totalAmount: 0,
          grantCount: 0,
          schools: new Set<string>(),
          sources: new Set<string>()
        });
      }

      const entry = grouped.get(key)!;
      entry.grantCount += 1;
      if (record.amount) {
        entry.totalAmount += record.amount;
      }
      if (record.school && record.school !== 'Unspecified') {
        entry.schools.add(record.school);
      }
      if (record.sourceFile && record.sourceFile !== 'Unspecified') {
        entry.sources.add(record.sourceFile);
      }
    });

    return Array.from(grouped.entries())
      .map(([key, value]) => ({
        id: key,
        latitude: value.latitude,
        longitude: value.longitude,
        totalAmount: value.totalAmount,
        grantCount: value.grantCount,
        schools: Array.from(value.schools),
        sources: Array.from(value.sources)
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount || b.grantCount - a.grantCount);
  }, [records]);

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const selectedLocation = useMemo(
    () => locations.find((location) => location.id === selectedLocationId) ?? null,
    [locations, selectedLocationId]
  );

  const maxAmount = useMemo(() => {
    if (locations.length === 0) return 0;
    return locations.reduce((max, location) => Math.max(max, location.totalAmount), 0);
  }, [locations]);

  return (
    <section className="rounded-3xl border border-white/5 bg-black/20 p-6 shadow-lg shadow-brand-950/20">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Geographic reach of grants</h2>
          <p className="text-sm text-white/60">
            View the concentration of grants across the United States. Marker size scales with approved funding totals.
          </p>
        </div>
      </header>
      <div className="mt-6 h-[26rem] overflow-hidden rounded-2xl border border-white/5">
        {MAPBOX_TOKEN ? (
          <div className="relative h-full w-full">
            <MapboxMap
              mapboxAccessToken={MAPBOX_TOKEN}
              initialViewState={{ longitude: -98.5795, latitude: 39.8283, zoom: 3.3 }}
              mapStyle="mapbox://styles/mapbox/dark-v11"
              style={{ width: '100%', height: '100%' }}
              onClick={() => setSelectedLocationId(null)}
            >
              {locations.map((location) => {
                const size = maxAmount > 0 ? 14 + (location.totalAmount / maxAmount) * 28 : 16;
                return (
                  <Marker
                    key={location.id}
                    longitude={location.longitude}
                    latitude={location.latitude}
                    anchor="center"
                    onClick={(event) => {
                      event.originalEvent.stopPropagation();
                      setSelectedLocationId(location.id);
                    }}
                  >
                    <div
                      className="group grid h-10 w-10 place-items-center rounded-full border border-brand-500/60 bg-brand-500/30 backdrop-blur transition hover:scale-105 hover:border-brand-300 hover:bg-brand-400/30"
                      style={{ width: size, height: size }}
                      aria-label={`${location.grantCount} grants`}
                    >
                      <span className="text-xs font-semibold text-white/90">
                        {formatNumber(location.grantCount)}
                      </span>
                    </div>
                  </Marker>
                );
              })}

              {selectedLocation && (
                <Popup
                  longitude={selectedLocation.longitude}
                  latitude={selectedLocation.latitude}
                  anchor="top"
                  focusAfterOpen={false}
                  onClose={() => setSelectedLocationId(null)}
                  closeButton={false}
                  offset={12}
                  className="rounded-2xl border border-white/10 bg-slate-950/95 p-4 text-slate-100 shadow-xl backdrop-blur"
                >
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/50">Approved funding</p>
                      <p className="text-lg font-semibold text-white">{formatCurrency(selectedLocation.totalAmount)}</p>
                    </div>
                    <div className="grid gap-2 text-sm text-white/80">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-white/40">Schools</p>
                        <ul className="space-y-1">
                          {selectedLocation.schools.length > 0 ? (
                            selectedLocation.schools.map((school) => <li key={school}>{school}</li>)
                          ) : (
                            <li className="text-white/50">Schools unspecified</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-white/40">Source files</p>
                        <ul className="space-y-1">
                          {selectedLocation.sources.length > 0 ? (
                            selectedLocation.sources.map((source) => <li key={source}>{source}</li>)
                          ) : (
                            <li className="text-white/50">Sources unspecified</li>
                          )}
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-white/50">{formatNumber(selectedLocation.grantCount)} total grants</p>
                  </div>
                </Popup>
              )}
            </MapboxMap>

            {locations.length === 0 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <p className="rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-white/60">
                  No geocoded grant records for the current filters.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-950/80 text-sm text-white/60">
            Mapbox access token missing. Set <span className="mx-1 rounded bg-white/10 px-1 py-0.5 font-mono">VITE_MAPBOX_TOKEN</span> in your environment.
          </div>
        )}
      </div>
      <p className="mt-4 text-xs uppercase tracking-widest text-white/40">
        Click any marker to explore grant totals and contributing schools.
      </p>
    </section>
  );
};

export default GrantsMap;
