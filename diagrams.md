# Diagramas do Projeto UFRoom

Este documento contém dois diagramas UML que representam as principais partes do sistema backend desenvolvido com Fastify.

---

## 1. Diagrama de Classes

```mermaid
classDiagram
    class AddressController {
        +createAddress(req, reply)
        +getAddresses(req, reply)
    }

    class AnnouncementController {
        +createAnnouncement(req, reply)
        +createAnnouncementImage(req, reply)
        +getAnnouncements(req, reply)
        +getAnnouncementById(req, reply)
        +updateAnnouncement(req, reply)
        +deleteAnnouncement(req, reply)
    }

    class AuthController {
        +register(req, reply)
        +login(req, reply)
    }

    class AutocompleteController {
        +getAutocompleteSuggestions(req, reply)
    }

    class OwnerController {
        +login(req, reply)
    }

    class SearchController {
        +search(req, reply)
    }

    class UniversityController {
        +getAllUniversities(req, reply)
    }

    %% Serviços
    class AddressService
    class AnnouncementService
    class AuthService
    class AutocompleteService
    class OwnerService
    class SearchService
    class UniversityService

    %% Relações entre controladores e serviços
    AddressController --> AddressService
    AnnouncementController --> AnnouncementService
    AuthController --> AuthService
    AutocompleteController --> AutocompleteService
    OwnerController --> OwnerService
    SearchController --> SearchService
    UniversityController --> UniversityService
```

## 1. Diagrama de Casos de Uso
```mermaid
   
    usecaseDiagram
    actor "Usuário" as User
    actor "Proprietário" as Owner
    
    User --> (Registrar conta)
    User --> (Login)
    User --> (Buscar anúncios)
    User --> (Visualizar anúncio)
    User --> (Ver universidades)
    User --> (Usar autocomplete de busca)
    
    Owner --> (Login de proprietário)
    Owner --> (Criar anúncio)
    Owner --> (Editar anúncio)
    Owner --> (Excluir anúncio)
