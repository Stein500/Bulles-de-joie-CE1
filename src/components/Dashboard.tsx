import React, { useMemo } from 'react';
import { 
  Users, BookOpen, Award, TrendingUp, 
  GraduationCap, BarChart3 
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Student, Subject, Grade, SchoolPeriod } from '../types';
import { calculateAverage, getMention } from '../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface DashboardProps {
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  currentPeriod: SchoolPeriod | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  students, 
  subjects, 
  grades,
  currentPeriod 
}) => {
  const activeStudents = students.filter(s => s.isActive);
  const activeSubjects = subjects.filter(s => s.isActive);
  
  const stats = useMemo(() => {
    const defaultDistribution = { excellent: 0, tresBien: 0, bien: 0, passable: 0, insuffisant: 0 };
    if (!currentPeriod) return { classAverage: 0, distribution: defaultDistribution, topStudent: null, studentAverages: [] };
    
    const periodGrades = grades.filter(g => g.periodId === currentPeriod.id);
    
    // Calculate class average
    let totalAvg = 0;
    const studentAverages: { student: Student; average: number }[] = [];
    
    activeStudents.forEach(student => {
      const studentGrades = periodGrades.filter(g => g.studentId === student.id);
      const avg = calculateAverage(studentGrades, activeSubjects);
      if (studentGrades.length > 0) {
        totalAvg += avg;
        studentAverages.push({ student, average: avg });
      }
    });
    
    const classAverage = studentAverages.length > 0 ? totalAvg / studentAverages.length : 0;
    
    // Distribution by mention
    const distribution = {
      excellent: studentAverages.filter(s => s.average >= 16).length,
      tresBien: studentAverages.filter(s => s.average >= 14 && s.average < 16).length,
      bien: studentAverages.filter(s => s.average >= 12 && s.average < 14).length,
      passable: studentAverages.filter(s => s.average >= 10 && s.average < 12).length,
      insuffisant: studentAverages.filter(s => s.average < 10).length
    };
    
    // Top student
    const topStudent = studentAverages.sort((a, b) => b.average - a.average)[0] || null;
    
    return { classAverage, distribution, topStudent, studentAverages };
  }, [activeStudents, activeSubjects, grades, currentPeriod]);

  const mentionChartData = {
    labels: ['Excellent', 'Très Bien', 'Bien', 'Passable', 'Insuffisant'],
    datasets: [{
      data: [
        stats.distribution.excellent || 0,
        stats.distribution.tresBien || 0,
        stats.distribution.bien || 0,
        stats.distribution.passable || 0,
        stats.distribution.insuffisant || 0
      ],
      backgroundColor: ['#FFD700', '#22C55E', '#3B82F6', '#F59E0B', '#EF4444'],
      borderWidth: 3,
      borderColor: '#fff'
    }]
  };

  const subjectAveragesData = useMemo(() => {
    if (!currentPeriod) return null;
    
    const periodGrades = grades.filter(g => g.periodId === currentPeriod.id);
    
    const subjectAvgs = activeSubjects.map(subject => {
      const subjectGrades = periodGrades.filter(g => g.subjectId === subject.id);
      if (subjectGrades.length === 0) return { name: subject.name, avg: 0, color: subject.color };
      
      const avg = subjectGrades.reduce((sum, g) => sum + (g.value / g.maxValue) * 20, 0) / subjectGrades.length;
      return { name: subject.name, avg, color: subject.color };
    });
    
    return {
      labels: subjectAvgs.map(s => s.name),
      datasets: [{
        label: 'Moyenne par matière',
        data: subjectAvgs.map(s => s.avg),
        backgroundColor: subjectAvgs.map(s => s.color),
        borderRadius: 8,
        borderWidth: 0
      }]
    };
  }, [activeSubjects, grades, currentPeriod]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-fuchsia-500 via-rose-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
        <h1 className="text-2xl font-bold mb-2">🎓 Tableau de Bord</h1>
        <p className="opacity-90">
          {currentPeriod ? `${currentPeriod.customName} - ${currentPeriod.academicYear}` : 'Aucune période sélectionnée'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Élèves"
          value={activeStudents.length}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          label="Matières"
          value={activeSubjects.length}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Moyenne Classe"
          value={stats.classAverage.toFixed(1)}
          suffix="/20"
          color="from-fuchsia-500 to-rose-500"
        />
        <StatCard
          icon={<Award className="w-6 h-6" />}
          label="Notes saisies"
          value={grades.filter(g => g.periodId === currentPeriod?.id).length}
          color="from-orange-500 to-amber-500"
        />
      </div>

      {/* Top Student */}
      {stats.topStudent && (
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 text-white">
            <p className="text-sm opacity-90 font-medium">🏆 Meilleur(e) élève</p>
            <p className="font-bold text-xl">
              {stats.topStudent.student.firstName} {stats.topStudent.student.lastName}
            </p>
          </div>
          <div className="text-right text-white">
            <p className="text-3xl font-bold">{stats.topStudent.average.toFixed(1)}</p>
            <p className="text-sm opacity-90">/20</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-fuchsia-500" />
            Répartition des mentions
          </h3>
          <div className="h-64 flex items-center justify-center">
            {stats.distribution && Object.values(stats.distribution).some(v => v > 0) ? (
              <Doughnut 
                data={mentionChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { font: { size: 11 }, padding: 15 }
                    }
                  },
                  cutout: '60%'
                }}
              />
            ) : (
              <div className="text-center">
                <p className="text-gray-400 text-lg">📊</p>
                <p className="text-gray-400">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Subject Averages Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-fuchsia-500" />
            Moyennes par matière
          </h3>
          <div className="h-64">
            {subjectAveragesData && subjectAveragesData.datasets[0].data.some(v => v > 0) ? (
              <Bar 
                data={subjectAveragesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  scales: {
                    x: { 
                      max: 20, 
                      min: 0,
                      grid: { color: '#f0f0f0' }
                    },
                    y: {
                      grid: { display: false }
                    }
                  },
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-400 text-lg">📈</p>
                  <p className="text-gray-400">Aucune donnée disponible</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold text-gray-800 mb-4">📋 Statistiques détaillées</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats.distribution || {}).map(([key, value]) => {
            const mention = getMention(
              key === 'excellent' ? 16 :
              key === 'tresBien' ? 14 :
              key === 'bien' ? 12 :
              key === 'passable' ? 10 : 5
            );
            return (
              <div key={key} className="text-center p-4 bg-gradient-to-br from-gray-50 to-fuchsia-50 rounded-xl">
                <p className="text-3xl mb-1">{mention.emoji}</p>
                <p className="font-bold text-2xl text-gray-800">{value}</p>
                <p className="text-xs text-gray-500 font-medium">
                  {key === 'excellent' ? 'Excellent' :
                   key === 'tresBien' ? 'Très Bien' :
                   key === 'bien' ? 'Bien' :
                   key === 'passable' ? 'Passable' : 'Insuffisant'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, suffix, color }) => (
  <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow">
    <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white mb-3 shadow-md`}>
      {icon}
    </div>
    <p className="text-gray-500 text-sm font-medium">{label}</p>
    <p className="text-2xl font-bold text-gray-800">
      {value}<span className="text-sm font-normal text-gray-400">{suffix}</span>
    </p>
  </div>
);
