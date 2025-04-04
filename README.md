# Gerenciamento de Departamentos

## Descrição

Este projeto é um sistema de gerenciamento de departamentos que permite listar, criar, editar e excluir departamentos. A estrutura dos departamentos é organizada em forma de árvore, onde cada departamento pode ter subdepartamentos. O backend da aplicação foi desenvolvido em Laravel, enquanto o frontend utiliza React com TypeScript, integrando-se com a API via Axios e React Query. Para estilização e notificações, utilizamos SweetAlert2.

## Tecnologias Utilizadas

- **Backend:** Laravel 10
- **Frontend:** React + TypeScript
- **Gerenciamento de Estado** React Query
- **Notificações** SweetAlert2
- **Gerenciamento de Estado** React Query
- **Banco de Dados** MySQL
- **Requisições HTTP** Axios


## Ambiente Necessário

- **PHP:** >= 8.0 
- **Composer:** (para gerenciar dependências do PHP)
- **PostgreSQL:** >= 18.x
- **MySQL:** >= 8.x
- **Docker:**  (para ambiente containerizado)

## Instruções de Instalação

### Backend (Laravel)

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/felipexavier26/management-department.git

2. **Navegue até o diretório do projeto:**
   ```bash
   cd management-department

3. **Instale as dependências do Laravel:**
   ```bash
   composer install

4. **Execute as migrações e população do banco:**
   ```bash
   php artisan migrate
   php artisan db:seed --class=DepartmentSeeder

5. **Crie um arquivo .env a partir do arquivo .env.example:**
   ```bash
   cp .env.example .env

6. **Inicie o servidor Laravel:**
   ```bash
   php artisan serve

7. **Endpoints da API REST**<br>
    ```bash
   php artisan serve
  
    
8. **Frontend (React + TypeScript)**
   ```bash
   cd ../frontend

9. **Instale as dependências: **
   ```bash
    curl -X GET http://127.0.0.1:8000/api/reserva_salas

9. **Inicie o servidor React:**
   ```bash
    npm run start

1. **Endpoints da API REST Departamentos:**
   ```bash
   GET /api/departments - Lista todos os departamentos e seus filhos
   POST /api/departments - Cria um novo departamento
   GET /api/departments/{id} - Obtém informações de um departamento
   PUT /api/departments/{id} - Atualiza um departamento
   DELETE /api/departments/{id} - Exclui um departamento e seus subdepartamentos

2. **Exemplo de Uso - Listar Departamentos em Estrutura de Árvore**
   ```bash

   {
        "id": 1,
        "name": "Eletrônicos",
        "parent_department_id": null,
        "level": 0,
        "created_at": "2025-04-03T00:19:27.000000Z",
        "updated_at": "2025-04-03T00:19:27.000000Z",
        "children": [
            {
                "id": 7,
                "name": "Celulares",
                "parent_department_id": 1,
                "level": 1,
                "created_at": "2025-04-03T00:19:27.000000Z",
                "updated_at": "2025-04-03T00:19:27.000000Z",
                "children": [
                    {
                        "id": 19,
                        "name": "Acessórios para Celulares",
                        "parent_department_id": 7,
                        "level": 2,
                        "created_at": "2025-04-03T00:19:27.000000Z",
                        "updated_at": "2025-04-03T00:19:27.000000Z",
                        "children": []
                    },
                    {
                        "id": 20,
                        "name": "Smartphones",
                        "parent_department_id": 7,
                        "level": 2,
                        "created_at": "2025-04-03T00:19:27.000000Z",
                        "updated_at": "2025-04-03T00:19:27.000000Z",
                        "children": []
                    }
                ]
            },
            {
                "id": 8,
                "name": "Computadores",
                "parent_department_id": 1,
                "level": 1,
                "created_at": "2025-04-03T00:19:27.000000Z",
                "updated_at": "2025-04-03T00:19:27.000000Z",
                "children": [
                    {
                        "id": 21,
                        "name": "Notebooks",
                        "parent_department_id": 8,
                        "level": 2,
                        "created_at": "2025-04-03T00:19:27.000000Z",
                        "updated_at": "2025-04-03T00:19:27.000000Z",
                        "children": []
                    },
                    {
                        "id": 22,
                        "name": "Desktops",
                        "parent_department_id": 8,
                        "level": 2,
                        "created_at": "2025-04-03T00:19:27.000000Z",
                        "updated_at": "2025-04-03T00:19:27.000000Z",
                        "children": []
                    }
                ]
            }
        ]
   
   {
                "id": 10,
                "name": "Escritório",
                "parent_department_id": 2,
                "level": 1,
                "created_at": "2025-04-03T00:19:27.000000Z",
                "updated_at": "2025-04-03T00:19:27.000000Z",
                "children": [
                    {
                        "id": 25,
                        "name": "Mesas de Escritório",
                        "parent_department_id": 10,
                        "level": 2,
                        "created_at": "2025-04-03T00:19:27.000000Z",
                        "updated_at": "2025-04-03T00:19:27.000000Z",
                        "children": []
                    },
                    {
                        "id": 26,
                        "name": "Cadeiras de Escritório",
                        "parent_department_id": 10,
                        "level": 2,
                        "created_at": "2025-04-03T00:19:27.000000Z",
                        "updated_at": "2025-04-03T00:19:27.000000Z",
                        "children": []
                    }
                ]
            }

<br><br><br>











