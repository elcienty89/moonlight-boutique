# 🚀 Guía: Conectar GitHub con Netlify para Despliegue Automático

Esta guía te ayudará a configurar tu proyecto para que cada vez que hagas cambios y los subas a GitHub, Netlify actualice automáticamente tu sitio web.

## ✅ Requisitos Previos

- [x] Git instalado (ya lo tienes)
- [ ] Cuenta en GitHub ([crear aquí](https://github.com/signup))
- [ ] Cuenta en Netlify ([crear aquí](https://app.netlify.com/signup))

---

## 📝 Paso 1: Reiniciar tu Terminal/Editor

> **IMPORTANTE:** Necesitas cerrar y volver a abrir VS Code o tu terminal para que Git funcione.

1. **Cierra completamente VS Code** (o tu editor actual)
2. **Vuelve a abrirlo**
3. **Abre una nueva terminal** integrada

---

## 🔧 Paso 2: Configurar Git (Primera vez solamente)

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
# Configurar tu nombre (reemplaza con tu nombre)
git config --global user.name "Tu Nombre"

# Configurar tu email (reemplaza con tu email)
git config --global user.email "tuemail@example.com"

# Verificar la configuración
git config --list
```

---

## 📦 Paso 3: Crear Repositorio Local

En la carpeta de tu proyecto (`Boutique`), ejecuta:

```bash
# Inicializar repositorio Git
git init

# Ver archivos que se van a agregar
git status

# Agregar todos los archivos
git add .

# Crear el primer commit
git commit -m "🎉 Inicial: Catálogo MoonLight Boutique"
```

✅ **Resultado esperado:** Deberías ver un mensaje confirmando el commit.

---

## 🌐 Paso 4: Crear Repositorio en GitHub

### 4.1 Crear el repositorio

1. Ve a [github.com](https://github.com) y **inicia sesión**
2. Haz clic en el botón **"+"** (arriba derecha) → **"New repository"**
3. Configura el repositorio:
   - **Repository name:** `moonlight-boutique`
   - **Description:** `Catálogo digital para boutique de ropa`
   - **Visibilidad:** Público o Privado (tú decides)
   - **NO** marques "Add a README" (ya lo tienes)
4. Haz clic en **"Create repository"**

### 4.2 Conectar tu proyecto local con GitHub

GitHub te mostrará comandos. Usa estos (reemplaza `TuUsuario` con tu nombre de usuario de GitHub):

```bash
# Agregar el repositorio remoto
git remote add origin https://github.com/TuUsuario/moonlight-boutique.git

# Renombrar la rama a 'main'
git branch -M main

# Subir los archivos a GitHub
git push -u origin main
```

> **Nota:** Te pedirá autenticación. Puedes usar:
>
> - **Token de acceso personal** (recomendado)
> - **GitHub CLI**
> - **SSH keys**

Si no sabes cómo autenticarte, [sigue esta guía](https://docs.github.com/es/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls).

---

## 🔗 Paso 5: Conectar Netlify con GitHub

### 5.1 Importar desde GitHub

1. Ve a [app.netlify.com](https://app.netlify.com)
2. Haz clic en **"Add new site"** → **"Import an existing project"**
3. Selecciona **"Deploy with GitHub"**
4. **Autoriza a Netlify** para acceder a tu cuenta de GitHub
5. Busca y selecciona el repositorio **`moonlight-boutique`**

### 5.2 Configurar el despliegue

En la configuración del sitio:

- **Branch to deploy:** `main`
- **Build command:** (déjalo vacío, es un sitio estático)
- **Publish directory:** `.` (punto, significa raíz del proyecto)

6. Haz clic en **"Deploy site"**

✅ **¡Listo!** Netlify creará tu sitio y te dará una URL.

---

## 🔄 Paso 6: Flujo de Trabajo Diario

Ahora, cada vez que quieras actualizar tu sitio:

```bash
# 1. Edita tus archivos (products.js, index.html, etc.)

# 2. Ver qué cambió
git status

# 3. Agregar los cambios
git add .

# 4. Crear un commit con un mensaje descriptivo
git commit -m "Agregados nuevos productos de invierno"

# 5. Subir a GitHub
git push
```

**🎉 ¡Automático!** Netlify detectará los cambios en GitHub y actualizará tu sitio en 1-2 minutos.

---

## 🎯 Comandos Útiles de Git

```bash
# Ver el historial de cambios
git log --oneline

# Ver qué archivos cambiaron
git status

# Ver diferencias específicas
git diff

# Deshacer cambios locales (antes de commit)
git checkout -- nombre-archivo.js

# Ver ramas
git branch

# Crear una nueva rama
git checkout -b nueva-funcionalidad
```

---

## 🆘 Solución de Problemas

### ❌ "git: command not found"

**Solución:** Reinicia tu terminal/editor completamente.

### ❌ Error al hacer push: "authentication failed"

**Solución:** Necesitas configurar autenticación. Opciones:

1. **Token personal:** [Crear aquí](https://github.com/settings/tokens)
2. **GitHub CLI:** `winget install GitHub.cli`

### ❌ Netlify no detecta cambios

**Solución:**

1. Verifica que los cambios estén en GitHub (ve a tu repositorio en github.com)
2. En Netlify → Site settings → Build & deploy → Trigger deploy

---

## 📚 Recursos Adicionales

- [Documentación de Git](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Netlify Docs](https://docs.netlify.com/)
- [Conectar Netlify con GitHub](https://docs.netlify.com/configure-builds/get-started/)

---

## ✨ Beneficios de este Setup

✅ **No más cargas manuales** - Solo haz `git push`  
✅ **Historial de cambios** - Puedes volver a versiones anteriores  
✅ **Trabajo en equipo** - Otros pueden colaborar  
✅ **Respaldo automático** - Tu código está seguro en GitHub  
✅ **Despliegue instantáneo** - Cambios en vivo en 1-2 minutos  

---

**¿Necesitas ayuda?** Avísame en qué paso estás y te ayudo específicamente. 🚀
