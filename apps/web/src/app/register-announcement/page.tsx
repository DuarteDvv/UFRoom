"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FirebaseOptions, initializeApp } from "firebase/app";
import Header from '../../components/Header';
import firebaseCredentials from '../../../serviceAccountKey.json';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuth } from "../../global-contexts/authcontext";

const app = initializeApp(firebaseCredentials as FirebaseOptions);
const storage = getStorage(app, "gs://ufroom-b774b.firebasestorage.app");

function SortableImage({ img, index, removerImagem, isCover }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: img.name });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative border-2 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-move ${
        isCover ? "border-yellow-400 ring-2 ring-yellow-300" : "border-gray-200"
      }`}
    >
      <img src={URL.createObjectURL(img)} alt={img.name} className="w-32 h-32 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 flex flex-col justify-between p-2 transition-opacity">
        <p className="text-white text-xs font-medium truncate bg-black/40 rounded px-2 py-1">{img.name}</p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removerImagem(index);
          }}
          className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 self-end shadow-lg transition-colors"
        >
          ×
        </button>
      </div>
      {isCover && (
        <div className="absolute top-2 left-2 bg-yellow-400 px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
          ⭐ CAPA
        </div>
      )}
    </div>
  );
}

export default function CriarAnuncio() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const { user } = useAuth();

  const [form, setForm] = useState({
    titulo: "", descricao: "", preco: "", occupants: "0", max_ocupantes: "1", regras: "", 
    restricao_sexo: "both", type_of: "kitnet", status: "available"
  });
  const [endereco, setEndereco] = useState({
    rua: "", numero: "", bairro: "", cidade: "", estado: "", cep: "", complemento: "", latitude: "", longitude: ""
  });
  const [imagens, setImagens] = useState<File[]>([]);
  const [urlsEnviadas, setUrlsEnviadas] = useState<string[]>([]);

  useEffect(() => setIsMounted(true), []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = imagens.findIndex(img => img.name === active.id);
      const newIndex = imagens.findIndex(img => img.name === over.id);
      setImagens(arrayMove(imagens, oldIndex, newIndex));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    name in endereco ? setEndereco({ ...endereco, [name]: value }) : setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    // Validação de tamanho (5MB por imagem)
    const maxSize = 5 * 1024 * 1024;
    const invalidFiles = files.filter(f => f.size > maxSize);
    
    if (invalidFiles.length > 0) {
      setErro(`Algumas imagens excedem 5MB: ${invalidFiles.map(f => f.name).join(", ")}`);
      return;
    }
    
    setImagens([...imagens, ...files]);
    setErro("");
  };

  const removerImagem = (index: number) => {
    setImagens(imagens.filter((_, i) => i !== index));
    // Limpar URLs se necessário
    if (urlsEnviadas.length > 0) {
      setUrlsEnviadas([]);
      setSucesso("");
    }
  };

  const geocodeEndereco = async () => {
    const enderecoCompleto = `${endereco.rua} ${endereco.numero}, ${endereco.cidade}, ${endereco.estado}, ${endereco.cep}`;
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(enderecoCompleto)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();

      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        setEndereco(prev => ({ ...prev, latitude: location.lat.toString(), longitude: location.lng.toString() }));
        return true;
      } else {
        setErro("Não foi possível localizar o endereço. Verifique os dados e tente novamente.");
        return false;
      }
    } catch {
      setErro("Erro ao validar o endereço. Verifique sua conexão.");
      return false;
    }
  };

  const validateStep1 = () => {
    if (!endereco.rua.trim()) return "O campo Rua é obrigatório";
    if (!endereco.numero.trim()) return "O campo Número é obrigatório";
    if (!endereco.cidade.trim()) return "O campo Cidade é obrigatório";
    if (!endereco.estado.trim()) return "O campo Estado é obrigatório";
    if (endereco.cep && !/^\d{5}-?\d{3}$/.test(endereco.cep)) return "CEP inválido";
    return null;
  };

  const validateStep2 = () => {
    if (!form.titulo.trim()) return "O título é obrigatório";
    if (form.titulo.length < 10) return "O título deve ter pelo menos 10 caracteres";
    if (!form.descricao.trim()) return "A descrição é obrigatória";
    if (form.descricao.length < 30) return "A descrição deve ter pelo menos 30 caracteres";
    if (!form.preco || parseFloat(form.preco) <= 0) return "Informe um preço válido";
    if (parseInt(form.occupants) < 0) return "Número de ocupantes inválido";
    if (parseInt(form.max_ocupantes) < 1) return "Máximo de ocupantes deve ser pelo menos 1";
    if (parseInt(form.occupants) > parseInt(form.max_ocupantes)) return "Ocupantes atuais não pode ser maior que o máximo";
    return null;
  };

  const handleNext = async () => {
    setErro("");
    setSucesso("");

    if (step === 1) {
      const error = validateStep1();
      if (error) {
        setErro(error);
        return;
      }
      const sucesso = await geocodeEndereco();
      if (!sucesso) return;
      setSucesso("Endereço validado com sucesso!");
    }

    if (step === 2) {
      const error = validateStep2();
      if (error) {
        setErro(error);
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setErro("");
    setSucesso("");
    setStep(prev => prev - 1);
  };

  const uploadImagens = async () => {
    if (imagens.length === 0) {
      setErro("Selecione pelo menos uma imagem para enviar");
      return;
    }
    
    setErro("");
    setSucesso("");
    setUploading(true);

    try {
      const urls: string[] = [];
      for (let i = 0; i < imagens.length; i++) {
        const file = imagens[i];
        const storageRef = ref(storage, `anuncios/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      }
      setUrlsEnviadas(urls);
      setSucesso(`${urls.length} imagem(ns) enviada(s) com sucesso!`);
    } catch (err) {
      console.error(err);
      setErro("Erro ao enviar as imagens. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setErro("");
    setSucesso("");

    if (imagens.length > 0 && urlsEnviadas.length === 0) {
      setErro("Envie as imagens antes de publicar o anúncio");
      return;
    }

    if (imagens.length === 0) {
      setErro("Adicione pelo menos uma imagem ao anúncio");
      return;
    }

    setSaving(true);

    try {
      // Criar endereço
      const addressPayload = {
        street: endereco.rua,
        neighborhood: endereco.bairro || "",
        state: endereco.estado,
        number: parseInt(endereco.numero),
        city: endereco.cidade,
        cep: endereco.cep,
        latitude: parseFloat(endereco.latitude),
        longitude: parseFloat(endereco.longitude),
        complement: endereco.complemento || undefined
      };

      const resAddress = await fetch("http://localhost:3001/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressPayload)
      });
      
      const addressData = await resAddress.json();
      if (!resAddress.ok) {
        setErro(addressData.error || "Erro ao criar endereço");
        return;
      }

      // Criar anúncio
      const announcementPayload = {
        id_owner: user.id,
        title: form.titulo,
        description: form.descricao,
        price: parseFloat(form.preco),
        type_of: form.type_of,
        status: form.status,
        rules: form.regras || "",
        sex_restriction: form.restricao_sexo,
        occupants: parseInt(form.occupants),
        max_occupants: parseInt(form.max_ocupantes),
        id_address: addressData.id,
      };

      const resAnnouncement = await fetch("http://localhost:3001/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcementPayload),
      });

      const announcementCreated = await resAnnouncement.json();
      if (!resAnnouncement.ok) {
        setErro(announcementCreated.error || "Erro ao criar anúncio");
        return;
      }

      // Criar imagens
      for (let i = 0; i < urlsEnviadas.length; i++) {
        const imagePayload = {
          id_announcement: announcementCreated.id,
          img_url: urlsEnviadas[i],
          order_idx: i + 1,
          is_cover: i === 0,
        };
        
        await fetch("http://localhost:3001/announcement-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(imagePayload),
        });
      }

      setSucesso("✓ Anúncio publicado com sucesso!");
      setTimeout(() => {
        router.push("/homepage");
      }, 2000);

    } catch (err) {
      console.error(err);
      setErro("Erro ao publicar o anúncio. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (!isMounted) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto p-6 py-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Criar Novo Anúncio</h1>
          <p className="text-gray-600">Preencha as informações para publicar seu imóvel</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[
              { num: 1, label: "Endereço" },
              { num: 2, label: "Detalhes" },
              { num: 3, label: "Fotos" }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s.num 
                      ? "bg-red-600 text-white shadow-lg scale-110" 
                      : "bg-gray-300 text-gray-600"
                  }`}>
                    {step > s.num ? "✓" : s.num}
                  </div>
                  <p className={`mt-2 text-sm font-medium whitespace-nowrap ${step >= s.num ? "text-red-600" : "text-gray-500"}`}>
                    {s.label}
                  </p>
                </div>
                {idx < 2 && (
                  <div className={`w-24 md:w-32 h-1 mx-4 rounded transition-all ${
                    step > s.num ? "bg-red-600" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {erro && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
            <span className="text-red-500 text-xl">⚠</span>
            <div>
              <p className="font-semibold text-red-800">Erro</p>
              <p className="text-red-700">{erro}</p>
            </div>
          </div>
        )}

        {sucesso && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <p className="text-green-700 font-medium">{sucesso}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          
          {/* Step 1: Endereço */}
          {step === 1 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "rua", label: "Rua", required: true, placeholder: "Ex: Rua das Flores" },
                  { name: "numero", label: "Número", required: true, placeholder: "123" },
                  { name: "bairro", label: "Bairro", placeholder: "Centro" },
                  { name: "cidade", label: "Cidade", required: true, placeholder: "São Paulo" },
                  { name: "estado", label: "Estado", required: true, placeholder: "SP" },
                  { name: "cep", label: "CEP", placeholder: "12345-678" },
                  { name: "complemento", label: "Complemento", placeholder: "Apto 101, Bloco A" },
                ].map(field => (
                  <div key={field.name} className={field.name === "complemento" ? "md:col-span-2" : ""}>
                    <label className="block text-gray-700 mb-2 font-semibold">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={(endereco as any)[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg text-black focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none"
                      required={field.required}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Detalhes */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                Informações do Anúncio
              </h2>
              
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Título <span className="text-red-500">*</span>
                  <span className="text-sm text-gray-500 ml-2">(min. 10 caracteres)</span>
                </label>
                <input 
                  type="text" 
                  name="titulo" 
                  value={form.titulo} 
                  onChange={handleChange}
                  placeholder="Ex: Kitnet aconchegante próxima à universidade"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-black focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none" 
                  required 
                />
                <p className="text-sm text-gray-500 mt-1">{form.titulo.length} caracteres</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Descrição <span className="text-red-500">*</span>
                  <span className="text-sm text-gray-500 ml-2">(min. 30 caracteres)</span>
                </label>
                <textarea 
                  name="descricao" 
                  value={form.descricao} 
                  onChange={handleChange}
                  placeholder="Descreva os detalhes do imóvel, móveis inclusos, proximidade de pontos importantes..."
                  className="w-full p-3 border-2 border-gray-300 rounded-lg h-32 resize-vertical text-black focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none" 
                  required 
                />
                <p className="text-sm text-gray-500 mt-1">{form.descricao.length} caracteres</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Preço Mensal (R$) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="preco" 
                    value={form.preco} 
                    onChange={handleChange}
                    placeholder="800.00"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-black focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none" 
                    step="0.01" 
                    min="0" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">Ocupantes Atuais</label>
                  <input 
                    type="number" 
                    name="occupants" 
                    value={form.occupants} 
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-black focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none" 
                    min="0" 
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Máx. Ocupantes <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="max_ocupantes" 
                    value={form.max_ocupantes} 
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-black focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none" 
                    min="1" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">Tipo de Imóvel</label>
                  <select 
                    name="type_of" 
                    value={form.type_of} 
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-black focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none"
                  >
                    <option value="kitnet">Kitnet</option>
                    <option value="individual_room">Quarto Individual</option>
                    <option value="shared_room">Quarto Compartilhado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">Restrição de Gênero</label>
                  <select 
                    name="restricao_sexo" 
                    value={form.restricao_sexo} 
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-black focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none"
                  >
                    <option value="both">Ambos</option>
                    <option value="male">Apenas Masculino</option>
                    <option value="female">Apenas Feminino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">Status</label>
                  <select 
                    name="status" 
                    value={form.status} 
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-black focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none"
                  >
                    <option value="available">Disponível</option>
                    <option value="rented">Alugado</option>
                    <option value="paused">Pausado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Regras da Casa</label>
                <textarea 
                  name="regras" 
                  value={form.regras} 
                  onChange={handleChange}
                  placeholder="Ex: Não é permitido fumar, animais de estimação aceitos, silêncio após 22h..."
                  className="w-full p-3 border-2 border-gray-300 rounded-lg h-24 resize-vertical text-black focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none" 
                />
              </div>
            </div>
          )}

          {/* Step 3: Imagens */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                Fotos do Imóvel
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 transition-colors">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <label className="cursor-pointer">
                  <span className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-block font-semibold">
                    Selecionar Imagens
                  </span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-3">PNG, JPG até 5MB cada</p>
              </div>

              {imagens.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-700">{imagens.length} imagem(ns) selecionada(s)</p>
                    <button
                      type="button"
                      onClick={uploadImagens}
                      disabled={uploading || urlsEnviadas.length > 0}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Enviando...
                        </>
                      ) : urlsEnviadas.length > 0 ? (
                        <>✓ Imagens Enviadas</>
                      ) : (
                        <>☁ Enviar para Nuvem</>
                      )}
                    </button>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>Dica:</strong> A primeira imagem será a foto de capa. Arraste e solte para reordenar.
                    </p>
                  </div>

                  <div className="relative">
                    <p className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                      ⭐ Imagem de Capa
                    </p>
                    <img 
                      src={URL.createObjectURL(imagens[0])} 
                      alt="Capa"
                      className="w-full h-80 object-cover rounded-xl shadow-lg" 
                    />
                  </div>

                  <div>
                    <p className="font-semibold mb-3 text-gray-700">Todas as Imagens (Arraste para Reordenar)</p>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={imagens.map(img => img.name)} strategy={horizontalListSortingStrategy}>
                        <div className="flex gap-4 overflow-x-auto pb-4">
                          {imagens.map((img, i) => (
                            <SortableImage key={img.name} img={img} index={i} removerImagem={removerImagem} isCover={i === 0} />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4">
          {step > 1 && (
            <button 
              onClick={handlePrev}
              className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center gap-2"
            >
              ← Voltar
            </button>
          )}
          
          <div className="flex-1"></div>

          {step < 3 ? (
            <button 
              onClick={handleNext}
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2 ml-auto"
            >
              Próximo →
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={saving || imagens.length === 0 || urlsEnviadas.length === 0}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Publicando...
                </>
              ) : (
                <>
                  ✓ Publicar Anúncio
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}