'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '../../../components/Header';

const AnnouncementPage = () => {
  const params = useParams();
  const id = params.id;
  
  const [announcement, setAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`/api/announcements/${id}`);
        const data = await response.json();
        setAnnouncement(data);
      } catch (error) {
        console.error('Erro ao carregar anúncio:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getTypeLabel = (type: string) => {
    const types = {
      'kitnet': 'Kitnet',
      'quarto_individual': 'Quarto Individual',
      'quarto_compartilhado': 'Quarto Compartilhado'
    };
    return types[type as keyof typeof types] || type;
  };

  const getSexRestrictionLabel = (restriction: string) => {
    const restrictions = {
      'male': 'Apenas Masculino',
      'female': 'Apenas Feminino',
      'both': 'Ambos os sexos'
    };
    return restrictions[restriction as keyof typeof restrictions] || restriction;
  };

  const nextImage = () => {
    if (announcement?.announcement_img?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === announcement.announcement_img.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (announcement?.announcement_img?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? announcement.announcement_img.length - 1 : prev - 1
      );
    }
  };

  // Remover depois
  const mockAnnouncement = {
    id: parseInt(id as string),
    title: "Kitnet mobiliada no Savassi",
    price: 1200,
    description: "Kitnet completamente mobiliada em excelente localização no Savassi. O imóvel conta com todos os móveis necessários para moradia estudantil, incluindo cama, guarda-roupa, mesa de estudos, geladeira e micro-ondas.",
    occupants: 0,
    max_occupants: 1,
    type_of: "kitnet",
    sex_restriction: "female",
    rules: "• Não é permitido fumar no imóvel\n• Visitas até 22h\n• Manter o imóvel limpo",
    created_at: "2024-01-15T10:00:00Z",
    address: {
      street: "Rua Pernambuco",
      neighborhood: "Savassi",
      state: "MG",
      number: 123,
      city: "Belo Horizonte",
      cep: "30112-000"
    },
    owner: {
      name: "Ana Silva",
      email: "ana.silva@email.com",
      phone: "(31) 99999-9999"
    },
    announcement_img: [
      { id: 1, url: "/house.jpg", alt: "Sala principal" },
      { id: 2, url: "/studio.jpg", alt: "Cozinha" }
    ],
    announcement_university: [
      { id: 1, name: "PUC Minas", distance: 2.5 },
      { id: 2, name: "UFMG", distance: 3.2 }
    ]
  };

  // Use mock data se não houver dados da API ainda
  const data = announcement || mockAnnouncement;

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando anúncio...</p>
          </div>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">Anúncio não encontrado</p>
            <a href="/search" className="text-red-600 hover:text-red-700 font-medium">
              Voltar para busca
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Galeria de Imagens */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-96">
                  {data.announcement_img?.length > 0 ? (
                    <>
                      <Image
                        src={data.announcement_img[currentImageIndex].url}
                        alt={data.announcement_img[currentImageIndex].alt || data.title}
                        fill
                        className="object-cover"
                      />
                      
                      {data.announcement_img.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          
                          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {data.announcement_img.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Sem imagens disponíveis</span>
                    </div>
                  )}
                </div>
                
                {/* Miniaturas */}
                {data.announcement_img?.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {data.announcement_img.map((img: any, index: number) => (
                      <button
                        key={img.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.alt || `Foto ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Informações Principais */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {getTypeLabel(data.type_of)}
                      </span>
                      {data.address && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {data.address.neighborhood}, {data.address.city}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600">{formatPrice(data.price)}</div>
                    <div className="text-sm text-gray-500">por mês</div>
                  </div>
                </div>

                {/* Detalhes Rápidos */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-200">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{data.max_occupants || 1}</div>
                    <div className="text-sm text-gray-500">Vagas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{data.occupants || 0}</div>
                    <div className="text-sm text-gray-500">Ocupantes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {data.announcement_university?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Universidades próximas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {getSexRestrictionLabel(data.sex_restriction)}
                    </div>
                    <div className="text-sm text-gray-500">Restrição</div>
                  </div>
                </div>

                {/* Descrição */}
                {data.description && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h2>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {data.description}
                    </p>
                  </div>
                )}

                {/* Regras */}
                {data.rules && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Regras</h2>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {data.rules}
                    </p>
                  </div>
                )}
              </div>

              {/* Universidades Próximas */}
              {data.announcement_university?.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Universidades próximas</h2>
                  <div className="space-y-3">
                    {data.announcement_university.map((uni: any) => (
                      <div key={uni.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-900">{uni.name}</span>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">{uni.distance.toFixed(1)} km</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Contato */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 overflow-hidden">
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">{data.owner?.name}</h3>
                  <p className="text-sm text-gray-500">Anunciante verificado</p>
                </div>

                <div className="space-y-3">
                  {/* Informações de contato sempre visíveis */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700 font-medium">{data.owner?.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">{data.owner?.email}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const phoneNumber = data.owner?.phone?.replace(/\D/g, '');
                      const message = encodeURIComponent(`Olá! Tenho interesse no anúncio: ${data.title}`);
                      const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${message}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
                    </svg>
                    Conversar no WhatsApp
                  </button>

                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: data.title,
                          text: `Confira este anúncio: ${data.title} - ${formatPrice(data.price)}/mês`,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copiado para a área de transferência!');
                      }
                    }}
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Compartilhar Anúncio
                  </button>
                </div>

                {/* Endereço */}
                {data.address && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Localização</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{data.address.street}, {data.address.number}</p>
                      <p>{data.address.neighborhood}</p>
                      <p>{data.address.city} - {data.address.state}</p>
                      <p>CEP: {data.address.cep}</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 text-xs text-gray-500 text-center">
                  Anúncio publicado em {new Date(data.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnouncementPage;