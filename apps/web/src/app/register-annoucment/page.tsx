"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FirebaseOptions, initializeApp } from "firebase/app";
import Header from '../../components/Header';
import firebaseCredentials from '../../../serviceAccountKey.json';

// Drag & Drop
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuth } from "../../global-contexts/authcontext";

const app = initializeApp(firebaseCredentials as FirebaseOptions);
const storage = getStorage(app, "gs://ufroom-b774b.firebasestorage.app");

// Sortable image component
function SortableImage({ img, index, removerImagem, isCover }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: img.name });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative border rounded-lg overflow-hidden shadow hover:shadow-lg transition ${isCover ? "border-yellow-500" : ""}`}
    >
      <img src={URL.createObjectURL(img)} alt={img.name} className="w-32 h-32 object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 hover:opacity-100 flex flex-col justify-between p-2 transition">
        <p className="text-white text-sm truncate">{img.name}</p>
        <button
          type="button"
          onClick={() => removerImagem(index)}
          className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 self-end"
        >
          ×
        </button>
      </div>
      {isCover && (
        <div className="absolute top-2 left-2 bg-yellow-400 px-2 py-1 rounded text-xs font-bold">
          COVER
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
  const [erro, setErro] = useState("");

  const { user } = useAuth();


  // Form states
  const [form, setForm] = useState({
    titulo: "", descricao: "", preco: "", occupants: "", max_ocupantes: "", regras: "", restricao_sexo: "both", type_of: "kitnet",
    status: "available"
  });
  const [endereco, setEndereco] = useState({
    rua: "", numero: "", bairro: "", cidade: "", estado: "", cep: "", complemento: "", latitude: "", longitude: ""
  });
  const [imagens, setImagens] = useState<File[]>([]);
  const [urlsEnviadas, setUrlsEnviadas] = useState<string[]>([]);

  useEffect(() => setIsMounted(true), []);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = imagens.findIndex(img => img.name === active.id);
      const newIndex = imagens.findIndex(img => img.name === over.id);
      setImagens(arrayMove(imagens, oldIndex, newIndex));
    }
  };

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    name in endereco ? setEndereco({ ...endereco, [name]: value }) : setForm({ ...form, [name]: value });
    console.log(name, value)
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImagens(Array.from(e.target.files));
  };

  const removerImagem = (index: number) => setImagens(imagens.filter((_, i) => i !== index));

  const geocodeEndereco = async () => {
    const enderecoCompleto = `${endereco.rua} ${endereco.numero}, ${endereco.cidade}, ${endereco.estado}, ${endereco.cep}`;
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(enderecoCompleto)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();

      console.log(data)
      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        setEndereco(prev => ({ ...prev, latitude: location.lat.toString(), longitude: location.lng.toString() }));
        return true;
      } else {
        setErro("Não foi possível localizar o endereço");
        return false;
      }
    } catch {
      setErro("Erro ao chamar a API de geocoding");
      return false;
    }
  };

  const handleNext = async () => {
    setErro("");
    if (step === 1) {
      if (!endereco.rua || !endereco.numero || !endereco.cidade || !endereco.estado) {
        setErro("Preencha todos os campos obrigatórios do endereço");
        return;
      }
      const sucesso = await geocodeEndereco();
      if (!sucesso) return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => setStep(prev => prev - 1);

  const uploadImagens = async () => {
    if (imagens.length === 0) {
      setErro("Selecione pelo menos uma imagem para enviar");
      return;
    }
    setErro(""); setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of imagens) {
        const storageRef = ref(storage, `anuncios/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      }
      setUrlsEnviadas(urls);
      alert("Imagens enviadas com sucesso!");
    } catch (err) {
      console.error(err);
      setErro("Erro ao enviar as imagens");
    } finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    setErro("");
    if (imagens.length && urlsEnviadas.length === 0) {
      setErro("Envie as imagens antes de publicar o anúncio");
      return;
    }
    
    const addressPayload = {
      street: endereco.rua,
      neighborhood: endereco.bairro || "", // optional
      state: endereco.estado,
      number: parseInt(endereco.numero),   // number type
      city: endereco.cidade,
      cep: endereco.cep,
      latitude: parseFloat(endereco.latitude),
      longitude: parseFloat(endereco.longitude),
      complement: endereco.complemento || undefined
    };

    console.log(addressPayload)

    let address;
    try {
      const res = await fetch("http://localhost:3001/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressPayload)
      });
      const addressData = await res.json();
      if (!res.ok) {
        console.log(addressData)
        setErro(addressData.error || "Erro ao criar endereço");
        return;
      }
      console.log(addressData)
      address = addressData
    } catch (err) {
      console.error(err);
      setErro("Erro na criação de endereço");
    }


    const announcementPayload = {
      id_owner: user.id,
      title: form.titulo,
      description: form.descricao || "",
      price: parseFloat(form.preco),
      type_of: form.type_of || "kitnet",
      status: form.status || "available",
      rules: form.regras || "",
      sex_restriction: form.restricao_sexo,
      occupants: parseInt(form.occupants) || 0,
      max_occupants: parseInt(form.max_ocupantes) || 1,
      id_address: address.id,
    };
  
    let announcementCreated;
    try {
      const res = await fetch("http://localhost:3001/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcementPayload),
      });
      announcementCreated = await res.json();
      if (!res.ok) {
        setErro(announcementCreated.error || "Erro ao criar anúncio");
        return;
      }

      console.log(announcementCreated)
    } catch (err) {
      console.error(err);
      setErro("Erro na criação do anúncio");
      return;
    }


    try {
      for (let i = 0; i < urlsEnviadas.length; i++) {
        const imagePayload = {
          id_announcement: announcementCreated.id,
          img_url: urlsEnviadas[i],
          order_idx: i+1,
          is_cover: i === 0, // first image is cover
        };
        console.log(imagePayload)
        const res = await fetch("http://localhost:3001/announcement-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(imagePayload),
        });
        if (!res.ok) {
          const data = await res.json();
          console.warn("Erro ao criar imagem:", data.error);
        }
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao criar imagens do anúncio");
      return;
    }


    
  };

  if (!isMounted) return <p>Carregando...</p>;

  return (
    <div>
      <Header />
      <div className="flex flex-col min-h-screen bg-gray-50 p-6">
        {/* Etapa Indicators */}
        <div className="flex gap-4 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 py-2 text-center font-semibold rounded ${step === s ? "bg-red-600 text-white" : "bg-gray-200"}`}>
              Etapa {s}
            </div>
          ))}
        </div>

        {erro && <p className="text-red-600 mb-4">{erro}</p>}

        <div className="bg-white p-6 rounded-xl shadow-md transition-all">

          {/* Step 1: Endereço */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["rua","numero","bairro","cidade","estado","cep","complemento"].map(field => (
                <div key={field}>
                  <label className="block text-gray-700 mb-2 font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    name={field}
                    value={(endereco as any)[field]}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required={["rua","numero","cidade","estado"].includes(field)}
                  />
                </div>
              ))}
            </div>
          )}

          {}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Título</label>
                <input type="text" name="titulo" value={form.titulo} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Descrição</label>
                <textarea name="descricao" value={form.descricao} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-vertical" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Preço (R$)</label>
                  <input type="number" name="preco" value={form.preco} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" step="0.01" min="0" required />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Ocupantes</label>
                  <input type="number" name="occupants" value={form.occupants} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" min="1" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Máximo de ocupantes</label>
                  <input type="number" name="max_ocupantes" value={form.max_ocupantes} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" min="1" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Restrição de sexo</label>
                <select name="restricao_sexo" value={form.restricao_sexo} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="both">Ambos</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="available">Disponível</option>
                  <option value="rented">Alugado</option>
                  <option value="paused">Pausado</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Tipo imóvel</label>
                <select name="type_of" value={form.type_of} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="kitnet">Kitnet</option>
                  <option value="individual_room">Quarto Individual</option>
                  <option value="shared_room">Quarto Compartilhado</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Regras da casa</label>
                <textarea name="regras" value={form.regras} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-vertical" />
              </div>
            </div>
          )}

          {}
          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-gray-700 mb-2 font-medium">Upload de imagens</label>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} />
              <button
                type="button"
                onClick={uploadImagens}
                disabled={uploading || imagens.length === 0}
                className="mt-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {uploading ? "Enviando..." : "Enviar Imagens"}
              </button>

              {imagens.length > 0 && (
                <>
                  <p className="font-semibold mt-4 mb-2">Imagem de Capa (Primeira)</p>
                  <img src={URL.createObjectURL(imagens[0])} className="w-full h-64 object-cover rounded-lg shadow" />

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={imagens.map(img => img.name)} strategy={horizontalListSortingStrategy}>
                      <div className="flex gap-4 overflow-x-auto mt-4">
                        {imagens.map((img, i) => (
                          <SortableImage key={img.name} img={img} index={i} removerImagem={removerImagem} isCover={i === 0} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          {step > 1 && <button onClick={handlePrev} className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition">Voltar</button>}
          {step < 3 ? (
            <button onClick={handleNext} className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition">Próximo</button>
          ) : (
            <button onClick={handleSubmit} className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition">Publicar</button>
          )}
        </div>
      </div>
    </div>
  );
}
