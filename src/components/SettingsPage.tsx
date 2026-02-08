import { useState } from 'react';
import { useStore, defaultAppreciationRules, defaultMentionRules, defaultDemoNames } from '../stores/useStore';
import type { AppreciationRule, MentionRule } from '../stores/useStore';
import { Upload, Palette, School, Save, Eye, EyeOff, Plus, Trash2, Edit3, X, Check, RotateCcw, BookOpen, Award, Users, FileText, Type, Pencil, Hash } from 'lucide-react';
import { uid } from '../lib/helpers';

export function SettingsPage() {
  const {
    settings, updateSettings, addToast, darkMode,
    appreciationRules, addAppreciationRule, updateAppreciationRule, deleteAppreciationRule, setAppreciationRules,
    mentionRules, addMentionRule, updateMentionRule, deleteMentionRule, setMentionRules,
    demoNames, addDemoFirstNameMale, removeDemoFirstNameMale,
    addDemoFirstNameFemale, removeDemoFirstNameFemale,
    addDemoLastName, removeDemoLastName, setDemoNames,
    renameDemoFirstNameMale, renameDemoFirstNameFemale, renameDemoLastName,
  } = useStore();

  const [editingAppreciation, setEditingAppreciation] = useState<AppreciationRule | null>(null);
  const [editingMention, setEditingMention] = useState<MentionRule | null>(null);
  const [showAppreciationForm, setShowAppreciationForm] = useState(false);
  const [showMentionForm, setShowMentionForm] = useState(false);
  const [demoTab, setDemoTab] = useState<'male' | 'female' | 'last'>('male');
  const [newDemoName, setNewDemoName] = useState('');
  const [editingDemoName, setEditingDemoName] = useState<string | null>(null);
  const [editDemoNameValue, setEditDemoNameValue] = useState('');

  // Icon button classes — ALWAYS VISIBLE with proper contrast
  const iconEdit = `rounded-lg p-1.5 transition-all ${darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/40' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100'}`;
  const iconDelete = `rounded-lg p-1.5 transition-all ${darkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-900/40' : 'text-red-500 hover:text-red-700 hover:bg-red-100'}`;

  const handleImageUpload = (field: 'logo' | 'cachet' | 'signatureDirecteur' | 'signatureEnseignant') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 800;
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width > height) { height = (height / width) * maxSize; width = maxSize; }
            else { width = (width / height) * maxSize; height = maxSize; }
          }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/png', 0.9);
          updateSettings({ [field]: base64 });
          if (field === 'logo') {
            const sc = document.createElement('canvas'); sc.width = 50; sc.height = 50;
            const sctx = sc.getContext('2d');
            if (sctx) {
              sctx.drawImage(img, 0, 0, 50, 50);
              const data = sctx.getImageData(0, 0, 50, 50).data;
              let r = 0, g = 0, b = 0, count = 0;
              for (let i = 0; i < data.length; i += 16) {
                if (data[i + 3] > 128 && (data[i] + data[i + 1] + data[i + 2]) > 30 && (data[i] + data[i + 1] + data[i + 2]) < 700) {
                  r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
                }
              }
              if (count > 0) {
                const hex = `#${Math.round(r / count).toString(16).padStart(2, '0')}${Math.round(g / count).toString(16).padStart(2, '0')}${Math.round(b / count).toString(16).padStart(2, '0')}`;
                updateSettings({ primaryColor: hex });
                addToast(`Couleur dominante : ${hex}`, 'info');
              }
            }
          }
          addToast(`${field === 'logo' ? 'Logo' : field === 'cachet' ? 'Cachet' : 'Signature'} uploadé ✓`, 'success');
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // Appreciation handlers
  const openNewAppreciation = () => { setEditingAppreciation({ id: uid(), min: 0, max: settings.noteMax, label: '', color: '#4169E1' }); setShowAppreciationForm(true); };
  const openEditAppreciation = (r: AppreciationRule) => { setEditingAppreciation({ ...r }); setShowAppreciationForm(true); };
  const saveAppreciation = () => {
    if (!editingAppreciation || !editingAppreciation.label.trim()) { addToast('Libellé obligatoire', 'error'); return; }
    if (editingAppreciation.min > editingAppreciation.max) { addToast('Min doit être ≤ Max', 'error'); return; }
    const exists = appreciationRules.find((r) => r.id === editingAppreciation.id);
    if (exists) { updateAppreciationRule(editingAppreciation.id, editingAppreciation); addToast('Modifiée ✓', 'success'); }
    else { addAppreciationRule(editingAppreciation); addToast('Ajoutée ✓', 'success'); }
    setShowAppreciationForm(false); setEditingAppreciation(null);
  };

  // Mention handlers
  const openNewMention = () => { setEditingMention({ id: uid(), minAverage: 0, label: '', emoji: '📌', color: '#4169E1' }); setShowMentionForm(true); };
  const openEditMention = (r: MentionRule) => { setEditingMention({ ...r }); setShowMentionForm(true); };
  const saveMention = () => {
    if (!editingMention || !editingMention.label.trim()) { addToast('Libellé obligatoire', 'error'); return; }
    const exists = mentionRules.find((r) => r.id === editingMention.id);
    if (exists) { updateMentionRule(editingMention.id, editingMention); addToast('Modifiée ✓', 'success'); }
    else { addMentionRule(editingMention); addToast('Ajoutée ✓', 'success'); }
    setShowMentionForm(false); setEditingMention(null);
  };

  // Demo name add
  const handleAddDemoName = () => {
    const name = newDemoName.trim();
    if (!name) return;
    if (demoTab === 'male') {
      if (demoNames.firstNamesMale.includes(name)) { addToast('Déjà existant', 'error'); return; }
      addDemoFirstNameMale(name);
    } else if (demoTab === 'female') {
      if (demoNames.firstNamesFemale.includes(name)) { addToast('Déjà existant', 'error'); return; }
      addDemoFirstNameFemale(name);
    } else {
      if (demoNames.lastNames.includes(name)) { addToast('Déjà existant', 'error'); return; }
      addDemoLastName(name);
    }
    addToast(`« ${name} » ajouté ✓`, 'success');
    setNewDemoName('');
  };

  const getCurrentDemoList = () => {
    if (demoTab === 'male') return demoNames.firstNamesMale;
    if (demoTab === 'female') return demoNames.firstNamesFemale;
    return demoNames.lastNames;
  };

  const handleRemoveDemoName = (name: string) => {
    if (demoTab === 'male') removeDemoFirstNameMale(name);
    else if (demoTab === 'female') removeDemoFirstNameFemale(name);
    else removeDemoLastName(name);
    addToast(`« ${name} » supprimé`, 'info');
  };

  const startEditDemoName = (name: string) => {
    setEditingDemoName(name);
    setEditDemoNameValue(name);
  };

  const saveEditDemoName = () => {
    if (!editingDemoName || !editDemoNameValue.trim()) {
      setEditingDemoName(null);
      return;
    }
    const newName = editDemoNameValue.trim();
    if (newName === editingDemoName) {
      setEditingDemoName(null);
      return;
    }
    if (demoTab === 'male') renameDemoFirstNameMale(editingDemoName, newName);
    else if (demoTab === 'female') renameDemoFirstNameFemale(editingDemoName, newName);
    else renameDemoLastName(editingDemoName, newName);
    addToast(`« ${editingDemoName} » → « ${newName} » ✓`, 'success');
    setEditingDemoName(null);
  };

  const emojiOptions = ['🏆', '⭐', '👏', '📝', '⚠️', '🎯', '🔥', '💪', '📌', '✨', '🌟', '💎', '🥇', '🥈', '🥉', '👍', '📊', '🎓', '❌', '⛔'];
  const colorOptions = ['#FFD700', '#FF69B4', '#4169E1', '#28A745', '#DC143C', '#FF8C00', '#9B59B6', '#1ABC9C', '#E74C3C', '#2C3E50', '#F39C12', '#8E44AD'];

  const inputClass = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* School Info */}
      <div className={`rounded-2xl p-6 shadow-lg ${cardClass}`}>
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold"><School size={20} className="text-rose-bdj" />Informations de l'école</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Nom de l'école</label>
            <input value={settings.schoolName} onChange={(e) => updateSettings({ schoolName: e.target.value })} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-500">Adresse</label><input value={settings.schoolAddress} onChange={(e) => updateSettings({ schoolAddress: e.target.value })} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} /></div>
            <div><label className="text-xs font-medium text-gray-500">Année scolaire</label><input value={settings.anneeScolaire} onChange={(e) => updateSettings({ anneeScolaire: e.target.value })} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-500">Téléphone</label><input value={settings.schoolPhone} onChange={(e) => updateSettings({ schoolPhone: e.target.value })} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} /></div>
            <div><label className="text-xs font-medium text-gray-500">Email</label><input value={settings.schoolEmail} onChange={(e) => updateSettings({ schoolEmail: e.target.value })} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} /></div>
          </div>
        </div>
      </div>

      {/* NOTE MIN/MAX/DECIMALS */}
      <div className={`rounded-2xl p-6 shadow-lg ${cardClass}`}>
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold"><Hash size={20} className="text-bleu-roi" />Barème de notation</h3>
        <p className="text-xs text-gray-500 mb-4">Configurez la note minimale, maximale et le nombre de décimales affichées. Ces paramètres s'appliquent partout dans l'application.</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Note minimale</label>
            <input
              type="number"
              min={-100}
              max={settings.noteMax - 0.01}
              step={0.01}
              value={settings.noteMin}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val < settings.noteMax) {
                  updateSettings({ noteMin: val });
                }
              }}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm font-bold text-center ${inputClass}`}
            />
            <p className="text-[10px] text-gray-400 mt-1 text-center">Ex: 0, -10, etc.</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Note maximale</label>
            <input
              type="number"
              min={settings.noteMin + 0.01}
              max={1000}
              step={0.01}
              value={settings.noteMax}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > settings.noteMin) {
                  updateSettings({ noteMax: val });
                }
              }}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm font-bold text-center ${inputClass}`}
            />
            <p className="text-[10px] text-gray-400 mt-1 text-center">Ex: 20, 100, 10, etc.</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Décimales affichées</label>
            <input
              type="number"
              min={0}
              max={6}
              step={1}
              value={settings.noteDecimalPlaces}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 0 && val <= 6) {
                  updateSettings({ noteDecimalPlaces: val });
                }
              }}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm font-bold text-center ${inputClass}`}
            />
            <p className="text-[10px] text-gray-400 mt-1 text-center">0 à 6 chiffres après virgule</p>
          </div>
        </div>
        {/* Live preview */}
        <div className={`mt-4 rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-rose-pale/50'}`}>
          <p className="text-[10px] text-gray-400 mb-1.5">📊 Aperçu :</p>
          <div className="flex items-center gap-4 text-sm">
            <span>Barème: <strong>{settings.noteMin}</strong> → <strong>{settings.noteMax}</strong></span>
            <span>•</span>
            <span>Exemple: <strong>{(14.56789).toFixed(settings.noteDecimalPlaces)}</strong>/{settings.noteMax}</span>
            <span>•</span>
            <span>Moyenne: <strong>{((settings.noteMin + settings.noteMax) / 2).toFixed(settings.noteDecimalPlaces)}</strong></span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => { updateSettings({ noteMin: 0, noteMax: 20, noteDecimalPlaces: 2 }); addToast('Barème réinitialisé: 0-20 ✓', 'success'); }} className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            <RotateCcw size={12} /> 0–20
          </button>
          <button onClick={() => { updateSettings({ noteMin: 0, noteMax: 10, noteDecimalPlaces: 2 }); addToast('Barème: 0-10 ✓', 'success'); }} className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            0–10
          </button>
          <button onClick={() => { updateSettings({ noteMin: 0, noteMax: 100, noteDecimalPlaces: 1 }); addToast('Barème: 0-100 ✓', 'success'); }} className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            0–100
          </button>
        </div>
      </div>

      {/* Bulletin Labels */}
      <div className={`rounded-2xl p-6 shadow-lg ${cardClass}`}>
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold"><FileText size={20} className="text-bleu-roi" />Libellés du bulletin (personnalisables)</h3>
        <p className="text-xs text-gray-500 mb-3">Modifiez les titres et intitulés qui apparaissent sur le bulletin imprimé.</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500">Titre du bulletin</label>
            <input value={settings.bulletinTitle} onChange={(e) => updateSettings({ bulletinTitle: e.target.value })} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} placeholder="BULLETIN DE NOTES" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Titre enseignant</label>
              <input value={settings.teacherTitle} onChange={(e) => updateSettings({ teacherTitle: e.target.value })} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Titre parent</label>
              <input value={settings.parentTitle} onChange={(e) => updateSettings({ parentTitle: e.target.value })} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Titre directeur</label>
              <input value={settings.directorTitle} onChange={(e) => updateSettings({ directorTitle: e.target.value })} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Logo & Images */}
      <div className={`rounded-2xl p-6 shadow-lg ${cardClass}`}>
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold"><Upload size={20} className="text-fuchsia-bdj" />Logo, Cachet & Signatures</h3>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {([
            { field: 'logo' as const, label: 'Logo école', icon: '🏫' },
            { field: 'cachet' as const, label: 'Cachet', icon: '🔏' },
            { field: 'signatureDirecteur' as const, label: 'Signature Directeur', icon: '✍️' },
            { field: 'signatureEnseignant' as const, label: 'Signature Enseignant', icon: '✍️' },
          ]).map(({ field, label, icon }) => (
            <div key={field} className="text-center">
              <button onClick={() => handleImageUpload(field)} className={`group mb-2 flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed transition hover:border-rose-bdj ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-rose-pale'}`}>
                {settings[field] ? <img src={settings[field]} alt={label} className="h-full max-h-20 object-contain p-2" /> : <div className="text-center"><span className="text-2xl">{icon}</span><p className="mt-1 text-[10px] text-gray-400">Cliquer</p></div>}
              </button>
              <p className="text-[10px] font-medium text-gray-500">{label}</p>
              {settings[field] && <button onClick={() => updateSettings({ [field]: undefined })} className="mt-1 text-[10px] text-rouge-bdj hover:underline">Supprimer</button>}
            </div>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className={`rounded-2xl p-6 shadow-lg ${cardClass}`}>
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold"><Palette size={20} className="text-bleu-roi" />Couleur du thème</h3>
        <div className="flex items-center gap-4">
          <input type="color" value={settings.primaryColor} onChange={(e) => updateSettings({ primaryColor: e.target.value })} className="h-12 w-12 cursor-pointer rounded-lg border-0" />
          <div><p className="text-sm font-medium">{settings.primaryColor}</p><p className="text-xs text-gray-500">Accent bulletins & interface</p></div>
          <button onClick={() => { updateSettings({ primaryColor: '#FF69B4' }); addToast('Couleur réinitialisée ✓', 'success'); }} className="ml-auto rounded-lg bg-rose-pale px-3 py-1.5 text-xs text-rose-bdj hover:bg-rose-clair">Réinitialiser</button>
        </div>
        <div className="mt-4 flex gap-2">
          {['#FF69B4', '#4169E1', '#28A745', '#FF8C00', '#9B59B6', '#E74C3C', '#1ABC9C', '#2C3E50'].map((c) => (
            <button key={c} onClick={() => updateSettings({ primaryColor: c })} className={`h-8 w-8 rounded-full transition hover:scale-110 ${settings.primaryColor === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`} style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* Display Options */}
      <div className={`rounded-2xl p-6 shadow-lg ${cardClass}`}>
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
          {settings.showRanks ? <Eye size={20} className="text-vert-bdj" /> : <EyeOff size={20} className="text-gray-400" />}
          Options d'affichage
        </h3>
        <div className={`flex items-center justify-between rounded-xl p-4 ${darkMode ? 'bg-gray-700' : 'bg-rose-pale'}`}>
          <div><p className="text-sm font-semibold">Afficher le rang des élèves</p><p className="text-xs text-gray-500 mt-0.5">Affiche ou masque le classement partout</p></div>
          <button onClick={() => { updateSettings({ showRanks: !settings.showRanks }); addToast(settings.showRanks ? 'Rangs masqués ✓' : 'Rangs affichés ✓', 'success'); }}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${settings.showRanks ? 'bg-vert-bdj' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 mt-1 ${settings.showRanks ? 'translate-x-6 ml-0.5' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* APPRECIATION RULES */}
      <div className={`rounded-2xl p-6 shadow-lg ${cardClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-base font-bold"><BookOpen size={20} className="text-fuchsia-bdj" />Barème des appréciations</h3>
          <div className="flex gap-2">
            <button onClick={() => { setAppreciationRules(defaultAppreciationRules); addToast('Réinitialisées ✓', 'success'); }} className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}><RotateCcw size={12} /> Défaut</button>
            <button onClick={openNewAppreciation} className="gradient-principal flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow"><Plus size={12} /> Ajouter</button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-3">Tranches de notes → appréciations sur les bulletins. Tout est modifiable. Les décimales sont acceptées.</p>
        <div className="space-y-2">
          {[...appreciationRules].sort((a, b) => a.min - b.min).map((rule) => (
            <div key={rule.id} className={`flex items-center gap-3 rounded-xl p-3 transition ${darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-rose-pale/50'}`}>
              <div className="h-4 w-4 rounded-full shrink-0" style={{ background: rule.color }} />
              <div className="flex-1"><p className="text-sm font-semibold">{rule.label}</p><p className="text-xs text-gray-500">De <strong>{rule.min}</strong> à <strong>{rule.max}</strong></p></div>
              <div className="flex gap-1">
                <button onClick={() => openEditAppreciation(rule)} className={iconEdit} title="Modifier"><Edit3 size={14} /></button>
                <button onClick={() => { if (appreciationRules.length <= 1) { addToast('Au moins 1 règle', 'error'); return; } deleteAppreciationRule(rule.id); addToast('Supprimée', 'info'); }} className={iconDelete} title="Supprimer"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MENTION RULES */}
      <div className={`rounded-2xl p-6 shadow-lg ${cardClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-base font-bold"><Award size={20} className="text-yellow-500" />Barème des mentions</h3>
          <div className="flex gap-2">
            <button onClick={() => { setMentionRules(defaultMentionRules); addToast('Réinitialisées ✓', 'success'); }} className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}><RotateCcw size={12} /> Défaut</button>
            <button onClick={openNewMention} className="gradient-principal flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow"><Plus size={12} /> Ajouter</button>
          </div>
        </div>
        <div className="space-y-2">
          {[...mentionRules].sort((a, b) => b.minAverage - a.minAverage).map((rule) => (
            <div key={rule.id} className={`flex items-center gap-3 rounded-xl p-3 transition ${darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-rose-pale/50'}`}>
              <span className="text-xl shrink-0">{rule.emoji}</span>
              <div className="flex-1"><p className="text-sm font-semibold" style={{ color: rule.color }}>{rule.label}</p><p className="text-xs text-gray-500">Moyenne ≥ <strong>{rule.minAverage}</strong></p></div>
              <div className="flex gap-1">
                <button onClick={() => openEditMention(rule)} className={iconEdit} title="Modifier"><Edit3 size={14} /></button>
                <button onClick={() => { if (mentionRules.length <= 1) { addToast('Au moins 1 règle', 'error'); return; } deleteMentionRule(rule.id); addToast('Supprimée', 'info'); }} className={iconDelete} title="Supprimer"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEMO NAMES POOL */}
      <div className={`rounded-2xl p-6 shadow-lg ${cardClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-base font-bold"><Users size={20} className="text-vert-bdj" />Répertoire de noms démo</h3>
          <button onClick={() => { setDemoNames({ ...defaultDemoNames }); addToast('Noms réinitialisés ✓', 'success'); }} className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}><RotateCcw size={12} /> Défaut 🇧🇯</button>
        </div>
        <p className="text-xs text-gray-500 mb-3">Personnalisez les prénoms et noms utilisés par le générateur d'élèves démo. Cliquez sur ✏️ pour modifier, ✕ pour supprimer.</p>

        {/* Tabs */}
        <div className="flex gap-1 mb-3">
          {([
            { key: 'male' as const, label: `♂ Prénoms masculins (${demoNames.firstNamesMale.length})` },
            { key: 'female' as const, label: `♀ Prénoms féminins (${demoNames.firstNamesFemale.length})` },
            { key: 'last' as const, label: `👤 Noms de famille (${demoNames.lastNames.length})` },
          ]).map((t) => (
            <button key={t.key} onClick={() => setDemoTab(t.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${demoTab === t.key ? 'gradient-principal text-white shadow' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Add new */}
        <div className="flex items-center gap-2 mb-3">
          <Type size={14} className="text-gray-400 shrink-0" />
          <input value={newDemoName} onChange={(e) => setNewDemoName(e.target.value)} placeholder={demoTab === 'last' ? 'Nouveau nom de famille...' : 'Nouveau prénom...'} className={`flex-1 rounded-lg border px-3 py-1.5 text-sm ${inputClass}`}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddDemoName(); }} />
          <button onClick={handleAddDemoName} disabled={!newDemoName.trim()} className="gradient-principal rounded-lg px-3 py-1.5 text-sm font-bold text-white shadow disabled:opacity-50"><Plus size={14} /></button>
        </div>

        {/* Names list — click to edit */}
        <div className="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto p-1">
          {getCurrentDemoList().sort().map((name) => (
            editingDemoName === name ? (
              <span key={name} className={`inline-flex items-center gap-1 rounded-full border-2 border-rose-bdj px-1 py-0.5`}>
                <input
                  value={editDemoNameValue}
                  onChange={(e) => setEditDemoNameValue(e.target.value)}
                  className={`w-24 rounded-full px-2 py-0.5 text-xs outline-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-rose-pale'}`}
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') saveEditDemoName(); if (e.key === 'Escape') setEditingDemoName(null); }}
                  onBlur={saveEditDemoName}
                />
                <button onClick={saveEditDemoName} className="text-green-500 p-0.5"><Check size={11} /></button>
                <button onClick={() => setEditingDemoName(null)} className="text-red-500 p-0.5"><X size={11} /></button>
              </span>
            ) : (
              <span key={name} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-rose-pale text-gray-700 hover:bg-rose-clair'}`}>
                <span onDoubleClick={() => startEditDemoName(name)} title="Double-cliquez pour modifier">{name}</span>
                <button onClick={() => startEditDemoName(name)} className={`ml-0.5 transition-all ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`} title="Modifier"><Pencil size={10} /></button>
                <button onClick={() => handleRemoveDemoName(name)} className={`transition-all ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`} title="Supprimer"><X size={10} /></button>
              </span>
            )
          ))}
        </div>

        {getCurrentDemoList().length === 0 && (
          <p className="text-center py-4 text-xs text-gray-400">Liste vide. Ajoutez des noms ci-dessus.</p>
        )}

        <p className="text-[10px] text-gray-400 mt-2 text-center italic">
          💡 Double-cliquez ou cliquez sur ✏️ pour modifier un nom • Cliquez sur ✕ pour supprimer
        </p>
      </div>

      {/* Danger zone */}
      <div className={`rounded-2xl border-2 border-rouge-bdj/20 p-6 shadow-lg ${cardClass}`}>
        <h3 className="mb-4 text-base font-bold text-rouge-bdj">⚠️ Zone dangereuse</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => { if (confirm('Supprimer TOUTES les notes ?')) { useStore.getState().setGrades([]); addToast('Toutes les notes ont été supprimées', 'warning', 'Données effacées'); } }}
            className="rounded-xl border border-rouge-bdj/30 px-4 py-2 text-sm text-rouge-bdj hover:bg-red-50">Supprimer toutes les notes</button>
          <button onClick={() => { if (confirm('Supprimer TOUS les élèves et leurs notes ?')) { useStore.getState().setStudents([]); useStore.getState().setGrades([]); addToast('Tous les élèves et notes ont été supprimés', 'warning', 'Données effacées'); } }}
            className="rounded-xl border border-rouge-bdj/30 px-4 py-2 text-sm text-rouge-bdj hover:bg-red-50">Supprimer tous les élèves</button>
          <button onClick={async () => { if (confirm("Réinitialiser TOUTE l'application ?")) { const { default: lf } = await import('localforage'); await lf.clear(); window.location.reload(); } }}
            className="rounded-xl bg-rouge-bdj px-4 py-2 text-sm font-bold text-white hover:opacity-90">Réinitialiser l'application</button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 pb-8 text-xs text-gray-400"><Save size={12} /><span>Sauvegarde automatique — Données stockées localement</span></div>

      {/* APPRECIATION FORM MODAL */}
      {showAppreciationForm && editingAppreciation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in-up ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{appreciationRules.find((r) => r.id === editingAppreciation.id) ? 'Modifier' : 'Nouvelle'} appréciation</h3>
              <button onClick={() => setShowAppreciationForm(false)} className="rounded-lg p-1 hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-gray-500">Libellé *</label><input value={editingAppreciation.label} onChange={(e) => setEditingAppreciation({ ...editingAppreciation, label: e.target.value })} placeholder="ex: Très satisfaisant" className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} autoFocus /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-500">Note minimum</label><input type="number" min={settings.noteMin} max={settings.noteMax} step={0.01} value={editingAppreciation.min} onChange={(e) => setEditingAppreciation({ ...editingAppreciation, min: parseFloat(e.target.value) || 0 })} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} /></div>
                <div><label className="text-xs font-medium text-gray-500">Note maximum</label><input type="number" min={settings.noteMin} max={settings.noteMax} step={0.01} value={editingAppreciation.max} onChange={(e) => setEditingAppreciation({ ...editingAppreciation, max: parseFloat(e.target.value) || settings.noteMax })} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} /></div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Couleur</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colorOptions.map((c) => (<button key={c} onClick={() => setEditingAppreciation({ ...editingAppreciation, color: c })} className={`h-7 w-7 rounded-full transition ${editingAppreciation.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`} style={{ background: c }} />))}
                  <input type="color" value={editingAppreciation.color} onChange={(e) => setEditingAppreciation({ ...editingAppreciation, color: e.target.value })} className="h-7 w-7 cursor-pointer rounded-full border-0" />
                </div>
              </div>
              <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="text-[10px] text-gray-400 mb-1">Aperçu :</p>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{ background: editingAppreciation.color }} /><span className="text-sm font-bold" style={{ color: editingAppreciation.color }}>{editingAppreciation.label || '(libellé)'}</span><span className="text-xs text-gray-500">— De {editingAppreciation.min} à {editingAppreciation.max}</span></div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowAppreciationForm(false)} className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Annuler</button>
              <button onClick={saveAppreciation} className="flex-1 gradient-principal rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg flex items-center justify-center gap-2"><Check size={16} /> Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* MENTION FORM MODAL */}
      {showMentionForm && editingMention && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in-up ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{mentionRules.find((r) => r.id === editingMention.id) ? 'Modifier' : 'Nouvelle'} mention</h3>
              <button onClick={() => setShowMentionForm(false)} className="rounded-lg p-1 hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-gray-500">Libellé *</label><input value={editingMention.label} onChange={(e) => setEditingMention({ ...editingMention, label: e.target.value })} placeholder="ex: TABLEAU D'HONNEUR" className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} autoFocus /></div>
              <div><label className="text-xs font-medium text-gray-500">Moyenne minimum (≥) — décimales autorisées</label><input type="number" min={settings.noteMin} max={settings.noteMax} step={0.01} value={editingMention.minAverage} onChange={(e) => setEditingMention({ ...editingMention, minAverage: parseFloat(e.target.value) || 0 })} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} /></div>
              <div>
                <label className="text-xs font-medium text-gray-500">Emoji</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {emojiOptions.map((e) => (<button key={e} onClick={() => setEditingMention({ ...editingMention, emoji: e })} className={`text-xl p-1 rounded-lg transition ${editingMention.emoji === e ? 'bg-rose-pale ring-2 ring-rose-bdj scale-110' : 'hover:bg-gray-100'}`}>{e}</button>))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Couleur</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colorOptions.map((c) => (<button key={c} onClick={() => setEditingMention({ ...editingMention, color: c })} className={`h-7 w-7 rounded-full transition ${editingMention.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`} style={{ background: c }} />))}
                  <input type="color" value={editingMention.color} onChange={(e) => setEditingMention({ ...editingMention, color: e.target.value })} className="h-7 w-7 cursor-pointer rounded-full border-0" />
                </div>
              </div>
              <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="text-[10px] text-gray-400 mb-1">Aperçu :</p>
                <span className="inline-block px-4 py-1.5 rounded-full text-white text-sm font-bold" style={{ background: editingMention.color }}>{editingMention.emoji} {editingMention.label || '(libellé)'}</span>
                <p className="text-xs text-gray-500 mt-1">Si moyenne ≥ {editingMention.minAverage}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowMentionForm(false)} className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Annuler</button>
              <button onClick={saveMention} className="flex-1 gradient-principal rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg flex items-center justify-center gap-2"><Check size={16} /> Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
