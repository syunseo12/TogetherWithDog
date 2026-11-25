import { useState } from 'react';
import { Heart, Droplets, Activity, Stethoscope, Sparkles } from 'lucide-react';
import type { DogPartInfo } from '@/data/dogParts';

interface InfoPanelProps {
  partInfo: DogPartInfo;
  onWritePost: () => void;
}

type Tab = 'diseases' | 'cleaning' | 'behaviors';

export default function InfoPanel({ partInfo, onWritePost }: InfoPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('diseases');

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{partInfo.emoji}</span>
          <div>
            <h2 className="text-2xl font-bold text-white">{partInfo.label} 정보</h2>
            <p className="text-white/80 text-sm mt-0.5">질병, 세척법, 행동 반응을 확인하세요</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-amber-100">
        <TabButton
          active={activeTab === 'diseases'}
          onClick={() => setActiveTab('diseases')}
          icon={<Stethoscope className="w-4 h-4" />}
          label="질병"
        />
        <TabButton
          active={activeTab === 'cleaning'}
          onClick={() => setActiveTab('cleaning')}
          icon={<Droplets className="w-4 h-4" />}
          label="세척법"
        />
        <TabButton
          active={activeTab === 'behaviors'}
          onClick={() => setActiveTab('behaviors')}
          icon={<Activity className="w-4 h-4" />}
          label="행동 반응"
        />
      </div>

      {/* Content */}
      <div className="p-6 max-h-[420px] overflow-y-auto">
        {activeTab === 'diseases' && (
          <div className="space-y-4">
            {partInfo.diseases.map((disease, idx) => (
              <div key={idx} className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-rose-500" fill="currentColor" />
                  <h3 className="font-bold text-rose-900">{disease.name}</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{disease.description}</p>
                <div>
                  <p className="text-xs font-semibold text-rose-700 mb-1.5">주요 증상</p>
                  <div className="flex flex-wrap gap-1.5">
                    {disease.symptoms.map((symptom, i) => (
                      <span key={i} className="text-xs bg-white px-2.5 py-1 rounded-full text-rose-700 border border-rose-200">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cleaning' && (
          <div className="space-y-4">
            <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-5 h-5 text-sky-500" />
                <h3 className="font-bold text-sky-900">세척 방법</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{partInfo.cleaning.method}</p>
            </div>

            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-amber-900">권장 주기</h3>
              </div>
              <p className="text-lg font-bold text-amber-700">{partInfo.cleaning.frequency}</p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
              <h3 className="font-bold text-emerald-900 mb-3">세척 팁</h3>
              <ul className="space-y-2">
                {partInfo.cleaning.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'behaviors' && (
          <div className="space-y-4">
            {partInfo.behaviors.map((behavior, idx) => (
              <div key={idx} className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
                <h3 className="font-bold text-violet-900 mb-1">{behavior.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{behavior.description}</p>
                <div className="bg-white rounded-xl p-3 border border-violet-100">
                  <p className="text-xs font-semibold text-violet-600 mb-1">무슨 의미일까?</p>
                  <p className="text-sm text-gray-700">{behavior.meaning}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write post button */}
      <div className="border-t border-amber-100 p-4 bg-amber-50/50">
        <button
          onClick={onWritePost}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold hover:from-amber-500 hover:to-orange-500 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          {partInfo.label} 관련 경험 나누기
        </button>
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
        active
          ? 'border-amber-500 text-amber-700 bg-amber-50/50'
          : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
