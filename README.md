<h1 align="center">An application frontend for backend <a href="https://github.com/armandwipangestu/gis-api">https://github.com/armandwipangestu/gis-api</a></h1></h1>

<div align="center">

![Vite.js](https://img.shields.io/badge/-Vite.js-F9FAFC?style=for-the-badge&logo=vite)&nbsp;
![React.js](https://img.shields.io/badge/-React.js-F9FAFC?style=for-the-badge&logo=react)&nbsp;
![TanStack Query](https://img.shields.io/badge/-TanStack%20Query-131821?style=for-the-badge&logo=tanstack)&nbsp;
![OpenStreetMap](https://img.shields.io/badge/-OpenStreetMap-131821?style=for-the-badge&logo=openstreetmap)&nbsp;
![Docker](https://img.shields.io/badge/-Docker-F9FAFC?style=for-the-badge&logo=docker)&nbsp;

</div>

<p align="center">A GIS Application built using React.js, TanStack Query, Axios, OpenStreetMap, and Golang as Backend</p>

---

## Table of Contents

-   [Features](#features)
-   [Requirements](#requirements)
-   [Project Structure](#project-structure)
-   [Running the Application](#running-the-application)
    -   [Development Mode](#development-mode)
    -   [Running with Docker](#running-with-docker)
    -   [Running with Docker Compose](#running-with-docker-compose)

---

## Features

-   Authentication (cookies + jwt)
-   RBAC (Role-Based Action Control)
-   Components, Hooks, Types (Reusable, Caching, Static Typing)
-   Support build manual, and Docker image

## Requirements

-   Node.js 20+
-   NPM 10+
-   Git
-   Docker & Docker Compose (optional)

## Project Structure

```bash
 gis-ui
├──  CHANGELOG.md
├──  docker-compose.yml
├──  Dockerfile
├──  eslint.config.js
├──  index.html
├──  nginx.conf
├──  package-lock.json
├──  package.json
├──  public
│  └── 󰕙 vite.svg
├──  README.md
├──  src
│  ├──  App.css
│  ├──  App.tsx
│  ├──  assets
│  │  └── 󰕙 react.svg
│  ├──  components
│  │  ├──  Admin
│  │  │  └──  Map
│  │  │     ├──  GeometryEditor.tsx
│  │  │     ├──  MapWithGeometryEditor.tsx
│  │  │     └──  RecenterOnProps.tsx
│  │  ├──  App
│  │  │  ├──  Header.tsx
│  │  │  └──  Sidebar.tsx
│  │  ├──  General
│  │  │  ├──  Error.tsx
│  │  │  ├──  Loading.tsx
│  │  │  ├──  Pagination.tsx
│  │  │  └──  TableEmptyRow.tsx
│  │  └──  Public
│  │     ├──  Category
│  │     │  └──  CategoryItem.tsx
│  │     └──  Map
│  │        └──  MapViewer.tsx
│  ├──  hooks
│  │  ├──  admin
│  │  │  ├──  category
│  │  │  │  ├──  useCategories.tsx
│  │  │  │  ├──  useCategoriesAll.tsx
│  │  │  │  ├──  useCategoryCreate.tsx
│  │  │  │  ├──  useCategoryDelete.tsx
│  │  │  │  ├──  useCategoryEdit.tsx
│  │  │  │  └──  useCategoryUpdate.tsx
│  │  │  ├──  dashboard
│  │  │  │  └──  useDashboard.tsx
│  │  │  ├──  map
│  │  │  │  ├──  useMapById.tsx
│  │  │  │  ├──  useMapConfiguration.tsx
│  │  │  │  ├──  useMapCreate.tsx
│  │  │  │  ├──  useMapDelete.tsx
│  │  │  │  ├──  useMaps.tsx
│  │  │  │  └──  useMapUpdate.tsx
│  │  │  ├──  permission
│  │  │  │  ├──  usePermissionById.tsx
│  │  │  │  ├──  usePermissionCreate.tsx
│  │  │  │  ├──  usePermissionDelete.tsx
│  │  │  │  ├──  usePermissions.tsx
│  │  │  │  ├──  usePermissionsAll.tsx
│  │  │  │  └──  usePermissionUpdate.tsx
│  │  │  ├──  role
│  │  │  │  ├──  useRoleAll.tsx
│  │  │  │  ├──  useRoleById.tsx
│  │  │  │  ├──  useRoleDelete.tsx
│  │  │  │  ├──  useRoles.tsx
│  │  │  │  ├──  useRoleUpdate.tsx
│  │  │  │  └──  useRouteCreate.tsx
│  │  │  ├──  setting
│  │  │  │  ├──  useSetting.tsx
│  │  │  │  └──  useSettingUpdate.tsx
│  │  │  └──  user
│  │  │     ├──  useUserById.tsx
│  │  │     ├──  useUserCreate.tsx
│  │  │     ├──  useUserDelete.tsx
│  │  │     ├──  useUsers.tsx
│  │  │     └──  useUserUpdate.tsx
│  │  └──  public
│  │     ├──  category
│  │     │  └──  useCategories.tsx
│  │     ├── 󱂵 home
│  │     │  └──  useHomeData.tsx
│  │     ├──  setting
│  │     │  └──  useSetting.tsx
│  │     └──  sidebar
│  │        ├──  useMediaQuery.tsx
│  │        └──  useSidebarBreakpointSync.tsx
│  ├──  index.css
│  ├──  layouts
│  │  └──  AppLayout.tsx
│  ├──  main.tsx
│  ├──  routes
│  │  └──  index.tsx
│  ├──  services
│  │  └──  api.ts
│  ├──  stores
│  │  ├──  auth.ts
│  │  └──  sidebar.ts
│  ├──  types
│  │  ├──  auth.ts
│  │  ├──  category.ts
│  │  ├──  dashboard.ts
│  │  ├──  map.ts
│  │  ├──  params.ts
│  │  ├──  permission.ts
│  │  ├──  role.ts
│  │  ├──  setting.ts
│  │  └──  user.ts
│  ├──  utils
│  │  ├──  geojson.ts
│  │  └──  permissions.ts
│  ├──  views
│  │  ├──  admin
│  │  │  ├──  categories
│  │  │  │  ├──  create.tsx
│  │  │  │  ├──  edit.tsx
│  │  │  │  └──  index.tsx
│  │  │  ├──  dashboard
│  │  │  │  └──  index.tsx
│  │  │  ├──  forbidden
│  │  │  │  └──  index.tsx
│  │  │  ├──  maps
│  │  │  │  ├──  create.tsx
│  │  │  │  ├──  edit.tsx
│  │  │  │  └──  index.tsx
│  │  │  ├──  permissions
│  │  │  │  ├──  create.tsx
│  │  │  │  ├──  edit.tsx
│  │  │  │  └──  index.tsx
│  │  │  ├──  roles
│  │  │  │  ├──  create.tsx
│  │  │  │  ├──  edit.tsx
│  │  │  │  └──  index.tsx
│  │  │  ├──  settings
│  │  │  │  └──  index.tsx
│  │  │  └──  users
│  │  │     ├──  create.tsx
│  │  │     ├──  edit.tsx
│  │  │     └──  index.tsx
│  │  ├──  auth
│  │  │  └──  login.tsx
│  │  └──  public
│  │     └── 󱂵 home
│  │        └──  index.tsx
│  └──  vite-env.d.ts
├──  tsconfig.app.json
├──  tsconfig.json
├──  tsconfig.node.json
└──  vite.config.ts
```

## Running the Application

### Development Mode

1. Clone Repository & Install dependencies

```bash
git clone https://github.com/armandwipangestu/gis-ui && cd gis-ui
npm install
```

2. Setup Environment Variable

```bash
cp .env.example .env.local
```

Fill with your own configuration

```bash
VITE_BASE_URL=http://localhost:3000
```

3. Running the application

> [!NOTE]
> Access the UI at http://localhost:5173

```bash
npm run dev
```

### Running with Docker

1. Build the image

```bash
docker build --build-arg VITE_BASE_URL=http://gis-api:3000 -t gis-ui .
```

2. Run the image

```bash
docker run -p 5173:5173 gis-ui
```

### Running with Docker Compose

1. Copy the `.env.example`

```bash
cp .env.example .env.local
```

2. Fill the value of `.env.local` with your own configuration

```bash
VITE_BASE_URL=http://localhost:3000
```

3. Runing the application using compose

```bash
docker compose up -d
```
