import { useState } from 'react';
import { MapPin, Phone, Clock, Search, Stethoscope } from 'lucide-react';
import { vetRegions, type VetHospital } from '@/data/vetHospitals';

export default function VetHospitalPanel() {
  const [selectedRegion, setSelectedRegion] = useState(vetRegions[0].id);

  const region = vetRegions.find((r) => r.id === selectedRegion) || vetRegions[0];

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-teal-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">동물병원 찾기</h2>
            <p className="text-white/80 text-sm mt-0.5">대한민국 지역별 동물병원 정보</p>
          </div>
        </div>
      </div>

      {/* Region selector */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex flex-wrap gap-2">
          {vetRegions.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRegion(r.id)}
              aria-pressed={selectedRegion === r.id}
              className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                selectedRegion === r.id
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md'
                  : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital list */}
      <div className="px-5 pb-5">
        <div className="space-y-3">
          {region.hospitals.map((hospital, idx) => (
            <HospitalCard key={idx} hospital={hospital} />
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="border-t border-teal-50 px-5 py-3 bg-teal-50/40">
        <p className="text-xs text-gray-400 text-center">
          운영시간과 전화번호는 변동될 수 있어요. 네이버 지도로 최신 정보를 확인하세요.
        </p>
      </div>
    </div>
  );
}

function HospitalCard({ hospital }: { hospital: VetHospital }) {
  return (
    <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-100 transition-all hover:border-teal-300 hover:shadow-sm">
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 truncate">{hospital.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
            <span className="text-xs text-gray-500">{hospital.area}</span>
          </div>
        </div>
        {hospital.tags.includes('24시간') && (
          <span className="flex-shrink-0 bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-full ml-2">
            24시간
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-600">{hospital.phone}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-600">{hospital.hours}</span>
        </div>
      </div>

      {hospital.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {hospital.tags
            .filter((t) => t !== '24시간')
            .map((tag, i) => (
              <span key={i} className="text-xs bg-white px-2 py-0.5 rounded-full text-teal-700 border border-teal-200">
                {tag}
              </span>
            ))}
        </div>
      )}

      <a
        href={hospital.naverSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        네이버 지도에서 보기
      </a>
    </div>
  );
}
