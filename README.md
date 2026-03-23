# PawsConnect 🐾

Sistema de adoção de pets conectando ONGs e adotantes.

## Tecnologias

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: PocketBase
- **Autenticação**: PocketBase Auth

## Como rodar o projeto

### 1. Clone o repositório
```bash
git clone seu-repositorio
cd pawsconnect
```

### 2. Instale as dependências

**Dependências da raiz:**
```bash
npm install
```

**Dependências do frontend:**
```bash
cd web
npm install
cd ..
```

### 3. Inicie o PocketBase (Backend)

```bash
cd pocketbase
./pocketbase serve
```

O PocketBase vai rodar em: http://127.0.0.1:8090

**Primeira vez rodando?**
- Acesse http://127.0.0.1:8090/_/
- Crie uma conta de administrador
- As migrações vão criar as tabelas automaticamente

### 4. Configure as permissões do PocketBase

**IMPORTANTE:** Configure as API Rules para cada coleção:

1. Acesse http://127.0.0.1:8090/_/
2. Vá em "Collections"
3. Para cada coleção (users, pets, adoption_inquiries, favorites):
   - Clique na coleção
   - Vá na aba "API Rules"
   - Clique no ícone do cadeado de cada regra
   - **Apague o texto "Superusers only"** e deixe vazio
   - Salve

**Permissões recomendadas:**

**users:**
- List: (vazio)
- View: (vazio)
- Create: (vazio)
- Update: `@request.auth.id = id`
- Delete: `@request.auth.id = id`

**pets:**
- List: (vazio)
- View: (vazio)
- Create: `@request.auth.id != ""`
- Update: `@request.auth.id = ngoId`
- Delete: `@request.auth.id = ngoId`

**favorites:**
- List: `@request.auth.id = userId`
- View: `@request.auth.id = userId`
- Create: `@request.auth.id != "" && @request.auth.id = userId`
- Update: `@request.auth.id = userId`
- Delete: `@request.auth.id = userId`

**adoption_inquiries:**
- List: `@request.auth.id = ngoId`
- View: `@request.auth.id = ngoId`
- Create: (vazio)
- Update: `@request.auth.id = ngoId`
- Delete: `@request.auth.id = ngoId`

### 5. Inicie o Frontend

Em outro terminal:

```bash
cd web
npm run dev
```

O frontend vai rodar em: http://localhost:3000

## Estrutura do Projeto

```
pawsconnect/
├── pocketbase/           # Backend (PocketBase)
│   ├── pocketbase.exe    # Executável do PocketBase
│   ├── pb_migrations/    # Migrações do banco
│   └── pb_data/          # Dados do banco (não commitado)
├── web/                  # Frontend (React)
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── ui/           # Componentes de UI
│   │   ├── context/      # Context API (Auth)
│   │   └── lib/          # Utilitários
│   └── package.json
└── package.json
```

## Funcionalidades

### Para Usuários (Adotantes)
- ✅ Criar conta e fazer login
- ✅ Navegar e buscar pets disponíveis
- ✅ Favoritar pets
- ✅ Ver detalhes dos pets
- ✅ Enviar consultas de adoção

### Para ONGs
- ✅ Criar conta e fazer login
- ✅ Dashboard para gerenciar pets
- ✅ Adicionar, editar e remover pets
- ✅ Ver consultas de adoção recebidas
- ✅ Gerenciar informações dos pets (fotos, saúde, vacinas)

## Coleções do PocketBase

### users (auth)
- email, password
- userType: "ngo" ou "adopter"
- ngoName, contactPhone, address (para ONGs)

### pets
- petName, breed, age, petType
- healthStatus, vaccinationStatus, vaccines, diseases
- description, petPhoto
- ngoId (relação com users)

### favorites
- userId (relação com users)
- petId (relação com pets)

### adoption_inquiries
- petId, ngoId
- adopterName, adopterEmail, adopterPhone
- message

## Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar PocketBase
cd pocketbase && ./pocketbase serve

# Rodar frontend em desenvolvimento
cd web && npm run dev

# Build do frontend para produção
cd web && npm run build
```

## Troubleshooting

**Erro 403 (Forbidden):**
- Verifique se as permissões do PocketBase estão configuradas corretamente

**Erro de conexão com o backend:**
- Certifique-se que o PocketBase está rodando em http://127.0.0.1:8090

**node_modules muito grande:**
- Não commite node_modules (já está no .gitignore)
- Sempre rode `npm install` após clonar

## Licença

MIT
