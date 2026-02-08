import { useStore } from '../stores/useStore';
import { Users, BookOpen, Award, TrendingUp, GraduationCap, BarChart3 } from 'lucide-react';
import { getStudentAverage, getClassAverage, getRanks, getMention } from '../lib/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Dashboard() {
  const { students, subjects, grades, periods, activePeriodId, darkMode, settings, mentionRules } = useStore();
  const showRanks = settings.showRanks;
  const noteMax = settings.noteMax;
  const noteDP = settings.noteDecimalPlaces;

  const classAvg = getClassAverage(students, activePeriodId, grades, subjects);
  const ranks = getRanks(students, activePeriodId, grades, subjects);

  const studentAverages = students
    .map((s) => {
      const avg = getStudentAverage(s.id, activePeriodId, grades, subjects);
      return { ...s, average: avg };
    })
    .filter((s) => s.average !== null)
    .sort((a, b) => (b.average || 0) - (a.average || 0));

  const top5 = studentAverages.slice(0, 5);

  // Mention distribution based on custom rules
  const sortedMentionRules = [...mentionRules].sort((a, b) => b.minAverage - a.minAverage);
  const mentionData = sortedMentionRules.map((rule, idx) => {
    const nextMin = idx < sortedMentionRules.length - 1 ? sortedMentionRules[idx].minAverage : 0;
    const prevMin = idx > 0 ? sortedMentionRules[idx - 1].minAverage : 21;
    return {
      name: `${rule.emoji} ${rule.label} (≥${rule.minAverage})`,
      count: studentAverages.filter((s) => {
        const avg = s.average || 0;
        return avg >= nextMin && avg < prevMin;
      }).length,
      color: rule.color,
    };
  }).filter((d) => d.count > 0);

  // Subject averages for chart
  const subjectData = subjects.map((sub) => {
    const subGrades = grades.filter((g) => g.subjectId === sub.id && g.periodId === activePeriodId && g.value !== null);
    const avg = subGrades.length > 0 ? subGrades.reduce((a, g) => a + (g.value || 0), 0) / subGrades.length : 0;
    return { name: sub.name.substring(0, 8), moyenne: Math.round(avg * 100) / 100, fill: sub.color };
  });

  const activePeriod = periods.find((p) => p.id === activePeriodId);

  const cardClass = darkMode
    ? 'bg-gray-800 border border-gray-700'
    : 'bg-white border border-rose-clair/20';

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex flex-wrap items-center gap-3">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => useStore.getState().setActivePeriod(p.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              p.id === activePeriodId
                ? 'gradient-principal text-white shadow-lg'
                : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-white text-gray-600 shadow hover:shadow-md'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Users} label="Élèves" value={students.length} color="#FF69B4" darkMode={darkMode} />
        <StatCard icon={BookOpen} label="Matières" value={subjects.length} color="#4169E1" darkMode={darkMode} />
        <StatCard
          icon={TrendingUp}
          label="Moy. classe"
          value={classAvg !== null ? `${classAvg.toFixed(noteDP)}/${noteMax}` : '—'}
          color="#28A745"
          darkMode={darkMode}
        />
        <StatCard
          icon={Award}
          label="Notes saisies"
          value={grades.filter((g) => g.periodId === activePeriodId && g.value !== null).length}
          color="#FF8C00"
          darkMode={darkMode}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subject averages */}
        <div className={`rounded-2xl p-5 shadow-lg ${cardClass}`}>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
            <BarChart3 size={18} className="text-rose-bdj" />
            Moyennes par matière — {activePeriod?.name}
          </h3>
          {subjectData.length > 0 && grades.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, noteMax]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="moyenne" radius={[6, 6, 0, 0]}>
                  {subjectData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] items-center justify-center text-sm text-gray-400">
              Aucune note saisie pour cette période
            </div>
          )}
        </div>

        {/* Mention distribution */}
        <div className={`rounded-2xl p-5 shadow-lg ${cardClass}`}>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
            <GraduationCap size={18} className="text-fuchsia-bdj" />
            Répartition des mentions
          </h3>
          {mentionData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={mentionData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="count">
                    {mentionData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {mentionData.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="h-3 w-3 rounded-full" style={{ background: m.color }} />
                    <span>{m.name}: <strong>{m.count}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-gray-400">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </div>

      {/* Top students */}
      <div className={`rounded-2xl p-5 shadow-lg ${cardClass}`}>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
          <Award size={18} className="text-yellow-500" />
          {showRanks ? 'Top 5' : 'Meilleurs élèves'} — {activePeriod?.name}
        </h3>
        {top5.length > 0 ? (
          <div className="space-y-2">
            {top5.map((s, i) => {
              const mention = getMention(s.average || 0, mentionRules);
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-4 rounded-xl p-3 transition ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-r from-rose-pale to-white'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
                      i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-700' : 'bg-gray-300'
                    }`}
                  >
                    {showRanks ? (ranks.get(s.id) || i + 1) : (i + 1)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {s.lastName} {s.firstName}
                    </p>
                    {mention && (
                      <p className="text-xs text-gray-500">{mention.emoji} {mention.label}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: mention?.color || '#999' }}>
                      {s.average?.toFixed(noteDP)}/{noteMax}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-gray-400">Aucune note saisie</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, darkMode }: {
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  label: string;
  value: string | number;
  color: string;
  darkMode: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 shadow-lg transition-transform hover:scale-[1.02] ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold" style={{ color }}>
            {value}
          </p>
        </div>
        <div className="rounded-xl p-2" style={{ backgroundColor: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );
}
